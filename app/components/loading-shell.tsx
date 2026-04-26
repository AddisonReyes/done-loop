import { AppFooter } from "./app-footer";

export function LoadingShell() {
  return (
    <div className="min-h-dvh flex flex-col text-zinc-100">
      <header className="w-full border-b border-white/8">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              EasyToDo
            </h1>
            <p className="text-sm text-zinc-400">
              Local habit tracker + todo list
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            Private by design
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <section className="glass-panel rounded-[28px] px-6 py-7">
          <div className="h-3 w-24 rounded-full bg-white/10" />
          <div className="mt-4 h-11 max-w-md rounded-2xl bg-white/8" />
          <div className="mt-3 h-5 max-w-xl rounded-full bg-white/6" />
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
