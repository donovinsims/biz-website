import { useRef, useState } from "react";
import { CircleAlert, CircleCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmailLink, CallTextButtons, pill } from "@/components/site/cta";
import { contact } from "@/content/site";
import { track } from "@/lib/track";

type Values = {
  name: string;
  business: string;
  phone: string;
  headache: string;
  website: string;
  email: string;
  company_fax: string;
};

const empty: Values = {
  name: "",
  business: "",
  phone: "",
  headache: "",
  website: "",
  email: "",
  company_fax: "",
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.name.trim()) e.name = "Please add your name.";
  if (!v.business.trim()) e.business = "Please add your business name.";
  const digits = v.phone.replace(/\D/g, "");
  if (!digits) e.phone = "Please add a phone number so I can reach you.";
  else if (digits.length < 10) e.phone = "That number looks short. Include the area code.";
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "That email doesn't look right.";
  return e;
}

const inputSize =
  "text-lg sm:text-base [&_[data-slot=input]]:h-12 [&_[data-slot=input]]:leading-12 sm:[&_[data-slot=input]]:h-12 sm:[&_[data-slot=input]]:leading-12 [&_[data-slot=input]]:px-4";

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p aria-live="assertive" className="flex items-center gap-1.5 font-semibold text-sm underline decoration-dotted underline-offset-4" id={id} role="alert">
      <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </p>
  );
}

export default function FreeLookForm({ source }: { source: string }) {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [moreOpen, setMoreOpen] = useState(false);

  const started = useRef(false);
  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!started.current && key !== "company_fax") {
      started.current = true;
      track("form_start", { source });
    }
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstBad = (Object.keys(found) as (keyof Values)[])[0];
    if (firstBad) {
      document.getElementById(`fl-${firstBad}`)?.focus();
      return;
    }
    // Honeypot: bots fill hidden fields. Pretend it worked.
    if (values.company_fax) {
      setStatus("done");
      return;
    }

    setStatus("sending");
    const params = new URLSearchParams(window.location.search);
    const payload = {
      name: values.name,
      business: values.business,
      phone: values.phone,
      headache: values.headache,
      website: values.website,
      email: values.email,
      page: window.location.pathname,
      source,
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      _subject: `Free look request: ${values.business}`,
    };

    try {
      if (!endpoint) throw new Error("Lead form endpoint is not configured.");
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      track("form_submit", { source });
    } catch {
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div
        aria-live="polite"
        className="flex flex-col items-start gap-4 rounded-3xl border bg-card p-8 sm:p-10"
        role="status"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
          <CircleCheck aria-hidden="true" className="size-6" />
        </span>
        <p className="font-bold text-2xl tracking-tight">
          Got it. I'll review your business and reach out within an hour.
        </p>
        <p className="text-lg text-muted-foreground">
          I'll call or text from {contact.phoneDisplay}. Save it so you know it's me. Need me
          sooner? Call or text anytime.
        </p>
        <CallTextButtons source={`${source}-thanks`} />
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border bg-card p-8 sm:p-10" role="status">
        <span className="flex size-12 items-center justify-center rounded-full bg-foreground text-background">
          <CircleAlert aria-hidden="true" className="size-6" />
        </span>
        <p className="font-bold text-2xl tracking-tight">Online requests are not open on this preview yet.</p>
        <p className="text-lg text-muted-foreground">
          To talk through what is eating your week, call, text, or email Donovin directly.
        </p>
        <div className="flex flex-col gap-3">
          <CallTextButtons source={`${source}-preview`} />
          <EmailLink source={`${source}-preview`} />
        </div>
      </div>
    );
  }

  const field = (key: keyof Values, label: string, opts: { required?: boolean; type?: string; autoComplete?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; placeholder?: string } = {}) => (
    <Field
      className={`w-full gap-2.5 ${errors[key] ? "[&_[data-slot=input]]:border-2 [&_[data-slot=input]]:border-foreground" : ""}`}
    >
      <FieldLabel className="text-base sm:text-base" htmlFor={`fl-${key}`}>
        {label}
        {opts.required ? (
          <span className="text-muted-foreground font-normal text-sm">(required)</span>
        ) : (
          <span className="text-muted-foreground font-normal text-sm">(optional)</span>
        )}
      </FieldLabel>
      <Input
        aria-describedby={errors[key] ? `fl-${key}-err` : undefined}
        aria-invalid={errors[key] ? true : undefined}
        aria-required={opts.required || undefined}
        autoComplete={opts.autoComplete}
        className={inputSize}
        id={`fl-${key}`}
        inputMode={opts.inputMode}
        name={key}
        onChange={set(key)}
        placeholder={opts.placeholder}
        type={opts.type ?? "text"}
        value={values[key]}
      />
      <ErrorText id={`fl-${key}-err`} message={errors[key]} />
    </Field>
  );

  return (
    <Form className="relative flex flex-col gap-6 rounded-3xl border bg-card p-6 sm:p-8" noValidate onSubmit={onSubmit}>
      {field("name", "Your name", { required: true, autoComplete: "name" })}
      {field("business", "Business name", { required: true, autoComplete: "organization" })}
      {field("phone", "Best phone number", {
        required: true,
        type: "tel",
        autoComplete: "tel",
        inputMode: "tel",
      })}
      <Field className="w-full gap-2.5">
        <FieldLabel className="text-base sm:text-base" htmlFor="fl-headache">
          What's your biggest headache right now?
          <span className="text-muted-foreground font-normal text-sm">(optional)</span>
        </FieldLabel>
        <Textarea
          className="text-lg sm:text-base [&_textarea]:min-h-32 [&_textarea]:px-4 [&_textarea]:py-3"
          id="fl-headache"
          name="headache"
          onChange={set("headache")}
          placeholder="Missed calls, slow follow-up, quotes at night…"
          value={values.headache}
        />
      </Field>

      {moreOpen ? (
        <>
          {field("website", "Business website", {
            type: "url",
            autoComplete: "url",
            inputMode: "url",
            placeholder: "Helps me do my homework",
          })}
          {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
        </>
      ) : (
        <button
          className="-my-1 flex min-h-12 items-center gap-2 self-start rounded-full font-medium text-muted-foreground hover:text-foreground"
          onClick={() => setMoreOpen(true)}
          type="button"
        >
          <Plus aria-hidden="true" className="size-4" />
          Add your website or email
        </button>
      )}

      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="fl-company_fax">Company fax</label>
        <input
          autoComplete="off"
          id="fl-company_fax"
          name="company_fax"
          onChange={set("company_fax")}
          tabIndex={-1}
          value={values.company_fax}
        />
      </div>

      {status === "failed" && (
        <p className="flex items-start gap-2 rounded-2xl border p-4 text-base" role="alert">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Something went wrong sending that. Call or text {contact.phoneDisplay}, or email{" "}
            <EmailLink source={`${source}-error`} />.
          </span>
        </p>
      )}

      <div className="flex flex-col gap-3">
        <Button className={`${pill} w-full`} loading={status === "sending"} type="submit">
          Get my free look
        </Button>
        <p className="text-center text-muted-foreground text-sm">
          No payment. No spam. I read every one myself.
        </p>
      </div>
    </Form>
  );
}
