import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { hoverPreviewDefaults, hoverPreviewManifest } from "./hover-preview-manifest.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "public/projects/previews");
const tempDir = path.join(root, ".hover-preview-render");

function abs(relativePath) {
  return path.join(root, relativePath);
}

function seconds(value) {
  return Number(value).toFixed(3);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: options.quiet ? "pipe" : "inherit",
    encoding: options.quiet ? "utf8" : undefined,
  });
  if (result.status !== 0) {
    const details = options.quiet && result.stderr ? `\n${result.stderr}` : "";
    throw new Error(`${command} failed with exit code ${result.status}${details}`);
  }
}

function ffmpeg(args) {
  run("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args]);
}

function ensureTools() {
  run("ffmpeg", ["-version"], { quiet: true });
  run("ffprobe", ["-version"], { quiet: true });
}

function encodeArgs(crf = hoverPreviewDefaults.crf) {
  return [
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    String(crf),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
  ];
}

function scaleFilter(scene) {
  const { width, height } = hoverPreviewDefaults;

  if (scene.fit === "cover") {
    return `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`;
  }

  if (scene.height) {
    return `scale=-2:${scene.height}`;
  }

  if (scene.width) {
    return `scale=${scene.width}:-2`;
  }

  return `scale=${width}:${height}:force_original_aspect_ratio=decrease`;
}

function signed(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function progress(duration) {
  return `min(t/${seconds(duration)},1)`;
}

function midpointExpression(start = 0, end = start, duration) {
  return `${start}+(${end - start})*${progress(duration)}`;
}

function layerScaleFilter(layer, duration) {
  if (layer.heightStart || layer.heightEnd || layer.height) {
    const start = layer.heightStart ?? layer.height ?? layer.heightEnd;
    const end = layer.heightEnd ?? layer.height ?? layer.heightStart;
    return `scale=w=-2:h='trunc((${midpointExpression(start, end, duration)})/2)*2':eval=frame`;
  }

  const start = layer.widthStart ?? layer.width ?? layer.widthEnd;
  const end = layer.widthEnd ?? layer.width ?? layer.widthStart;

  if (start) {
    return `scale=w='trunc((${midpointExpression(start, end, duration)})/2)*2':h=-2:eval=frame`;
  }

  return scaleFilter(layer);
}

function layerFilter(layer, inputIndex, duration) {
  const steps = [`[${inputIndex}:v]format=rgba`, layerScaleFilter(layer, duration)];
  const fadeIn = layer.fadeIn ?? 0.28;
  const fadeOut = layer.fadeOut ?? 0;

  if (layer.opacity && layer.opacity < 1) {
    steps.push(`colorchannelmixer=aa=${layer.opacity}`);
  }

  if (fadeIn > 0) {
    steps.push(`fade=t=in:st=${seconds(layer.start ?? 0)}:d=${seconds(fadeIn)}:alpha=1`);
  }

  if (fadeOut > 0) {
    steps.push(`fade=t=out:st=${seconds(Math.max(duration - fadeOut, 0))}:d=${seconds(fadeOut)}:alpha=1`);
  }

  return `${steps.join(",")}[layer${inputIndex}]`;
}

function renderCompositionSegment(project, scene, index) {
  const { width, height, fps } = hoverPreviewDefaults;
  const duration = scene.duration;
  const frames = Math.round(duration * fps);
  const output = path.join(tempDir, `${project.slug}-${index}.mp4`);
  const inputs = scene.layers.flatMap((layer) => ["-loop", "1", "-i", abs(layer.src)]);
  const filters = [];
  let previous = "[0:v]";

  for (const [layerIndex, layer] of scene.layers.entries()) {
    const inputIndex = layerIndex + 1;
    const layerName = `[layer${inputIndex}]`;
    const out = `[comp${layerIndex}]`;
    const x = `(W-w)/2+${midpointExpression(layer.xStart ?? layer.x ?? 0, layer.xEnd ?? layer.x ?? layer.xStart ?? 0, duration)}`;
    const y = `(H-h)/2+${midpointExpression(layer.yStart ?? layer.y ?? 0, layer.yEnd ?? layer.y ?? layer.yStart ?? 0, duration)}`;

    filters.push(layerFilter(layer, inputIndex, duration));
    filters.push(`${previous}${layerName}overlay=x='${x}':y='${y}':format=auto:shortest=1${out}`);
    previous = out;
  }

  filters.push(`${previous}setsar=1,format=yuv420p[v]`);

  ffmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    `color=c=${scene.background ?? "white"}:s=${width}x${height}:r=${fps}:d=${seconds(duration)}`,
    ...inputs,
    "-filter_complex",
    filters.join(";"),
    "-map",
    "[v]",
    "-frames:v",
    String(frames),
    ...encodeArgs(project.crf),
    output,
  ]);

  return { output, duration };
}

