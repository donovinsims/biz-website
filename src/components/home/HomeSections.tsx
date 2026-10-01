import { useEffect, useRef } from "react";
import { ArrowRight, Check, Clock, FileText, Mail, MapPin, PhoneMissed, Repeat, X } from "lucide-react";
import { Link } from "react-router";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import Section from "@/components/site/Section";
import { CallTextButtons, PrimaryCta } from "@/components/site/cta";
import BeforeAfter from "@/components/home/BeforeAfter";
import { PHOTO_ALT, PHOTO_URL, contact, faqs, problems, steps, towns, wontDo } from "@/content/site";
import { track } from "@/lib/track";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-10 pb-14 sm:pt-16 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-14 md:pb-20">
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
            <MapPin aria-hidden="true" className="size-4" />
            Roscoe, IL · Serving the Rockford &amp; Stateline area
          </p>
          <h1 className="font-bold text-[2.35rem] leading-[1.05] tracking-[-0.035em] sm:text-[3.4rem]" id="hero-title">
            Losing leads? Buried in admin?{" "}
            <span className="mt-3 block text-[1.6rem] leading-[1.12] text-muted-foreground sm:text-[2.4rem]">I find the bottleneck, fix the process, then automate the rest.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed sm:text-xl">
            I'm Donovin, based in Roscoe. I help local owners stop losing customers and get
            their evenings back. Plain and practical, no tech talk.
          </p>
          <div className="flex flex-col gap-3">
            <PrimaryCta className="w-full sm:w-fit" source="hero" />
            <p className="text-base text-muted-foreground">
              No payment. No obligation. If there's nothing worth fixing, I'll tell you.
            </p>
            <p className="text-base">
              Would rather talk? Call or text me at {contact.phoneDisplay}.{" "}
              <a className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4" href={contact.tel} onClick={() => track("call_tap", { source: "hero" })}>
                Call
              </a>{" "}
              ·{" "}
              <a className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4" href={contact.sms} onClick={() => track("text_tap", { source: "hero" })}>
                Text
              </a>
            </p>
          </div>
        </div>
        <figure className="relative">
          <img
            alt={PHOTO_ALT}
            className="aspect-[4/5] w-full rounded-3xl outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 object-cover object-[50%_30%]"
            decoding="async"
            fetchPriority="high"
            height={1000}
            width={800}
            src={PHOTO_URL}
          />
          <figcaption className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full border bg-background/90 px-3.5 py-2 font-medium text-sm backdrop-blur">
            <Clock aria-hidden="true" className="size-4" />
            I reply within an hour.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function TownsStrip() {
  const row = [...towns, ...towns];
  return (
    <div aria-label="Towns I serve" className="overflow-hidden border-y py-4" role="region">
      <ul className="sr-only">
        {towns.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="flex w-max animate-marquee gap-10 pr-10">
        {row.map((t, i) => (
          <span className="flex items-center gap-10 whitespace-nowrap font-medium text-lg text-muted-foreground" key={i}>
            {t}
            <span className="size-1 rounded-full bg-border" />
          </span>
        ))}
      </div>
    </div>
  );
}

const problemIcons = [PhoneMissed, Clock, FileText, Mail, Repeat];

export function Problems() {
  return (
    <Section divider={false} id="problems" title="Sound familiar?">
      <ul className="max-w-3xl border-t">
        {problems.map((p, i) => {
          const Icon = problemIcons[i];
          return (
            <li className="flex items-start gap-5 border-b py-6 sm:gap-6 sm:py-7" key={p}>
              <Icon aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground sm:mt-1.5" strokeWidth={1.75} />
              <p className="text-pretty font-medium text-xl leading-snug tracking-[-0.01em] sm:text-2xl">{p}</p>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        If one of these hits home, that's usually where the money is leaking.
      </p>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      subhead="I won't bolt a chatbot onto a messy process. Here's the order:"
      title="Fix the process first. Then automate."
    >
      <ol className="grid gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-3">
        {steps.map((s, i) => (
          <li className="flex flex-col gap-4 bg-card p-7 sm:p-8" key={s.title}>
            <span aria-hidden="true" className="font-bold text-5xl text-muted-foreground tabular-nums tracking-tighter">0{i + 1}</span>
            <h3 className="font-bold text-2xl">{s.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function ProofFirst() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        track("proof_section_view");
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="proof-title" className="mx-auto w-full max-w-[1100px] px-5 sm:px-8" id="proof" ref={ref}>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 rounded-3xl border bg-muted p-5 py-10 sm:p-12 md:grid-cols-2 md:items-center md:gap-14">
        <div className="flex flex-col gap-6">
          <h2 className="text-h2" id="proof-title">
            I show you the fix before you pay anything.
          </h2>
          <p className="text-lg leading-relaxed">
            I research your business, find a real problem, and build a small example of how I'd fix
            it. You see it first. If it's useful, we talk. If there's nothing worth fixing, I'll say
            so and you owe nothing.
          </p>
          <div className="flex flex-col items-start gap-4">
            <PrimaryCta className="w-full sm:w-fit" source="proof" />
            <Link className="group inline-flex min-h-12 items-center gap-1.5 font-semibold underline-offset-4 hover:underline" onClick={() => track("examples_cta_click", { source: "home" })} to="/examples">
              See examples of what this can look like
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
        <BeforeAfter />
      </div>
    </section>
  );
}

export function WhoBehind() {
  return (
    <Section divider={false} id="who">
      <div className="max-w-3xl">
        <div className="flex flex-col gap-6">
          <h2 className="text-h2">A local guy, not a faceless agency.</h2>
          <p className="text-lg leading-relaxed">
            I grew up in Roscoe, went to Hononegah, and played Division I baseball at NIU. I spent my
            college summers on the Winnebago County Highway Department, then ran live-event
            operations at Uber and shipped products at Walgreens. Now I use that operations
            background to help local owners fix what's eating their time.
          </p>
          <div>
            <Link className="group inline-flex min-h-11 w-fit items-center gap-1.5 font-semibold hover:text-foreground" to="/about">
              Read my story
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function WontDo() {
  return (
    <Section id="wont-do" title="What I won't do.">
      <ul className="grid gap-x-10 border-t md:grid-cols-2">
        {wontDo.map((w) => (
          <li className="flex items-start gap-4 border-b py-5" key={w}>
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border">
              {w.startsWith("No") ? (
                <X aria-hidden="true" className="size-3.5" />
              ) : (
                <Check aria-hidden="true" className="size-3.5" />
              )}
            </span>
            <span className="text-lg leading-snug">{w}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Faq() {
  return (
    <Section id="faq" title="Questions owners ask.">
      <Accordion className="max-w-3xl border-t">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="min-h-16 items-center py-5 font-semibold text-lg sm:text-lg [&_svg]:translate-y-0">
              {f.q}
            </AccordionTrigger>
            <AccordionPanel className="max-w-2xl pb-6 text-lg text-muted-foreground leading-relaxed">
              {f.a}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <PrimaryCta source="faq" />
        <CallTextButtons source="faq" />
      </div>
    </Section>
  );
}
