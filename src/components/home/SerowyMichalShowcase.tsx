"use client";

import {
  ArrowRight,
  Flame,
  HeartHandshake,
  Milk,
  Sparkles,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

interface SerowyMichalShowcaseProps {
  basePath: string;
}

const chapters = [
  {
    id: "rzemioslo",
    eyebrow: "01 / rzemiosło",
    title: "Ser, który ma własny charakter",
    copy: "Serowy Michał to domowa, bezpośrednia opowieść o twórcy, który nie udaje korporacyjnej marki. Najpierw jest człowiek, potem receptura, a dopiero na końcu przycisk „kup”.",
    icon: Milk,
  },
  {
    id: "hejarty",
    eyebrow: "02 / produkt flagowy",
    title: "HEJARTY — produkt, który robi wejście",
    copy: "HEJARTY prowadzą sklepową część strony: mają być widoczne, konkretne i łatwe do kupienia, ale bez zabierania miejsca historii firmy Serowy Michał.",
    icon: Flame,
  },
  {
    id: "styl",
    eyebrow: "03 / ton marki",
    title: "Odważnie, swojsko, z humorem",
    copy: "Strona buduje klimat premium-rzemieślniczy bez zadęcia: dużo tekstury, ciepłe kolory, mocne sekcje i mikrointerakcje zamiast generycznego katalogu produktów.",
    icon: HeartHandshake,
  },
];

const rituals = ["Krojenie", "Degustacja", "Dzielenie", "Powrót po więcej"];

export function SerowyMichalShowcase({ basePath }: SerowyMichalShowcaseProps) {
  const [activeId, setActiveId] = useState(chapters[0].id);
  const activeChapter = useMemo(
    () => chapters.find((chapter) => chapter.id === activeId) ?? chapters[0],
    [activeId],
  );
  const ActiveIcon = activeChapter.icon;

  return (
    <div className="overflow-hidden bg-[#fff7df] text-[#26180f]">
      <section className="relative isolate min-h-[calc(100vh-4rem)] border-b border-[#3b2415]/10 px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,#ffd166_0,transparent_28%),radial-gradient(circle_at_85%_18%,#f77f00_0,transparent_22%),linear-gradient(135deg,#fff7df_0%,#ffdca8_52%,#f7a541_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#26180f]/20 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#26180f]/15 bg-white/55 px-4 py-2 text-sm font-semibold shadow-sm backdrop-blur">
              <Sparkles className="size-4 text-[#d95d00]" />
              Dom Serowego Michała · HEJARTY dostępne w sklepie
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-[#26180f] sm:text-7xl lg:text-8xl">
              Serowy Michał robi serową scenę, a nie zwykły sklep.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#54351f] sm:text-xl">
              To strona domowa marki: historia, charakter, rytuał jedzenia i
              dopiero potem sprzedaż. HEJARTY są bohaterem produktu, ale całość
              pracuje na rozpoznawalność Serowego Michała.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-[#26180f] px-7 text-white hover:bg-[#3b2415]"
              >
                <Link href={`${basePath}/products`}>
                  Kup HEJARTY <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-[#26180f]/25 bg-white/50 px-7 text-[#26180f] hover:bg-white/80"
              >
                <a href="#opowiesc">Poznaj historię</a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[560px] rounded-[3rem] border border-white/60 bg-[#301c10] p-4 shadow-2xl shadow-[#9c4f00]/30">
            <div className="absolute -left-8 top-10 rotate-[-10deg] rounded-3xl bg-white px-5 py-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d95d00]">
                produkt
              </p>
              <p className="text-3xl font-black">HEJARTY</p>
            </div>
            <div className="grid h-full place-items-center overflow-hidden rounded-[2.3rem] bg-[radial-gradient(circle,#ffe08a_0,#f4a62a_38%,#6c2f12_78%)]">
              <div className="relative grid size-64 place-items-center rounded-full bg-[#ffd166] shadow-[inset_0_-24px_40px_rgba(80,32,8,0.22),0_30px_80px_rgba(0,0,0,0.28)] sm:size-80">
                {[...Array(10)].map((_, index) => (
                  <span
                    className="absolute rounded-full bg-[#bf5b19]/35"
                    key={index}
                    style={{
                      width: `${18 + (index % 4) * 12}px`,
                      height: `${18 + (index % 4) * 12}px`,
                      transform: `rotate(${index * 36}deg) translate(${70 + (index % 3) * 24}px)`,
                    }}
                  />
                ))}
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-[0.35em] text-[#7a3412]">
                    Serowy Michał
                  </p>
                  <p className="mt-2 text-5xl font-black tracking-[-0.08em] text-[#26180f] sm:text-6xl">
                    HEJARTY
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#7a3412]">
                    limitowana energia rzemiosła
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="opowiesc"
        className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-24"
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d95d00]">
            manifest
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Nie katalog. Dom marki.
          </h2>
        </div>
        <div className="grid gap-4">
          {chapters.map((chapter) => {
            const Icon = chapter.icon;
            const selected = chapter.id === activeId;
            return (
              <button
                className={`group rounded-[2rem] border p-5 text-left transition ${selected ? "border-[#26180f] bg-[#26180f] text-white shadow-2xl" : "border-[#3b2415]/10 bg-white/70 hover:-translate-y-1 hover:bg-white"}`}
                key={chapter.id}
                onClick={() => setActiveId(chapter.id)}
                type="button"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl ${selected ? "bg-[#ffd166] text-[#26180f]" : "bg-[#ffe4ad] text-[#d95d00]"}`}
                  >
                    <Icon className="size-6" />
                  </span>
                  <span>
                    <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">
                      {chapter.eyebrow}
                    </span>
                    <span className="mt-1 block text-2xl font-black tracking-[-0.03em]">
                      {chapter.title}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
          <div className="rounded-[2rem] bg-[#3b2415] p-7 text-white">
            <ActiveIcon className="mb-5 size-8 text-[#ffd166]" />
            <p className="text-xl leading-8">{activeChapter.copy}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2.5rem] bg-[#26180f] text-white lg:grid-cols-4">
          {rituals.map((ritual, index) => (
            <div
              className="border-white/10 border-b p-7 lg:border-b-0 lg:border-r"
              key={ritual}
            >
              <div className="mb-8 flex items-center justify-between">
                <Star className="size-5 text-[#ffd166]" />
                <span className="text-sm text-white/45">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-black">{ritual}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Etap doświadczenia, który zamienia produkt w zapamiętywalną
                opowieść i prowadzi użytkownika naturalnie do sklepu.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
