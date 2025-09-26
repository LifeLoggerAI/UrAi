import Link from "next/link";
import RouteState from "@/components/feedback/RouteState";
import { recordRouteNotFound } from "@/lib/telemetry/routeTelemetry";

recordRouteNotFound(undefined, { scope: "root" });

export default function NotFound() {
  return (
    <RouteState
      title="This constellation isn't charted yet"
      description="The page you were looking for may have shifted to a new coordinate. Double-check the URL or head back to the home timeline."
      secondaryAction={
        <Link
          href="/"
          className={[
            "inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2",
            "text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/30 hover:text-white",
          ].join(" ")}
        >
          Return home ↗
        </Link>
      }
    />
  );
}
