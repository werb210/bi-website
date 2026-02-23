import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  return (
    <header className="nav">
      <Link to="/" className="brand">Boreal Insurance</Link>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/what-is-personal-guarantee-insurance">What is PGI</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/case-studies">Case Studies</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/apply" className="button-primary">Apply</Link>
      </nav>
    </header>
  );
}

function calculateQuote(data: any) {
  const loan = parseFloat(data.loanAmount || 0);
  const coverageCap = 1400000;
  const insuredAmount = Math.min(loan * 0.8, coverageCap);
  const rate = data.loanType === "Secured" ? 0.016 : 0.04;

  return {
    insuredAmount,
    annualPremium: insuredAmount * rate,
    rate,
  };
}

function underwritingSummary(data: any, quote: any) {
  return `
BOREAL INSURANCE – PGI SUMMARY
---------------------------------------

Applicant: ${data.name}
Business: ${data.businessName}
Province: ${data.province}

Loan Amount: $${Number(data.loanAmount).toLocaleString()} CAD
Loan Type: ${data.loanType}

Maximum Coverage (80% rule): $${(Number(data.loanAmount) * 0.8).toLocaleString()} CAD
Coverage Cap: $1,400,000 CAD

Approved Insured Amount: $${quote.insuredAmount.toLocaleString()} CAD

Rate Applied: ${(quote.rate * 100).toFixed(2)}%
Annual Premium: $${quote.annualPremium.toLocaleString()} CAD

Terms:
• Coverage limited to 80% of loan amount
• Maximum insured amount $1,400,000 CAD
• Premium payable annually
`;
}

function Home() {
  return (
    <>
      <section className="hero container">
        <div>
          <p className="eyebrow">Executive Risk Protection</p>
          <h1>Protect Your Personal Assets When Signing a Business Loan</h1>
          <p>
            Personal Guarantee Insurance protects directors and business owners from personal financial loss if
            their company defaults.
          </p>
          <div className="button-row">
            <Link to="/apply" className="button-primary">Apply Now</Link>
            <Link to="/contact" className="button-secondary">Speak to an Advisor</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How It Works</h2>
          <p>Most lenders require directors to sign a Personal Guarantee when securing business finance.</p>
          <p>If the business fails, the lender can pursue your personal assets.</p>
          <div className="grid stats-grid">
            <div className="card"><strong>80%</strong><span>Coverage of your loan</span></div>
            <div className="card"><strong>$1,400,000 CAD</strong><span>Maximum insured amount</span></div>
            <div className="card"><strong>1.6% annually</strong><span>Secured loans</span></div>
            <div className="card"><strong>4.0% annually</strong><span>Unsecured loans</span></div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <h2>Why Boreal Insurance</h2>
          <ul className="list">
            <li>Canadian-focused underwriting</li>
            <li>Designed for entrepreneurs</li>
            <li>Coverage aligned with lender requirements</li>
            <li>Simple underwriting process</li>
            <li>Referral-friendly structure</li>
          </ul>
        </div>
      </section>
    </>
  );
}

function WhatIsPGI() {
  return (
    <section className="section">
      <div className="container content">
        <h1>What is Personal Guarantee Insurance?</h1>
        <h2>What Is a Personal Guarantee?</h2>
        <p>
          A Personal Guarantee is a legally binding agreement where a business owner agrees to be personally
          liable if the business cannot repay a loan.
        </p>
        <h2>Why Is It Risky?</h2>
        <ul className="list">
          <li>Personal savings can be seized</li>
          <li>Real estate may be pursued</li>
          <li>Legal action may be taken</li>
        </ul>
        <h2>What PGI Covers</h2>
        <p>Personal Guarantee Insurance reimburses a portion of the enforced personal guarantee.</p>
        <h3>Coverage Rules</h3>
        <ul className="list">
          <li>Up to 80% of loan value</li>
          <li>Maximum insured amount $1,400,000 CAD</li>
          <li>Annual premium based on loan type</li>
        </ul>
      </div>
    </section>
  );
}

function Claims() {
  return (
    <section className="section">
      <div className="container content">
        <h1>Claims</h1>
        <h2>Claims Process</h2>
        <ol className="list">
          <li>Business defaults</li>
          <li>Lender enforces guarantee</li>
          <li>Legal documentation submitted</li>
          <li>Claim assessed</li>
          <li>Payment issued per policy terms</li>
        </ol>
        <h2>Required Documents</h2>
        <ul className="list">
          <li>Loan agreement</li>
          <li>Personal guarantee</li>
          <li>Default notice</li>
          <li>Enforcement documentation</li>
        </ul>
      </div>
    </section>
  );
}

