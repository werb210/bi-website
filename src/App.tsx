import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import { track } from "./lib/analytics";

const Home = lazy(() => import("./pages/Home"));
const PGIApplication = lazy(() => import("./pages/PGIApplication"));
const LenderPortal = lazy(() => import("./pages/LenderPortal"));
const ReferrerPortal = lazy(() => import("./pages/ReferrerPortal"));
const Contact = lazy(() => import("./pages/Contact"));

function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    track("page_view", { path: location.pathname });
  }, [location]);

  return null;
}

export default function App() {
  return (
    <Layout>
      <RouteTracker />
      <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<PGIApplication />} />
          <Route path="/lender" element={<LenderPortal />} />
          <Route path="/referrer" element={<ReferrerPortal />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
