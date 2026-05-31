"use client";

import { useMemo, useState } from "react";

const playStoreHref = "#google-play-coming-soon";

const translations = {
  en: {
    languageLabel: "Language",
    navFeatures: "Features",
    navDemo: "Demo",
    badge: "Local-first habit and task planning",
    heroTitle: "Keep your day moving in one quiet loop.",
    heroText:
      "Done Loop brings habits, tasks, calendar context, reminders, and personalization into a focused mobile app that works from your device first.",
    playCta: "Download on Google Play",
    playNote: "Placeholder link until the Play Store listing is live.",
    demoCta: "Try the demo",
    featureTitle: "Built for daily follow-through",
    featureText:
      "A simple system for seeing what matters, checking it off, and returning tomorrow without noise.",
    features: [
      ["Habits", "Track repeat routines and complete today with one tap."],
      ["Tasks", "Capture priorities, due dates, and status without a heavy workflow."],
      ["Calendar", "Preview history and planned work in one lightweight view."],
      ["Reminders", "Use local notifications for habits and dated tasks."],
      ["Personalization", "Choose language, date format, theme, and accent color."],
      ["Local-first storage", "Keep personal productivity data stored on the device."],
    ],
    demoTitle: "A small loop, ready for the day",
    demoText:
      "Tap through a mocked flow that mirrors the mobile app rhythm: complete a habit, progress a task, review the week, then personalize the space.",
    demoTabs: {
      habit: "Habit",
      task: "Task",
      calendar: "Calendar",
      settings: "Settings",
    },
    demo: {
      habit: {
        kicker: "Morning habit",
        title: "Drink water",
        body: "Mark today's small routine and keep the monthly streak visible.",
        action: "Complete habit",
        done: "Completed today",
      },
      task: {
        kicker: "Focused task",
        title: "Plan tomorrow",
        body: "Move a task from planned to done without leaving the daily view.",
        action: "Mark task done",
        done: "Task complete",
      },
      calendar: {
        kicker: "Calendar preview",
        title: "This week",
        body: "Habit completion and dated tasks sit together so the week has context.",
        action: "Preview history",
        done: "History preview open",
      },
      settings: {
        kicker: "Personalization",
        title: "Purple dark mode",
        body: "The app can stay calm and familiar with language, format, and color settings.",
        action: "Apply accent",
        done: "Purple accent active",
      },
    },
    stats: ["3 habits", "4 tasks", "7-day view"],
    finalTitle: "Start with one loop.",
    finalText:
      "The first public Android release is being prepared. Keep the placeholder ready for the Google Play listing.",
  },
  es: {
    languageLabel: "Idioma",
    navFeatures: "Funciones",
    navDemo: "Demo",
    badge: "Planificacion local de habitos y tareas",
    heroTitle: "Mantén tu día avanzando en un ciclo tranquilo.",
    heroText:
      "Done Loop reúne hábitos, tareas, calendario, recordatorios y personalización en una app móvil enfocada que funciona primero desde tu dispositivo.",
    playCta: "Descargar en Google Play",
    playNote: "Enlace temporal hasta que la ficha de Play Store esté disponible.",
    demoCta: "Probar demo",
    featureTitle: "Creada para cumplir cada día",
    featureText:
      "Un sistema simple para ver lo importante, marcarlo como hecho y volver mañana sin ruido.",
    features: [
      ["Hábitos", "Sigue rutinas repetidas y completa el día con un toque."],
      ["Tareas", "Guarda prioridades, fechas y estados sin un flujo pesado."],
      ["Calendario", "Revisa historial y trabajo planificado en una vista ligera."],
      ["Recordatorios", "Usa notificaciones locales para hábitos y tareas con fecha."],
      ["Personalización", "Elige idioma, formato de fecha, tema y color de acento."],
      ["Almacenamiento local", "Mantén tus datos personales guardados en el dispositivo."],
    ],
    demoTitle: "Un ciclo pequeño, listo para el día",
    demoText:
      "Toca una muestra del ritmo de la app móvil: completa un hábito, avanza una tarea, revisa la semana y personaliza el espacio.",
    demoTabs: {
      habit: "Hábito",
      task: "Tarea",
      calendar: "Calendario",
      settings: "Ajustes",
    },
    demo: {
      habit: {
        kicker: "Hábito de la mañana",
        title: "Tomar agua",
        body: "Marca la rutina de hoy y conserva visible la racha mensual.",
        action: "Completar hábito",
        done: "Completado hoy",
      },
      task: {
        kicker: "Tarea enfocada",
        title: "Planear mañana",
        body: "Pasa una tarea de planificada a terminada sin salir de la vista diaria.",
        action: "Marcar tarea hecha",
        done: "Tarea completa",
      },
      calendar: {
        kicker: "Vista de calendario",
        title: "Esta semana",
        body: "Los hábitos y tareas con fecha conviven para dar contexto a la semana.",
        action: "Ver historial",
        done: "Historial abierto",
      },
      settings: {
        kicker: "Personalización",
        title: "Modo oscuro morado",
        body: "La app puede sentirse calmada con ajustes de idioma, formato y color.",
        action: "Aplicar acento",
        done: "Acento morado activo",
      },
    },
    stats: ["3 hábitos", "4 tareas", "Vista de 7 días"],
    finalTitle: "Empieza con un ciclo.",
    finalText:
      "La primera versión pública de Android está en preparación. El enlace temporal queda listo para Google Play.",
  },
};

