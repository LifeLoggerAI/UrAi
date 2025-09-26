import RouteState from "@/components/feedback/RouteState";
import { recordRouteLoading } from "@/lib/telemetry/routeTelemetry";

recordRouteLoading("root");

export default function GlobalLoading() {
  return (
    <RouteState
      variant="loading"
      title="Summoning your stars"
      description="We are warming up the constellations and syncing your last known memories."
    />
  );
}
