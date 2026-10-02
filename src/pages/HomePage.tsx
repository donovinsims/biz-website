import FinalCta from "@/components/site/FinalCta";
import {
  ExamplePreviews,
  Faq,
  Hero,
  HowItWorks,
  LocalCredibility,
} from "@/components/home/HomeSections";
import { PHOTO_URL, contact, towns } from "@/content/site";
import { SITE_URL, useSeo } from "@/lib/seo";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Clockout",
  url: SITE_URL,
  image: PHOTO_URL,
  telephone: "+1-608-713-1651",
  email: contact.email,
  founder: { "@type": "Person", name: "Donovin Sims" },
  address: { "@type": "PostalAddress", addressLocality: "Roscoe", addressRegion: "IL", addressCountry: "US" },
  areaServed: towns.slice(0, 7).map((t) => ({ "@type": "City", name: `${t}, IL` })),
};

export default function HomePage() {
  useSeo(
    "Clockout | Fix the Bottleneck, Get Your Time Back | Roscoe, IL",
    "Local help for Roscoe and Rockford-area business owners who are losing leads or buried in admin. I find the bottleneck, fix it, then automate the rest. Free look, no obligation.",
    jsonLd,
  );
  return (
    <>
      <Hero />
      <ExamplePreviews />
      <HowItWorks />
      <LocalCredibility />
      {/* Add a "Results" section here once the first real client result exists. */}
      <Faq />
      <FinalCta source="home" />
    </>
  );
}
