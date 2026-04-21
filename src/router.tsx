import { createBrowserRouter } from "react-router-dom";
import Intro from "./pages/Intro";
import Quote from "./pages/Quote";
import QuoteResult from "./pages/QuoteResult";
import Application from "./pages/Application";

export const router = createBrowserRouter([
  { path: "/", element: <Intro /> },
  { path: "/quote", element: <Quote /> },
  { path: "/quote/result", element: <QuoteResult /> },
  { path: "/apply", element: <Application /> },
]);
