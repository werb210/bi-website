import { Link } from "react-router-dom";
import PremiumCalculator from "../components/PremiumCalculator";
import Section from "../components/ui/Section";

export default function Home() {
  return (
    <>
      <Section>
        <h1>Protect Your Personal Assets</h1>
        <p>
          Insurance for Canadian business owners with personal guarantees.
          Protect your home, savings, and investments.
        </p>

        <Link
          to="/apply"
          className="h-12 px-8 rounded-full font-semibold tracking-wide transition-all duration-200 bg-[#1e63ff] hover:bg-[#174fd6] shadow-[0_6px_20px_rgba(30,99,255,0.35)] inline-flex items-center justify-center"
        >
          Start Application
        </Link>

        <div className="mt-10 flex flex-wrap gap-6 text-sm text-white/60 justify-center">
          <span>✓ Canadian-based</span>
          <span>✓ Policy Underwritten by Purbeck</span>
          <span>✓ Secured &amp; Unsecured Covered</span>
          <span>✓ Max Coverage $1,400,000</span>
        </div>

        <PremiumCalculator />
      </Section>

      <div className="border-t border-white/10 my-16"></div>

      <Section>
        <h2>Coverage Overview</h2>
        <ul>
          <li>Up to 80% coverage of enforced guarantee</li>
          <li>Maximum insured: $1,400,000 CAD</li>
          <li>Secured & unsecured facilities</li>
          <li>Annual renewable policy</li>
        </ul>
      </Section>

      <div className="border-t border-white/10 my-16"></div>

      <Section>
        <h2>Why Choose Boreal</h2>
        <div className="badges">
          <div className="badge">Canadian Business Focused</div>
          <div className="badge">Specialist Guarantee Coverage</div>
          <div className="badge">Trusted UK Underwriter</div>
          <div className="badge">Secure Application Process</div>
        </div>
      </Section>

      <div className="mobile-cta">
        <Link to="/apply">Apply Now</Link>
      </div>
    </>
  );
}
