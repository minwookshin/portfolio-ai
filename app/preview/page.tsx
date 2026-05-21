"use client";

import { Button, ButtonVariant, ButtonSize } from "@/components/material/Button";
import { IconButton } from "@/components/material/IconButton";
import { Chip } from "@/components/material/Chip";
import { SplitButton } from "@/components/material/SplitButton";
import { Mic } from "lucide-react";

const variants: ButtonVariant[] = ["elevated", "filled", "tonal", "outlined", "text"];
const sizes: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function PreviewPage() {
  return (
    <main className="min-h-screen bg-surface text-on-surface p-12 space-y-12">
      <section className="space-y-4">
        <h2 className="text-2xl font-light">Buttons — variants</h2>
        <div className="flex flex-wrap items-center gap-4">
          {variants.map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Buttons — sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          {sizes.map((s) => (
            <Button key={s} size={s}>{s}</Button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Icon buttons</h2>
        <div className="flex flex-wrap items-center gap-4">
          <IconButton aria-label="Mic"><Mic className="w-5 h-5" /></IconButton>
          <IconButton aria-label="Mic selected" selected><Mic className="w-5 h-5" /></IconButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Chips</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Chip>Projects</Chip>
          <Chip selected>About me</Chip>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-light">Split button</h2>
        <SplitButton
          label="Save"
          onClick={() => {}}
          menuItems={[
            { label: "Save as draft", onSelect: () => {} },
            { label: "Save and publish", onSelect: () => {} },
          ]}
        />
      </section>
    </main>
  );
}
