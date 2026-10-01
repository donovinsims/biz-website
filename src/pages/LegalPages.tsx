import type React from "react";
import { EmailLink } from "@/components/site/cta";
import { contact } from "@/content/site";
import { useSeo } from "@/lib/seo";

function LegalLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto flex w-full max-w-[680px] flex-col gap-5 px-5 py-14 text-lg leading-relaxed sm:px-0 sm:py-20 [&_h2]:mt-6 [&_h2]:font-bold [&_h2]:text-2xl">
      <h1 className="font-bold text-[2.5rem] leading-tight tracking-[-0.035em]">{title}</h1>
      <p className="text-muted-foreground text-base">Last updated: October 1, 2026</p>
      {children}
    </article>
  );
}

export function PrivacyPage() {
  useSeo("Privacy Policy | Clockout", "How Clockout uses the information you send through this site.");
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        When you fill out the free-look form, I get your name, business name, phone number, and
        anything else you choose to share. I use it only to contact you about your request.
      </p>
      <h2>What I don't do</h2>
      <p>I never sell or rent your information, and I don't add you to a mailing list.</p>
      <h2>Texting</h2>
      <p>
        I won't send you automated texts. If you contact me, I may text you back by hand about your
        request. Reply STOP any time and I'll stop.
      </p>
      <h2>Analytics</h2>
      <p>This site may use basic analytics to see which pages are visited. It doesn't identify you personally.</p>
      <h2>Questions or deletion</h2>
      <p>
        Email <EmailLink source="privacy" /> or call {contact.phoneDisplay} and I'll answer or
        delete your information.
      </p>
    </LegalLayout>
  );
}

export function TermsPage() {
  useSeo("Terms | Clockout", "Simple terms for using the Clockout website.");
  return (
    <LegalLayout title="Terms">
      <p>This site describes the work Clockout does for local businesses. Using it doesn't create any agreement or obligation.</p>
      <h2>The free look</h2>
      <p>
        The free look is exactly that: free, with no obligation. Any paid work is agreed in writing
        beforehand, with scope and price spelled out.
      </p>
      <h2>Examples</h2>
      <p>The examples on this site are illustrations of the kinds of fixes I set up, not client results or guarantees.</p>
      <h2>Contact</h2>
      <p>
        Questions? Email <EmailLink source="terms" /> or call {contact.phoneDisplay}.
      </p>
    </LegalLayout>
  );
}
