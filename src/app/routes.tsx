import { createBrowserRouter } from "react-router";
import SiteShell from "@/components/site/SiteShell";
import AboutPage from "@/pages/AboutPage";
import ExamplesPage from "@/pages/ExamplesPage";
import HomePage from "@/pages/HomePage";
import NotFoundPage from "@/pages/NotFoundPage";
import { PrivacyPage, TermsPage } from "@/pages/LegalPages";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SiteShell,
    children: [
      { index: true, Component: HomePage },
      { path: "examples", Component: ExamplesPage },
      { path: "about", Component: AboutPage },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
