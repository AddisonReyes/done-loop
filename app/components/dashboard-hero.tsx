type DashboardHeroProps = {
  completionRate: number;
  activeDays: number;
  todoCount: number;
};

type HeroStatProps = {
  label: string;
  value: string | number;
};

function HeroStat({ label, value }: HeroStatProps) {
  return (
    <div className="flex aspect-square min-h-[112px] flex-col rounded-2xl border border-white/8 bg-white/4 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
      <div className="mt-auto text-2xl font-semibold leading-none text-white">
        {value}
      </div>
    </div>
  );
}

export function DashboardHero({
  completionRate,
  activeDays,
  todoCount,
}: DashboardHeroProps) {
  return (
    <section className="glass-panel float-in rounded-[28px] px-6 py-7 sm:px-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-zinc-300">
            Simple daily system
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Minimal structure for habits and tasks.
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
            A focused, local-first dashboard with clean visual polish.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 self-start sm:min-w-[360px] lg:w-[372px]">
          <HeroStat label="Today" value={`${completionRate}%`} />
          <HeroStat label="Active days" value={activeDays} />
          <HeroStat label="Tasks" value={todoCount} />
        </div>
      </div>
    </section>
  );
}
