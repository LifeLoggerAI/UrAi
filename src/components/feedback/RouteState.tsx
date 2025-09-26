import React from "react";

const VARIANT_STYLES: Record<
  RouteStateVariant,
  { container: string; badge: string }
> = {
  loading: {
    container:
      "border border-blue-400/40 bg-blue-500/10 text-blue-100",
    badge: "bg-blue-500/30 text-blue-100",
  },
  error: {
    container: "border border-red-500/40 bg-red-500/10 text-red-100",
    badge: "bg-red-500/40 text-red-100",
  },
  info: {
    container:
      "border border-white/15 bg-white/5 text-white/90 backdrop-blur",
    badge: "bg-white/10 text-white/80",
  },
};

export type RouteStateVariant = "loading" | "error" | "info";

export type RouteStateProps = {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: RouteStateVariant;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryAction?: React.ReactNode;
};

export default function RouteState({
  title,
  description,
  icon,
  variant = "info",
  primaryActionLabel,
  onPrimaryAction,
  secondaryAction,
}: RouteStateProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-white">
      <div
        className={`w-full max-w-xl space-y-6 rounded-3xl p-10 shadow-xl transition ${styles.container}`}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <span className={`grid h-12 w-12 place-items-center rounded-2xl ${styles.badge}`}>
              {icon}
            </span>
          )}
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">
              {variant === "loading"
                ? "Preparing view"
                : variant === "error"
                  ? "Something went wrong"
                  : "Status update"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold lg:text-3xl">{title}</h1>
          </div>
        </div>

        {description && (
          <div className="space-y-3 text-sm leading-relaxed text-white/70">
            {typeof description === "string" ? <p>{description}</p> : description}
          </div>
        )}

        {(primaryActionLabel || secondaryAction) && (
          <div className="flex flex-wrap gap-3">
            {primaryActionLabel && (
              <button
                type="button"
                onClick={onPrimaryAction}
                className={[
                  "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2",
                  "text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white/40",
                ].join(" ")}
              >
                {primaryActionLabel}
              </button>
            )}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );
}
