import type { SystemRepo } from "@/lib/system-registry";
import SystemStatusCard from "./SystemStatusCard";

type SystemStatusMatrixProps = {
  title: string;
  description: string;
  repos: SystemRepo[];
  emphasis?: "primary" | "standard" | "warning";
};

export default function SystemStatusMatrix({ title, description, repos, emphasis = "standard" }: SystemStatusMatrixProps) {
  return (
    <section className="mt-10">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/62 md:text-base">{description}</p>
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {repos.map((repo) => (
          <SystemStatusCard key={repo.name} repo={repo} emphasis={emphasis} />
        ))}
      </div>
    </section>
  );
}
