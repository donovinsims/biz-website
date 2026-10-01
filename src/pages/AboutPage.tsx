import { track } from "@/lib/track";
import FinalCta from "@/components/site/FinalCta";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { PHOTO_ALT, PHOTO_URL } from "@/content/site";
import { SITE_URL, useSeo } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Donovin Sims",
  jobTitle: "Founder",
  worksFor: { "@type": "Organization", name: "Clockout", url: SITE_URL },
  url: `${SITE_URL}/about`,
  image: PHOTO_URL,
  homeLocation: { "@type": "Place", name: "Roscoe, Illinois" },
};

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-[1.7] sm:text-[1.2rem]">{children}</p>;
}

export default function AboutPage() {
  useSeo(
    "About Donovin Sims | Clockout | Roscoe, IL",
    "Roscoe native, former Uber and Walgreens operations. I help local owners find where they're losing time and leads, fix the process, then automate the rest.",
    jsonLd,
  );

  return (
    <>
      <section aria-labelledby="about-title" className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        <div className="grid items-end gap-8 pt-10 pb-12 sm:pt-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
          <img
            alt={PHOTO_ALT}
            className="aspect-[4/5] w-full max-w-md rounded-3xl outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 object-cover object-[50%_25%]"
            decoding="async"
            fetchPriority="high"
            height={1000}
            src={PHOTO_URL}
            width={800}
          />
          <div className="flex flex-col gap-4 pb-2">
            <h1 className="font-bold text-[2.75rem] leading-none tracking-[-0.04em] sm:text-[4rem]" id="about-title">
              Hi, I'm Donovin.
            </h1>
            <p className="text-muted-foreground text-xl sm:text-2xl">
              Roscoe raised. I help local owners get their time back.
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto flex w-full max-w-[680px] flex-col gap-6 border-t px-5 py-14 sm:px-0 sm:py-20">
        <P>
          I grew up in Roscoe, Illinois. I went to Hononegah High School, played three sports, then
          played Division I baseball at Northern Illinois University.
        </P>
        <P>During college, I spent my summers working for the Winnebago County Highway Department.</P>
        <P>That job stuck with me.</P>
        <blockquote className="my-6 border-foreground border-l-2 py-1 pl-6">
          <p className="font-bold text-[2rem] leading-[1.1] tracking-[-0.03em] sm:text-[2.6rem]">
            You showed up early. You did the work.
          </p>
        </blockquote>
        <P>
          I learned pretty quickly what tough looked like: men and women getting out of bed at 5 a.m.
          every morning, putting in a full day, and doing it again tomorrow because people were
          counting on them.
        </P>
        <P>After NIU, I went into tech operations.</P>
        <P>
          At Uber, I worked in Product Operations and helped run some of the largest live events in
          the U.S. and Canada. I worked with cities and venues handling crowds of 70,000+ people.
          When that many people are trying to get home at once, small problems become big ones fast.
          Dispatch has to work. Handoffs have to be clean. People need to know what they're doing.
        </P>
        <P>At Walgreens, I helped build and ship digital products at national retail scale.</P>
        <P>Then ChatGPT came out in 2022, and I got hooked.</P>
        <P>
          Since then, I've spent thousands of hours and thousands of dollars testing AI tools,
          building workflows, breaking things, rebuilding them, and figuring out which tools actually
          save time.
        </P>
        <P>A lot of them don't.</P>
        <P>Over time, I landed on a simple way of working:</P>

        <div className="my-4 rounded-3xl border bg-card p-6 sm:p-8">
          <p className="mb-5 font-bold text-2xl tracking-tight">Audit. Optimize. Automate.</p>
          <ol className="flex flex-col gap-4">
            {[
              "Find where time and money are getting wasted.",
              "Fix the process.",
              "Automate the parts that don't need a human in the loop.",
            ].map((s, i) => (
              <li className="flex gap-4" key={s}>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground font-semibold text-background text-sm">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-lg">{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <P>That's the work I do now, for owners right here where I grew up.</P>
        <P>
          I help local business owners who are losing leads, buried in follow-up, or stuck doing
          admin at night. I do the work myself, and I make sure you and your team understand how it
          runs. Nothing is a black box.
        </P>
        <P>
          I care about practical fixes. The kind that saves you a few hours every week, gets a
          repetitive task off your plate, makes sure no lead falls through the cracks, or fixes a
          process that's been annoying everyone for years.
        </P>
        <P>
          And I'll tell you straight when AI isn't the answer. Sometimes the fix is a simpler
          process. Sometimes there's nothing worth fixing.
        </P>
        <P>
          If you're in the Roscoe, Rockford, or Stateline area and something keeps eating your week,
          I'd like to take a look.
        </P>

        <Link
          className="group mt-2 inline-flex min-h-12 w-fit items-center gap-1.5 font-semibold text-lg underline-offset-4 hover:underline" onClick={() => track("examples_cta_click", { source: "about" })} to="/examples"
        >
          See examples of what I set up
          <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </article>

      <FinalCta source="about" />
    </>
  );
}
