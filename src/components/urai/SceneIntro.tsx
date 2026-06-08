"use client";

type SceneIntroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
};

export function SceneIntro({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SceneIntroProps) {
  const alignmentClass =
    align === "left"
      ? "text-left"
      : align === "right"
      ? "text-right"
      : "text-center";

  return (
    <section className={`pointer-events-none max-w-2xl ${alignmentClass}`}>
      {eyebrow ? (
        <p className="mb-3 text-xs uppercase tracking-[0.36em] text-white/45">
          {eyebrow}
        </p>
      ) : null}

      <h1 className="text-3xl font-light tracking-[-0.04em] text-white/90 md:text-5xl">
        {title}
      </h1>

      {subtitle ? (
        <p className="mt-4 text-sm leading-6 text-white/50 md:text-base">
          {subtitle}
        </p>
      ) : null}
    </section>
  );
}
