/**
 * Provider-agnostic analytics. Every event goes to `window.dataLayer` (GTM),
 * to GA4 via `gtag` if present, and as a `clockout:track` DOM event for anything else.
 * Never pass form field contents or other PII in params.
 */
export type TrackEvent =
  | "cta_primary_click"
  | "examples_cta_click"
  | "example_open"
  | "example_cta_click"
  | "form_start"
  | "form_submit"
  | "call_tap"
  | "text_tap"
  | "email_tap"
  | "proof_section_view";

type Params = Record<string, string | number | boolean>;
type Gtag = (command: "event", name: string, params?: Params) => void;

export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: Gtag };
  (w.dataLayer ??= []).push({ event, ...params });
  w.gtag?.("event", event, params);
  window.dispatchEvent(new CustomEvent("clockout:track", { detail: { event, ...params } }));
}
