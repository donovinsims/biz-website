import { ArrowRight, MessageSquare, Phone } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CTA_LABEL, FORM_ID, contact } from "@/content/site";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

/** 48px pill sizing shared by every site button (overrides COSS's sm: heights too). */
export const pill =
  "h-12 sm:h-12 px-6 sm:px-6 text-base sm:text-base [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4.5";

export function useScrollToForm() {
  const navigate = useNavigate();
  return () => {
    const el = document.getElementById(FORM_ID);
    if (!el) {
      navigate(`/#${FORM_ID}`);
      return;
    }
    el.scrollIntoView({ block: "start" });
    window.setTimeout(
      () => el.querySelector<HTMLInputElement>("input:not([tabindex='-1'])")?.focus({ preventScroll: true }),
      450,
    );
  };
}

export function PrimaryCta({
  className,
  label = CTA_LABEL,
  source,
  event = "cta_primary_click",
  onBeforeScroll,
}: {
  className?: string;
  label?: string;
  source: string;
  event?: "cta_primary_click" | "example_cta_click";
  onBeforeScroll?: () => void;
}) {
  const scrollToForm = useScrollToForm();
  return (
    <Button
      className={cn(pill, "group", className)}
      onClick={() => {
        track(event, { source });
        onBeforeScroll?.();
        window.setTimeout(scrollToForm, onBeforeScroll ? 220 : 0);
      }}
    >
      {label === CTA_LABEL ? (
        <>
          <span className="max-[359px]:hidden">{label}</span>
          <span className="min-[360px]:hidden">Get a free look</span>
        </>
      ) : (
        label
      )}
      <ArrowRight
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </Button>
  );
}

export function CallTextButtons({
  className,
  source,
  compact = false,
}: {
  className?: string;
  source: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        className={cn(pill, compact && "px-4 sm:px-4", "flex-1 sm:flex-none")}
        onClick={() => track("call_tap", { source })}
        render={<a href={contact.tel} />}
        variant="outline"
      >
        <Phone aria-hidden="true" />
        Call
      </Button>
      <Button
        className={cn(pill, compact && "px-4 sm:px-4", "flex-1 sm:flex-none")}
        onClick={() => track("text_tap", { source })}
        render={<a href={contact.sms} />}
        variant="outline"
      >
        <MessageSquare aria-hidden="true" />
        Text
      </Button>
    </div>
  );
}

export function EmailLink({ className, source }: { className?: string; source: string }) {
  return (
    <a
      className={cn("inline-block py-2.5 underline decoration-muted-foreground underline-offset-4 hover:decoration-foreground", className)}
      href={contact.mailto}
      onClick={() => track("email_tap", { source })}
    >
      {contact.email}
    </a>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-bold text-xl tracking-[-0.04em]", className)}>
      Clockout
    </span>
  );
}
