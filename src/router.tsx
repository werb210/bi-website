import { createBrowserRouter } from "react-router-dom";
import Intro from "./pages/Intro";
import Quote from "./pages/Quote";
import QuoteResult from "./pages/QuoteResult";
import Application from "./pages/Application";
import Documents from "./pages/Documents";
import Signature from "./pages/Signature";
import WhatIsPGI from "./pages/WhatIsPGI";
import HowItWorks from "./pages/HowItWorks";
import Coverage from "./pages/Coverage";
import WhyItMatters from "./pages/WhyItMatters";

export const router = createBrowserRouter([
  { path: "/", element: <Intro /> },
  { path: "/quote", element: <Quote /> },
  { path: "/quote/result", element: <QuoteResult /> },

  { path: "/apply", element: <Application /> },
  { path: "/apply/documents", element: <Documents /> },
  { path: "/apply/signature", element: <Signature /> },

  { path: "/what-is-pgi", element: <WhatIsPGI /> },
  { path: "/how-it-works", element: <HowItWorks /> },
  { path: "/coverage", element: <Coverage /> },
  { path: "/why-it-matters", element: <WhyItMatters /> },
]);
