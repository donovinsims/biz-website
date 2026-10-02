import { useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router";
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import Section from "@/components/site/Section";
import { CallTextButtons, PrimaryCta } from "@/components/site/cta";
import HeroWorkflow from "@/components/home/HeroWorkflow";
import { FlowPreview } from "@/components/examples/FlowPreview";
import { examples } from "@/content/examples";
import { faqs, steps } from "@/content/site";
import { track } from "@/lib/track";

const PREVIEW_SLUGS = ["missed-leads", "quote-followup", "reviews"] as const;

const previews = PREVIEW_SLUGS.flatMap((slug) => {
  const example = examples.find((e) => e.slug === slug);
  return example ? [example] : [];
});

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-12 sm:py-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)] lg:gap-16 lg:py-28">
        <div className="flex max-w-4xl flex-col gap-7">
          <p className="flex items-center gap-2 font-medium text-muted-foreground text-sm">
            <MapPin aria-hidden="true" className="size-4" />
            Roscoe, IL &middot; Serving the Rockford &amp; Stateline area
          </p>
          <h1
            className="max-w-6xl font-bold text-[clamp(2.5rem,6vw,6.35rem)] leading-[0.91] tracking-[-0.065em]"
            id="hero-title"
          >
            Fix the bottleneck. Get your time back.
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed sm:text-2xl">
            I&apos;m Donovin, a local operator. I find the thing costing you customers, fix it, then
            automate the rest.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryCta className="w-full sm:w-fit" source="hero" />
              <Link
                className="group inline-flex min-h-12 items-center justify-center gap-1.5 font-semibold underline-offset-4 hover:underline"
                onClick={() => track("examples_cta_click", { source: "hero" })}
                to="#examples"
              >
                See examples
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <p className="text-base text-muted-foreground">
              No payment. No obligation. If there&apos;s nothing worth fixing, I&apos;ll tell you. I
              reply within an hour.
            </p>
          </div>
        </div>
        <HeroWorkflow />
      </div>
    </section>
  );
}

export function ExamplePreviews() {
  return (
    <Section
      id="examples"
      subhead="Three of the fixes I build. Each one is a real workflow, not a promise."
      title="Practical fixes for your business."
    >
      <ul className="grid gap-px overflow-hidden rounded-[2rem] border bg-border md:grid-cols-3">
        {previews.map((e) => (
          <li key={e.slug}>
            <Link
              className="group flex h-full flex-col gap-5 bg-card p-7 transition-colors hover:bg-muted sm:p-8"
              onClick={() => track("example_open", { slug: e.slug, source: "home" })}
              to={`/examples#${e.slug}`}
            >
              <FlowPreview flow={e.flow} />
              <h3 className="font-bold text-xl leading-snug tracking-[-0.01em]">
                {e.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">{e.hook}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 font-semibold text-sm">
                Open the workflow
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
        These are examples, not client results. Your setup would be built around how you work.
      </p>
    </Section>
  );
}

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      subhead="I won't bolt a chatbot onto a messy process. The work gets simpler in this order."
      title="Fix the process first. Then automate."
    >
      <ol className="grid gap-px overflow-hidden rounded-[2rem] border bg-border md:grid-cols-3">
        {steps.map((s, i) => (
          <li className="flex min-h-56 flex-col gap-5 bg-card p-7 sm:p-8" key={s.title}>
            <span
              aria-hidden="true"
              className="font-bold text-5xl text-muted-foreground tabular-nums tracking-tighter"
            >
              0{i + 1}
            </span>
            <h3 className="font-bold text-2xl">{s.title}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function LocalCredibility() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("proof_section_view");
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="credibility-title"
      className="mx-auto w-full max-w-[1100px] px-5 sm:px-8"
      id="credibility"
      ref={ref}
    >
      <div className="grid gap-12 border-t py-24 sm:py-32 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16 lg:py-40">
        <header className="h-fit max-w-md">
          <h2 className="text-h2" id="credibility-title">
            A local guy, not a faceless agency.
          </h2>
          <Link
            className="group mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold hover:text-foreground"
            to="/about"
          >
            Read my story
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </header>
        <dl className="flex flex-col gap-10">
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Where I work
            </dt>
            <dd className="mt-2 text-lg leading-relaxed">
              Based in Roscoe, serving the Rockford and Stateline area.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">Who you work with</dt>
            <dd className="mt-2 text-lg leading-relaxed">
              Me, Donovin. I grew up in Roscoe, played Division I baseball at NIU, and ran
              operations at Uber and product at Walgreens.
            </dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">How I start</dt>
            <dd className="mt-2 text-lg leading-relaxed">
              I show you the fix before you pay anything. If it&apos;s not worth doing, I say so.
            </dd>
          </div>
        </dl>
      </div>
    </section>
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
