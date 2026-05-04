import HomeScene from "@/components/HomeScene";
import SystemRoutePage from "@/components/SystemRoutePage";

export default function HomePage() {
  return (
    <div>
      <HomeScene />
      <SystemRoutePage
        title="Narrator Home"
        description="Home is wired to the passive narrator surface, mood forecast entry point, and Life Map transition affordance."
        status="demo"
      />
    </div>
  );
}