const demoOrder = ["habit", "task", "calendar", "settings"];

export default function Home() {
  const [language, setLanguage] = useState("en");
  const [activeDemo, setActiveDemo] = useState("habit");
  const [completed, setCompleted] = useState({ habit: true });
  const copy = translations[language];
  const active = copy.demo[activeDemo];
  const historyCells = useMemo(
    () => ["full", "soft", "full", "empty", "soft", "full", "active"],
    [],
  );

  function handleDemoAction() {
    setCompleted((current) => ({ ...current, [activeDemo]: true }));
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B0B0F] text-[#F5F3FF]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_75%_15%,rgba(192,132,252,0.12),transparent_28%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-3xl border border-[#2B2B34] bg-[#17171D]/80 px-4 py-3 backdrop-blur md:px-5">
          <a href="#top" className="font-serif text-xl font-semibold tracking-tight">
            Done Loop
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[#A1A1AA] sm:flex" aria-label="Primary">
            <a className="transition hover:text-[#F5F3FF]" href="#features">
              {copy.navFeatures}
            </a>
            <a className="transition hover:text-[#F5F3FF]" href="#demo">
              {copy.navDemo}
            </a>
          </nav>
          <div className="flex items-center gap-2" aria-label={copy.languageLabel}>
            {Object.keys(translations).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  language === code
                    ? "bg-[#A855F7] text-white"
                    : "border border-[#2B2B34] text-[#A1A1AA] hover:border-[#4B3A68] hover:text-[#F5F3FF]"
                }`}
                aria-pressed={language === code}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <section id="top" className="grid gap-10 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-[#4B3A68] bg-[#17171D] px-4 py-2 text-sm font-semibold text-[#C084FC]">
              {copy.badge}
            </p>
            <h1 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A1A1AA] sm:text-xl">{copy.heroText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="rounded-2xl bg-[#A855F7] px-6 py-4 text-center font-bold text-white shadow-[0_18px_40px_rgba(168,85,247,0.28)] transition hover:bg-[#C084FC]" href={playStoreHref}>
                {copy.playCta}
              </a>
              <a className="rounded-2xl border border-[#2B2B34] bg-[#17171D] px-6 py-4 text-center font-bold text-[#F5F3FF] transition hover:border-[#4B3A68]" href="#demo">
                {copy.demoCta}
              </a>
            </div>
            <p className="mt-3 text-sm text-[#71717A]">{copy.playNote}</p>
          </div>

          <DemoCard
            active={active}
            activeDemo={activeDemo}
            completed={completed}
            copy={copy}
            historyCells={historyCells}
            onAction={handleDemoAction}
            onSelect={setActiveDemo}
          />
        </section>

        <section id="features" className="py-12 md:py-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{copy.featureTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-[#A1A1AA]">{copy.featureText}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.features.map(([title, body]) => (
              <article key={title} className="rounded-3xl border border-[#2B2B34] bg-[#17171D] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
                <div className="mb-5 h-2 w-12 rounded-full bg-[#A855F7]" />
                <h3 className="font-serif text-2xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-[#A1A1AA]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="demo" className="grid gap-8 py-12 md:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{copy.demoTitle}</h2>
            <p className="mt-4 text-lg leading-8 text-[#A1A1AA]">{copy.demoText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {copy.stats.map((stat) => (
                <span key={stat} className="rounded-full border border-[#2B2B34] bg-[#17171D] px-4 py-2 text-sm font-semibold text-[#C084FC]">
                  {stat}
                </span>
              ))}
            </div>
          </div>
          <DemoCard
            active={active}
            activeDemo={activeDemo}
            completed={completed}
            copy={copy}
            historyCells={historyCells}
            onAction={handleDemoAction}
            onSelect={setActiveDemo}
          />
        </section>

        <section id="google-play-coming-soon" className="my-12 rounded-[2rem] border border-[#4B3A68] bg-[#17171D] p-8 text-center md:p-12">
          <h2 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">{copy.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#A1A1AA]">{copy.finalText}</p>
          <a className="mt-8 inline-flex rounded-2xl bg-[#A855F7] px-6 py-4 font-bold text-white transition hover:bg-[#C084FC]" href={playStoreHref}>
            {copy.playCta}
          </a>
        </section>
      </div>
    </main>
  );
}

function DemoCard({ active, activeDemo, completed, copy, historyCells, onAction, onSelect }) {
  return (
    <article className="rounded-[2rem] border border-[#2B2B34] bg-[#17171D] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:p-5">
      <div className="rounded-[1.5rem] border border-[#2B2B34] bg-[#0B0B0F] p-4">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="tablist" aria-label={copy.navDemo}>
          {demoOrder.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeDemo === key}
              onClick={() => onSelect(key)}
              className={`rounded-2xl px-3 py-2 text-sm font-bold transition ${
                activeDemo === key ? "bg-[#22222A] text-[#F5F3FF]" : "text-[#71717A] hover:bg-[#17171D] hover:text-[#F5F3FF]"
              }`}
            >
              {copy.demoTabs[key]}
            </button>
          ))}
        </div>
        <div className="rounded-[1.25rem] border border-[#2B2B34] bg-[#17171D] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C084FC]">{active.kicker}</p>
          <h3 className="mt-3 font-serif text-3xl font-bold">{active.title}</h3>
          <p className="mt-3 leading-7 text-[#A1A1AA]">{active.body}</p>
          <div className="my-6 grid grid-cols-7 gap-2" aria-label="Habit history preview">
            {historyCells.map((cell, index) => (
              <span
                key={`${cell}-${index}`}
                className={`h-10 rounded-xl ${
                  cell === "full" ? "bg-[#A855F7]" : cell === "soft" ? "bg-[#C084FC]/50" : cell === "active" ? "border-2 border-[#C084FC] bg-[#22222A]" : "bg-[#22222A]"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={onAction} className="w-full rounded-2xl bg-[#22222A] px-4 py-3 font-bold text-[#F5F3FF] transition hover:bg-[#2B2B34]">
            {completed[activeDemo] ? active.done : active.action}
          </button>
        </div>
      </div>
    </article>
  );
}