function CaseStudies() {
  return (
    <section className="section">
      <div className="container content">
        <h1>Case Studies</h1>
        <div className="grid">
          <article className="card">
            <h2>Example 1 – Construction Company</h2>
            <p>Loan: $1,000,000 secured</p>
            <p>Insured amount: $800,000</p>
            <p>Premium: $12,800 annually</p>
            <p>Business downturn leads to default. Policy reimburses per insured percentage.</p>
          </article>
          <article className="card">
            <h2>Example 2 – Retail Startup</h2>
            <p>Loan: $400,000 unsecured</p>
            <p>Insured amount: $320,000</p>
            <p>Premium: $12,800 annually</p>
            <p>Unexpected market contraction triggers insolvency. Coverage reduces personal exposure.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section className="section">
      <div className="container content">
        <h1>Resources</h1>
        <ul className="list">
          <li>What lenders look for in guarantees</li>
          <li>Risk management strategies</li>
          <li>Understanding secured vs unsecured loans</li>
          <li>Director liability explained</li>
        </ul>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section">
      <div className="container content">
        <h1>Contact</h1>
        <p>Questions about Personal Guarantee Insurance? Speak to a Boreal advisor today.</p>
        <form className="card">
          <input placeholder="Name" />
          <input placeholder="Company" />
          <input placeholder="Email" type="email" />
          <input placeholder="Phone" />
          <select defaultValue="">
            <option value="" disabled>Inquiry Type</option>
            <option>New Coverage</option>
            <option>Policy Question</option>
            <option>Claims Support</option>
            <option>Partner Referral</option>
          </select>
          <textarea placeholder="Message" rows={4} />
          <button type="submit" className="button-primary">Send Inquiry</button>
        </form>
      </div>
    </section>
  );
}

function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({ loanType: "Secured" });

  const update = (field: string, value: any) => setForm({ ...form, [field]: value });

  const generate = () => {
    const quote = calculateQuote(form);
    navigate("/quote", { state: { ...form, quote } });
  };

  return (
    <div className="container content">
      <h1>Personal Guarantee Insurance Application</h1>
      <p>Step {step} of 3</p>

      {step === 1 && (
        <>
          <h2>Applicant Details</h2>
          <input placeholder="Full Name" onChange={(e) => update("name", e.target.value)} />
          <input placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Province" onChange={(e) => update("province", e.target.value)} />
          <button className="button-primary" onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Business Details</h2>
          <input placeholder="Business Name" onChange={(e) => update("businessName", e.target.value)} />
          <input placeholder="Loan Amount (CAD)" onChange={(e) => update("loanAmount", e.target.value)} />
          <label>Loan Type</label>
          <select onChange={(e) => update("loanType", e.target.value)}>
            <option value="Secured">Secured (1.6%)</option>
            <option value="Unsecured">Unsecured (4.0%)</option>
          </select>
          <div className="button-row">
            <button onClick={() => setStep(1)}>Back</button>
            <button className="button-primary" onClick={generate}>Generate Quote</button>
          </div>
        </>
      )}
    </div>
  );
}

function Quote() {
  const { state: data }: any = useLocation();
  const navigate = useNavigate();

  if (!data) return <div className="container"><h1>No Quote Data</h1></div>;

  const summary = underwritingSummary(data, data.quote);

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Boreal_PGI_Summary.txt";
    a.click();
  };

  return (
    <div className="container content">
      <h1>Your PGI Quote</h1>
      <div className="card">
        <h2>Insured Amount</h2>
        <h3>${data.quote.insuredAmount.toLocaleString()} CAD</h3>
        <h2>Annual Premium</h2>
        <h3>${data.quote.annualPremium.toLocaleString()} CAD</h3>
        <p>Rate: {(data.quote.rate * 100).toFixed(2)}%</p>
      </div>
      <pre className="card quote-summary">{summary}</pre>
      <div className="button-row">
        <button className="button-primary" onClick={downloadSummary}>Download Summary</button>
        <button onClick={() => navigate("/")}>Return Home</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/what-is-personal-guarantee-insurance" element={<WhatIsPGI />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/quote" element={<Quote />} />
      </Routes>
    </BrowserRouter>
  );
}
