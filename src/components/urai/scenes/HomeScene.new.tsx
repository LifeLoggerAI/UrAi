import { PortalNav } from "@/components/urai/PortalNav";
import { HomeWorldCanvas } from "@/components/urai/home/HomeWorldCanvas";
import { UserFieldState, MemoryStar, ReplayScene, PassportPermission } from "@/lib/urai/types";


type HomeSceneProps = {
    userFieldState: UserFieldState;
    memoryStars: MemoryStar[];
    replayScenes: ReplayScene[];
    passportPermissions: PassportPermission[];
    onNavigate: (scene: any) => void;
}

export function HomeScene({onNavigate, }: HomeSceneProps) {
  return (
    <section className="relative z-10 min-h-screen w-full overflow-hidden">
      <HomeWorldCanvas />
      <div className="pointer-events-none absolute inset-0 z-40 flex min-h-screen w-full flex-col items-center justify-between px-6 py-12">
        <div />
        <div className="pointer-events-auto w-full pb-2"><PortalNav onNavigate={onNavigate} activeScene="home" /></div>
      </div>
    </section>
  );
}
