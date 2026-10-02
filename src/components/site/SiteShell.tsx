import { useEffect, useState, useSyncExternalStore } from "react";
import { Menu, Phone } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ThemeSwitcher } from "@/components/site/ThemeControl";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetPanel,
  SheetPopup,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ToastProvider } from "@/components/ui/toast";
import {
  CallTextButtons,
  EmailLink,
  PrimaryCta,
  Wordmark,
  pill,
  useScrollToForm,
} from "@/components/site/cta";
import { FORM_ID, contact } from "@/content/site";
import { examples } from "@/content/examples";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

type Theme = "light" | "dark" | "system";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Examples", to: "/examples" },
  { label: "About", to: "/about" },
];

function readTheme(): Theme {
  try {
    const stored = window.localStorage.getItem("clockout-theme");
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

const themeListeners = new Set<() => void>();
let currentTheme: Theme | null = null;

function getTheme(): Theme {
  currentTheme ??= readTheme();
  return currentTheme;
}

function subscribeTheme(cb: () => void) {
  themeListeners.add(cb);
  return () => {
    themeListeners.delete(cb);
  };
}

function setThemeStore(next: Theme) {
  currentTheme = next;
  try {
    if (next === "system") window.localStorage.removeItem("clockout-theme");
    else window.localStorage.setItem("clockout-theme", next);
  } catch {
    /* storage unavailable */
  }
  applyTheme(next);
  themeListeners.forEach((l) => l());
}

function applyTheme(theme: Theme) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle(
    "dark",
    theme === "dark" || (theme === "system" && prefersDark),
  );
}

function ThemeControl({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "system" as Theme);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => theme === "system" && applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  return (
    <ThemeSwitcher
      className={cn("h-14 items-center p-1 [&>button]:size-12", className)}
      onChange={setThemeStore}
      value={theme}
    />
  );
}

const exampleSlugs = new Set(examples.map((e) => e.slug));

/** The sticky mobile CTA bar and its footer clearance apply only to the three pages that offer the free look. */
const mobileCtaRoutes = new Set(["/", "/examples", "/about"]);

function useMobileCtaBar() {
  return mobileCtaRoutes.has(useLocation().pathname);
}

/** Scroll to top on route change, or to the #hash target (example modals handle their own hashes). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const id = hash.slice(1);
    if (id && !exampleSlugs.has(id)) {
      const t = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 60);
      return () => window.clearTimeout(t);
    }
    if (!id) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Header() {
  const scrollToForm = useScrollToForm();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5 sm:h-18 sm:px-8">
        <Link aria-label="Clockout home" className="-mx-1 inline-flex min-h-11 items-center rounded-md px-1" to="/">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "relative inline-flex h-12 items-center rounded-full px-4 font-medium text-base transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )
              }
              end
              key={item.to}
              to={item.to}
            >
              {({ isActive }) => (
                <span className="relative">
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px w-full bg-current transition-opacity",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            aria-label={`Call ${contact.phoneDisplay}`}
            className="h-12 w-12 px-0 sm:h-12 sm:w-auto sm:px-4 lg:px-5"
            onClick={() => track("call_tap", { source: "header" })}
            render={<a href={contact.tel} />}
            variant="outline"
          >
            <Phone aria-hidden="true" />
            <span className="hidden lg:inline">{contact.phoneDisplay}</span>
          </Button>
          <Button
            className={cn(pill, "hidden sm:inline-flex")}
            onClick={() => {
              track("cta_primary_click", { source: "header" });
              scrollToForm();
            }}
          >
            Free look
          </Button>
          <ThemeControl className="hidden md:flex" />

          <Sheet onOpenChange={setMenuOpen} open={menuOpen}>
            <SheetTrigger
              aria-label="Open menu"
              render={<Button className="size-12 sm:size-12 md:hidden" variant="ghost" />}
            >
              <Menu aria-hidden="true" className="size-5" />
            </SheetTrigger>
            <SheetPopup
              closeProps={{ className: "absolute end-3 top-3 size-12 sm:size-12" }}
              side="right"
            >
              <SheetPanel className="flex flex-col gap-8 pt-6">
                <SheetTitle className="pr-14">
                  <Wordmark />
                </SheetTitle>
                <nav aria-label="Mobile" className="flex flex-col">
                  {navigation.map((item) => (
                    <SheetClose
                      key={item.to}
                      render={
                        <NavLink
                          className={({ isActive }) =>
                            cn(
                              "flex min-h-14 items-center border-b font-semibold text-2xl tracking-tight",
                              !isActive && "text-muted-foreground",
                            )
                          }
                          end
                          to={item.to}
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  ))}
                </nav>
                <div className="flex flex-col gap-3">
                  <PrimaryCta onBeforeScroll={() => setMenuOpen(false)} source="menu" />
                  <CallTextButtons source="menu" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Theme</span>
                  <ThemeControl />
                </div>
              </SheetPanel>
            </SheetPopup>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  const links = [
    { label: "Examples", to: "/examples" },
    { label: "About", to: "/about" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ];
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-[1100px] gap-8 px-5 py-12 sm:grid-cols-2 sm:px-8">
        <div className="flex flex-col gap-2">
          <Wordmark />
          <p className="text-muted-foreground">Roscoe, Illinois</p>
          <a className="mt-2 inline-flex min-h-12 w-fit items-center font-medium" href={contact.tel} onClick={() => track("call_tap", { source: "footer" })}>
            {contact.phoneDisplay}
          </a>
          <EmailLink source="footer" />
        </div>
        <div className="flex flex-col justify-between gap-6 sm:items-end">
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link className="inline-flex min-h-12 items-center text-muted-foreground hover:text-foreground" to={l.to}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm">© 2026 Clockout. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function MobileCtaBar() {
  const scrollToForm = useScrollToForm();
  const { pathname } = useLocation();
  const [formInView, setFormInView] = useState(false);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setFormInView(false);
    const el = document.getElementById(FORM_ID);
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.matches("input, textarea, select");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  const hidden = formInView || typing;
  return (
    <div
      aria-hidden={hidden || undefined}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden",
        hidden && "pointer-events-none translate-y-full",
      )}
      inert={hidden}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <Button
          className={cn(pill, "flex-1 px-0 sm:px-0")}
          onClick={() => track("call_tap", { source: "sticky" })}
          render={<a href={contact.tel} />}
          variant="outline"
        >
          <Phone aria-hidden="true" />
          Call
        </Button>
        <Button
          className={cn(pill, "flex-[1.6] px-0 sm:px-0")}
          onClick={() => {
            track("cta_primary_click", { source: "sticky" });
            scrollToForm();
          }}
        >
          Free look
        </Button>
      </div>
    </div>
  );
}

export default function SiteShell() {
  const showMobileCtaBar = useMobileCtaBar();

  return (
    <ToastProvider position="top-center">
      <div className="flex min-h-screen max-w-full flex-col overflow-x-hidden bg-background text-foreground">
        <a
          className="sr-only z-50 rounded-full bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          href="#main"
        >
          Skip to content
        </a>
        <ScrollManager />
        <Header />
        <main className="flex-1 overflow-x-hidden" id="main">
          <Outlet />
        </main>
        <div className={cn(showMobileCtaBar && "pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0")}>
          <Footer />
        </div>
        {showMobileCtaBar && <MobileCtaBar />}
      </div>
    </ToastProvider>
  );
}
