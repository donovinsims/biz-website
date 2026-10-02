import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { ArrowRight, Plus } from "lucide-react";
import { FlowPreview } from "@/components/examples/FlowPreview";
import FinalCta from "@/components/site/FinalCta";
import { CallTextButtons, PrimaryCta, useScrollToForm } from "@/components/site/cta";
import { examples } from "@/content/examples";
import { useSeo } from "@/lib/seo";
import { track } from "@/lib/track";

const card =
  "group flex h-full min-h-48 w-full flex-col gap-4 rounded-2xl border bg-card p-6 text-left outline-none transition-colors hover:border-foreground/40 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-7";

const ExampleModal = lazy(() => import("@/components/examples/ExampleModal"));

function slugFromHash() {
  const s = window.location.hash.slice(1);
  return examples.some((e) => e.slug === s) ? s : null;
}

export default function ExamplesPage() {
  useSeo(
    "Examples | What Clockout Can Set Up | Roscoe, IL",
    "Plain-language examples of fixes for local businesses: never miss a lead, follow up on quotes, get more reviews, get paid faster, and keep customers updated.",
  );
  const [slug, setSlug] = useState<string | null>(slugFromHash);
  const scrollToForm = useScrollToForm();
  const { hash } = useLocation();

  useEffect(() => {
    const onHash = () => setSlug(slugFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = useCallback((s: string | null) => {
    setSlug(s);
    const url = s ? `#${s}` : window.location.pathname + window.location.search;
    window.history.replaceState(window.history.state, "", url);
    if (s) track("example_open", { slug: s });
  }, []);

  /**
   * A `Link` to /examples#slug navigates with React Router's pushState, which does
   * not fire a native `hashchange`, so mirror the router hash into the dialog state.
   * `synced` keeps this from reacting to `open()`'s own replaceState writes.
   */
  const synced = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (synced.current === hash) return;
    synced.current = hash;
    const s = hash ? slugFromHash() : null;
    if (s) open(s);
    else setSlug(null);
  }, [hash, open]);

  const index = examples.findIndex((e) => e.slug === slug);
  const step = (dir: 1 | -1) => open(examples[(index + dir + examples.length) % examples.length].slug);

  return (
    <>
      <section className="mx-auto w-full max-w-[1100px] px-5 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
        <div className="flex max-w-3xl flex-col gap-5">
          <h1 className="font-bold text-[2.5rem] leading-[1.02] tracking-[-0.04em] sm:text-[3.75rem]">
            Practical fixes for your business
          </h1>
          <p className="text-lg leading-relaxed sm:text-xl">
            Five common fixes for local businesses. Tap one to see how it works, step by step.
          </p>
          <p className="w-fit rounded-full border bg-muted px-4 py-2 text-sm">
            These are examples, not client results. Your setup would be built around how you work.
          </p>
        </div>

        {/* Slot: feature the first real client example here once it exists. */}
        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((e) => (
            <li key={e.slug}>
              <a className={card} href={`#${e.slug}`} onClick={(ev) => { ev.preventDefault(); open(e.slug); }}>
                <FlowPreview flow={e.flow} />
                <h2 className="font-bold text-xl leading-tight tracking-tight">{e.title}</h2>
                <p className="text-base text-muted-foreground leading-relaxed">{e.hook}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 font-semibold">
                  See how it works
                  <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
          <li>
            <button className={`${card} border-dashed bg-muted`} onClick={() => {
                track("example_cta_click", { source: "examples_other" });
                scrollToForm();
              }} type="button">
              <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
                <Plus aria-hidden="true" className="size-5" />
              </span>
              <h2 className="font-bold text-xl leading-tight tracking-tight">Something else eating your week?</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Tell me what it is. If there's a fix, I'll show you what it could look like.
              </p>
              <span className="mt-auto inline-flex items-center gap-1.5 font-semibold">
                Tell me about it
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          </li>
        </ul>

        <div className="mt-14 flex flex-col gap-4 border-t pt-10">
          <p className="max-w-2xl font-semibold text-2xl leading-snug tracking-tight">
            Most owners don't need all of these. Usually one fix is the place to start.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryCta source="examples" />
            <CallTextButtons source="examples" />
          </div>
        </div>
      </section>

      <FinalCta source="examples" />

      {index >= 0 && (
        <Suspense fallback={null}>
          <ExampleModal
            example={examples[index]}
            index={index}
            onClose={() => open(null)}
            onStep={step}
            total={examples.length}
          />
        </Suspense>
      )}
    </>
  );
}
