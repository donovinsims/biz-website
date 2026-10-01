import { MapPin } from "lucide-react";
import FreeLookForm from "@/components/site/FreeLookForm";
import { CallTextButtons, EmailLink } from "@/components/site/cta";
import { FORM_ID, contact, nextSteps } from "@/content/site";
import { track } from "@/lib/track";

export default function FinalCta({ source }: { source: string }) {
  return (
    <section
      aria-labelledby="free-look-title"
      className="mx-auto w-full max-w-[1100px] px-5 sm:px-8"
      id={FORM_ID}
    >
      <div className="border-t py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="flex flex-col gap-10">
            <header>
              <h2 className="text-h2" id="free-look-title">
                Get a free look at your business.
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Tell me what's eating your week. I'll dig in and show you what I'd fix before you pay anything.
              </p>
            </header>

            <div>
              <h3 className="mb-4 font-semibold text-muted-foreground text-sm uppercase tracking-[0.12em]">
                What happens next
              </h3>
              <ol className="flex flex-col gap-4">
                {nextSteps.map((s, i) => (
                  <li className="flex gap-4" key={s}>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border font-semibold text-sm tabular-nums">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-lg leading-relaxed">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-lg">
                Would rather talk?{" "}
                <a
                  className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4"
                  href={contact.tel}
                  onClick={() => track("call_tap", { source: `${source}-final` })}
                >
                  {contact.phoneDisplay}
                </a>
                <br />
                <EmailLink className="text-muted-foreground" source={`${source}-final`} />
              </p>
              <CallTextButtons source={`${source}-final`} />
            </div>

            <div className="flex gap-3 rounded-2xl border p-5">
              <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-semibold">Where I work</p>
                {/* [CONFIRM] "Happy to stop by your shop or office." */}
                <p className="mt-1 text-base text-muted-foreground leading-relaxed">
                  Based in Roscoe. Serving Rockford, Rockton, Loves Park, Machesney Park, Belvidere,
                  South Beloit, and nearby Winnebago County and Stateline communities. Happy to stop
                  by your shop or office.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:pt-2">
            <FreeLookForm source={source} />
          </div>
        </div>
      </div>
    </section>
  );
}