function stillSegmentFilter(scene, frames) {
  const { width, height, fps } = hoverPreviewDefaults;
  const zoomStart = scene.zoomStart ?? 1;
  const zoomEnd = scene.zoomEnd ?? 1.018;
  const zoomDelta = zoomEnd - zoomStart;
  const panX = scene.panX ?? 0;
  const panY = scene.panY ?? 0;
  const offsetX = scene.offsetX ?? 0;
  const offsetY = scene.offsetY ?? 0;
  const zoomDenominator = Math.max(frames - 1, 1);

  return [
    `[1:v]format=rgba,${scaleFilter(scene)}[fg]`,
    `[0:v][fg]overlay=x=(W-w)/2${signed(offsetX)}:y=(H-h)/2${signed(offsetY)}:format=auto:shortest=1[base]`,
    `[base]zoompan=z=${zoomStart}+${zoomDelta}*on/${zoomDenominator}:x=iw/2-(iw/zoom/2)${signed(panX)}*on/${zoomDenominator}:y=ih/2-(ih/zoom/2)${signed(panY)}*on/${zoomDenominator}:d=1:s=${width}x${height}:fps=${fps},setsar=1,format=yuv420p[v]`,
  ].join(";");
}

function renderStillSegment(project, scene, index) {
  const { width, height, fps } = hoverPreviewDefaults;
  const frames = Math.round(scene.duration * fps);
  const output = path.join(tempDir, `${project.slug}-${index}.mp4`);
  const filter = stillSegmentFilter(scene, frames);

  ffmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    `color=c=white:s=${width}x${height}:r=${fps}:d=${seconds(scene.duration)}`,
    "-loop",
    "1",
    "-i",
    abs(scene.src),
    "-filter_complex",
    filter,
    "-map",
    "[v]",
    "-frames:v",
    String(frames),
    ...encodeArgs(project.crf),
    output,
  ]);

  return { output, duration: scene.duration };
}

function combineSegments(project, segments, output) {
  if (segments.length === 1) {
    const duration = segments[0].duration;
    ffmpeg([
      "-y",
      "-i",
      segments[0].output,
      "-vf",
      `fade=t=in:st=0:d=0.18:color=white,fade=t=out:st=${seconds(Math.max(duration - 0.38, 0))}:d=0.38:color=white,format=yuv420p`,
      ...encodeArgs(project.crf),
      output,
    ]);
    return output;
  }

  const xfade = project.fade ?? hoverPreviewDefaults.fade;
  const inputs = segments.flatMap((segment) => ["-i", segment.output]);
  let elapsed = segments[0].duration;
  let previous = "[0:v]";
  const filters = [];

  for (let index = 1; index < segments.length; index += 1) {
    const out = `[x${index}]`;
    const offset = Math.max(elapsed - xfade, 0);
    filters.push(`${previous}[${index}:v]xfade=transition=fade:duration=${seconds(xfade)}:offset=${seconds(offset)},format=yuv420p${out}`);
    previous = out;
    elapsed += segments[index].duration - xfade;
  }

  filters.push(`${previous}fade=t=in:st=0:d=0.18:color=white,fade=t=out:st=${seconds(Math.max(elapsed - 0.38, 0))}:d=0.38:color=white,format=yuv420p[v]`);

  ffmpeg([
    "-y",
    ...inputs,
    "-filter_complex",
    filters.join(";"),
    "-map",
    "[v]",
    ...encodeArgs(project.crf),
    output,
  ]);

  return output;
}

function renderStillProject(project) {
  const segments = project.scenes.map((scene, index) => renderStillSegment(project, scene, index));
  return combineSegments(project, segments, path.join(outDir, `${project.slug}.mp4`));
}

function renderCompositionProject(project) {
  const segments = project.scenes.map((scene, index) => renderCompositionSegment(project, scene, index));
  return combineSegments(project, segments, path.join(outDir, `${project.slug}.mp4`));
}

function renderVideoProject(project) {
  const { width, height, fps } = hoverPreviewDefaults;
  const duration = project.duration;
  const output = path.join(outDir, `${project.slug}.mp4`);
  const scaleAndFrame =
    project.fit === "cover"
      ? [
          `scale=${width}:${height}:force_original_aspect_ratio=increase`,
          `crop=${width}:${height}:x='(iw-ow)/2+${midpointExpression(project.xStart ?? 0, project.xEnd ?? project.xStart ?? 0, duration)}':y='(ih-oh)/2+${midpointExpression(project.yStart ?? 0, project.yEnd ?? project.yStart ?? 0, duration)}'`,
        ]
      : [`scale=${width}:${height}:force_original_aspect_ratio=decrease`, `pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:color=white`];
  const filter = [`fps=${fps}`, ...scaleAndFrame, "setsar=1", `fade=t=in:st=0:d=0.18:color=white`, `fade=t=out:st=${seconds(Math.max(duration - 0.38, 0))}:d=0.38:color=white`, "format=yuv420p"].join(",");

  ffmpeg([
    "-y",
    "-ss",
    seconds(project.start ?? 0),
    "-t",
    seconds(duration),
    "-i",
    abs(project.src),
    "-vf",
    filter,
    "-r",
    String(fps),
    ...encodeArgs(project.crf),
    output,
  ]);

  return output;
}

function renderProject(project) {
  if (project.mode === "video") return renderVideoProject(project);
  if (project.mode === "stills") return renderStillProject(project);
  if (project.mode === "composition") return renderCompositionProject(project);
  throw new Error(`Unknown preview mode for ${project.slug}: ${project.mode}`);
}

function main() {
  ensureTools();
  mkdirSync(outDir, { recursive: true });
  rmSync(tempDir, { recursive: true, force: true });
  mkdirSync(tempDir, { recursive: true });

  try {
    for (const project of hoverPreviewManifest) {
      console.log(`\nRendering ${project.slug}...`);
      const output = renderProject(project);
      const size = statSync(output).size;
      console.log(`Wrote ${path.relative(root, output)} (${Math.round(size / 1024)} KB)`);
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main();
