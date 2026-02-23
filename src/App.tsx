import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  return (
    <div className="nav">
      <h2>Boreal Insurance</h2>
      <div className="nav-links">
        <Link to="/what-is-pgi">What is PGI</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/apply" className="button-primary">Apply Now</Link>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="hero">
      <div>
        <h1>Personal Guarantee Insurance</h1>
        <p>
          Protect your personal assets when guaranteeing business loans.
          Designed for Canadian business owners and directors.
        </p>
        <Link to="/apply" className="button-primary">Get Protected</Link>
      </div>
      <img src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d1" />
    </div>
  );
}

function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});

  const update = (field: string, value: any) =>
    setForm({ ...form, [field]: value });

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const submit = () => {
    console.log("Application Submitted:", form);
    navigate("/thank-you");
  };

  return (
    <div className="container">
      <h1>Personal Guarantee Insurance Application</h1>
      <p>Step {step} of 5</p>

      {step === 1 && (
        <>
          <h2>Applicant Details</h2>
          <input placeholder="Full Legal Name"
            onChange={(e) => update("name", e.target.value)} />
          <input placeholder="Email"
            onChange={(e) => update("email", e.target.value)} />
          <input placeholder="Phone"
            onChange={(e) => update("phone", e.target.value)} />
          <input placeholder="Province"
            onChange={(e) => update("province", e.target.value)} />
          <button className="button-primary" onClick={next}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Business Information</h2>
          <input placeholder="Business Legal Name"
            onChange={(e) => update("businessName", e.target.value)} />
          <input placeholder="Industry"
            onChange={(e) => update("industry", e.target.value)} />
          <input placeholder="Years in Operation"
            onChange={(e) => update("yearsOperating", e.target.value)} />
          <input placeholder="Annual Revenue (CAD)"
            onChange={(e) => update("revenue", e.target.value)} />
          <button onClick={back}>Back</button>
          <button className="button-primary" onClick={next}>Next</button>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Loan Details</h2>
          <input placeholder="Lender Name"
            onChange={(e) => update("lender", e.target.value)} />
          <input placeholder="Loan Amount (CAD)"
            onChange={(e) => update("loanAmount", e.target.value)} />
          <input placeholder="Type of Facility (LOC, Term Loan, etc.)"
            onChange={(e) => update("facilityType", e.target.value)} />
          <input placeholder="Guarantee Percentage (%)"
            onChange={(e) => update("guaranteePercent", e.target.value)} />
          <button onClick={back}>Back</button>
          <button className="button-primary" onClick={next}>Next</button>
        </>
      )}

      {step === 4 && (
        <>
          <h2>Risk Assessment</h2>
          <label>Has the business ever defaulted?</label>
          <select onChange={(e) => update("priorDefault", e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <label>Are there other guarantors?</label>
          <select onChange={(e) => update("otherGuarantors", e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <label>Are there existing legal disputes?</label>
          <select onChange={(e) => update("legalDisputes", e.target.value)}>
            <option>No</option>
            <option>Yes</option>
          </select>

          <button onClick={back}>Back</button>
          <button className="button-primary" onClick={next}>Next</button>
        </>
      )}

      {step === 5 && (
        <>
          <h2>Review & Submit</h2>
          <pre style={{ background: "#102a52", padding: 20 }}>
            {JSON.stringify(form, null, 2)}
          </pre>
          <button onClick={back}>Back</button>
          <button className="button-primary" onClick={submit}>
            Submit Application
          </button>
        </>
      )}
    </div>
  );
}

function ThankYou() {
  return (
    <div className="container">
      <h1>Application Received</h1>
      <p>
        Thank you. A Boreal Insurance advisor will contact you within 24 hours.
      </p>
    </div>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="container">
      <h1>{title}</h1>
      <p>Content coming soon.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/what-is-pgi" element={<Placeholder title="What is PGI" />} />
        <Route path="/claims" element={<Placeholder title="Claims" />} />
        <Route path="/resources" element={<Placeholder title="Resources" />} />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
      </Routes>
    </BrowserRouter>
  );
}
