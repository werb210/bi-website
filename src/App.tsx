import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quote from "./pages/Quote";
import Application from "./pages/Application";
import ThankYou from "./pages/ThankYou";
import PolicyLookup from "./pages/PolicyLookup";
import LenderGate from "./pages/LenderGate";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quote" element={<Quote />} />
      <Route path="/apply" element={<Application />} />
      <Route path="/lender" element={<LenderGate />} />
      <Route path="/lender/apply" element={<Application lenderMode />} />
      <Route path="/policy-status" element={<PolicyLookup />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}
