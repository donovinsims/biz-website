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

const sections = [
  {
    heading: "Local roots",
    body: "I grew up in Roscoe, Illinois, went to Hononegah High School, and played three sports. I played Division I baseball at Northern Illinois University. My college summers were spent working for the Winnebago County Highway Department, where I learned what tough looks like: people up at 5 a.m. every morning, doing it again tomorrow because someone was counting on them.",
  },
  {
    heading: "Operations experience",
    body: "After NIU I went into tech operations. At Uber, in Product Operations, I helped run some of the largest live events in the U.S. and Canada, working with cities and venues handling crowds of 70,000+ people. When that many people are trying to get home at once, small problems become big ones fast. At Walgreens I shipped digital products at national retail scale.",
  },
  {
    heading: "How I work",
    body: "ChatGPT came out in 2022 and I got hooked. Since then I have spent thousands of hours testing AI tools, building workflows, and figuring out which ones actually save time. A lot of them don't. So I work in a fixed order: audit, optimize, automate. I show you the fix before you pay anything, and I'll tell you straight when the answer isn't AI.",
  },
];

export default function AboutPage() {
  useSeo(
    "About Donovin Sims | Clockout | Roscoe, IL",
    "Roscoe native, former Uber and Walgreens operations. I help local owners find where they're losing time and leads, fix the process, then automate the rest.",
    jsonLd,
  );

  return (
    <>
      <section aria-labelledby="about-title" className="mx-auto w-full max-w-[1100px] px-5 sm:px-8">
        <div className="grid items-end gap-8 pt-10 pb-12 sm:pt-16 md:grid-cols-[minmax(0,0.45fr)_minmax(0,1.55fr)] md:gap-12">
          <img
            alt={PHOTO_ALT}
            className="aspect-[4/5] w-full max-w-[11rem] rounded-3xl outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10 object-cover object-[50%_25%]"
            decoding="async"
            fetchPriority="high"
            height={1000}
            src={PHOTO_URL}
            width={800}
          />
          <div className="flex flex-col gap-4 pb-2">
            <h1
              className="font-bold text-[2.75rem] leading-none tracking-[-0.04em] sm:text-[4rem]"
              id="about-title"
            >
              About Clockout
            </h1>
            <p className="text-muted-foreground text-xl sm:text-2xl">
              Roscoe raised. I help local owners get their time back.
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto flex w-full max-w-[680px] flex-col gap-10 border-t px-5 py-14 sm:px-0 sm:py-20">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-h3">{s.heading}</h2>
            <p className="mt-3 text-lg leading-[1.7] sm:text-[1.2rem]">{s.body}</p>
          </section>
        ))}

        <Link
          className="group inline-flex min-h-12 w-fit items-center gap-1.5 font-semibold text-lg underline-offset-4 hover:underline"
          onClick={() => track("examples_cta_click", { source: "about" })}
          to="/examples"
        >
          See examples of what I set up
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </article>

      <FinalCta source="about" />
    </>
  );
}
