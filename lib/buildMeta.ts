const FALLBACK_BUILD_VERSION = "3.1.local";
const FALLBACK_BUILD_UPDATED_AT = "2026-06-09T19:00:00.000Z";

function validIsoDate(value?: string) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

export const BUILD_VERSION = process.env.NEXT_PUBLIC_BUILD_VERSION || FALLBACK_BUILD_VERSION;
export const BUILD_UPDATED_AT =
  validIsoDate(process.env.NEXT_PUBLIC_BUILD_UPDATED_AT) ?? FALLBACK_BUILD_UPDATED_AT;
