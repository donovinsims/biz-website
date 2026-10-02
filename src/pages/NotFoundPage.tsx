import { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import FinalCta from "@/components/site/FinalCta";
import Section from "@/components/site/Section";
import { useSeo } from "@/lib/seo";

export default function NotFoundPage() {
  useSeo(
    "Page not found | Clockout",
    "That page doesn't exist. Head back to the homepage or see example workflows.",
  );

  useEffect(() => {
    let el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "robots");
      document.head.appendChild(el);
    }
    el.content = "noindex, follow";
    return () => el?.remove();
  }, []);

  return (
    <>
      <Section headingLevel="h1" title="Page not found.">
        <div className="flex max-w-2xl flex-col gap-8">
          <p className="text-lg text-muted-foreground leading-relaxed">
            That page doesn&apos;t exist. It may have moved, or the link may be wrong.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="group inline-flex min-h-12 items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
              to="/"
            >
              Go to the homepage
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              className="group inline-flex min-h-12 items-center gap-1.5 font-semibold underline-offset-4 hover:underline"
              to="/examples"
            >
              See example workflows
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </Section>
      <FinalCta source="notfound" />
    </>
  );
}
