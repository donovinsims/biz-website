import { MapPin } from "lucide-react";
import FreeLookForm from "@/components/site/FreeLookForm";
import { CallTextButtons, EmailLink } from "@/components/site/cta";
import { FORM_ID, nextSteps } from "@/content/site";

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
                Tell me what&apos;s eating your week and I&apos;ll show you what I&apos;d fix before you
                pay anything.
              </p>
            </header>

            <div>
              <h3 className="mb-4 font-semibold text-xl tracking-tight">
                Here's what happens next
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

            <div className="flex flex-col items-start gap-4">
              <CallTextButtons source={`${source}-final`} />
              <EmailLink source={`${source}-final`} />
            </div>

            <div className="flex items-start gap-3 rounded-2xl border p-5">
              <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
              <p className="text-base text-muted-foreground leading-relaxed">
                Based in Roscoe, working across the Stateline.
                {/* [CONFIRM] "Happy to stop by your shop or office." */}
              </p>
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
