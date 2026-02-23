import React, { useState, useEffect } from "react";

const API = "https://api.boreal.financial/bi";

type Page =
  | "home"
  | "apply"
  | "claims"
  | "contact"
  | "lender"
  | "referrer";

function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div style={styles.container}>
      <Nav setPage={setPage} />
      {page === "home" && <Home setPage={setPage} />}
      {page === "apply" && <Application />}
      {page === "claims" && <Claims />}
      {page === "contact" && <Contact />}
      {page === "lender" && <Login role="lender" />}
      {page === "referrer" && <Login role="referrer" />}
      <Footer />
    </div>
  );
}

/* ================= NAV ================= */

function Nav({ setPage }: any) {
  return (
    <nav style={styles.nav}>
      <h2 style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
        Boreal Insurance
      </h2>
      <div style={styles.navLinks}>
        <button onClick={() => setPage("apply")}>Apply</button>
        <button onClick={() => setPage("claims")}>Claims</button>
        <button onClick={() => setPage("contact")}>Contact</button>
        <button onClick={() => setPage("lender")}>Lender Login</button>
        <button onClick={() => setPage("referrer")}>Referrer Login</button>
      </div>
    </nav>
  );
}

/* ================= HOME ================= */

function Home({ setPage }: any) {
  return (
    <div>
      <section style={styles.hero}>
        <h1>Protect Your Personal Guarantee</h1>
        <p>
          Personal Guarantee Insurance protects directors and business owners
          if lenders enforce guarantees.
        </p>
        <button onClick={() => setPage("apply")}>Get a Quote</button>
      </section>

      <section>
        <h2>How It Works</h2>
        <ul>
          <li>Coverage up to 80% of loan exposure</li>
          <li>Maximum insured amount $1,400,000</li>
          <li>Secured loans: 1.6% annually</li>
          <li>Unsecured loans: 4.0% annually</li>
        </ul>
      </section>

      <section>
        <h2>Example</h2>
        <p>
          $1,000,000 unsecured loan → $800,000 insured → $32,000 annual premium.
        </p>
      </section>
    </div>
  );
}

/* ================= APPLICATION ================= */

function Application() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    businessName: "",
    loanAmount: 0,
    loanType: "Secured" as "Secured" | "Unsecured",
    referrerEmail: "",
  });

  const maxCoverage = Math.min(form.loanAmount * 0.8, 1400000);
  const rate = form.loanType === "Secured" ? 0.016 : 0.04;
  const premium = maxCoverage * rate;

  function update(field: string, value: any) {
    setForm({ ...form, [field]: value });
  }

  function validate() {
    if (!form.name || !form.email || !form.businessName)
      return "All personal fields required.";
    if (!form.loanAmount || form.loanAmount <= 0)
      return "Valid loan amount required.";
    return "";
  }

  async function submit() {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          businessName: form.businessName,
          loanAmount: form.loanAmount,
          loanType: form.loanType,
          insuredAmount: maxCoverage,
          annualPremium: premium,
          referrerEmail: form.referrerEmail || null,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      setSuccess(true);
    } catch {
      setError("Submission error. Please try again.");
    }

    setLoading(false);
  }

  if (success) {
    return <h2>Application Submitted. Our team will contact you.</h2>;
  }

  return (
    <div>
      <h2>Application</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Full Name"
            onChange={(e) => update("name", e.target.value)}
          />
          <br />
          <br />
          <input placeholder="Email" onChange={(e) => update("email", e.target.value)} />
          <br />
          <br />
          <input
            placeholder="Business Name"
            onChange={(e) => update("businessName", e.target.value)}
          />
          <br />
          <br />
          <button onClick={() => setStep(2)}>Next</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="number"
            placeholder="Loan Amount"
            onChange={(e) => update("loanAmount", Number(e.target.value))}
          />
          <br />
          <br />
          <select onChange={(e) => update("loanType", e.target.value)}>
            <option value="Secured">Secured (1.6%)</option>
            <option value="Unsecured">Unsecured (4.0%)</option>
          </select>
          <br />
          <br />
          <input
            placeholder="Referrer Email (optional)"
            onChange={(e) => update("referrerEmail", e.target.value)}
          />
          <br />
          <br />
          <button onClick={() => setStep(3)}>Review</button>
        </>
      )}

      {step === 3 && (
        <>
          <h3>Quote Summary</h3>
          <p>Loan: ${form.loanAmount.toLocaleString()}</p>
          <p>Coverage: ${maxCoverage.toLocaleString()}</p>
          <p>Annual Premium: ${premium.toLocaleString()}</p>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button disabled={loading} onClick={submit}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </>
      )}
    </div>
  );
}

/* ================= CLAIMS ================= */

function Claims() {
  return (
    <div>
      <h2>Claims Process</h2>
      <p>
        Notify Boreal Insurance immediately if a lender enforces a personal
        guarantee. Claims are reviewed under policy terms.
      </p>
    </div>
  );
}

/* ================= CONTACT ================= */

function Contact() {
  return (
    <div>
      <h2>Contact Us</h2>
      <input placeholder="Name" />
      <br />
      <br />
      <input placeholder="Email" />
      <br />
      <br />
      <textarea placeholder="Message" rows={4} />
      <br />
      <br />
      <button>Send</button>
    </div>
  );
}

/* ================= LOGIN ================= */

function Login({ role }: { role: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bi_token");
    if (token) {
      console.log("Token loaded from localStorage");
    }
  }, []);

  async function login() {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (json.token) {
      localStorage.setItem("bi_token", json.token);
      alert("Login successful");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div>
      <h2>{role === "lender" ? "Lender" : "Referrer"} Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={login}>Login</button>
    </div>
  );
}

/* ================= FOOTER ================= */

function Footer() {
  return (
    <footer style={{ marginTop: 60 }}>
      <hr />
      <p>© Boreal Insurance — Canada</p>
    </footer>
  );
}

/* ================= STYLES ================= */

const styles: any = {
  container: {
    fontFamily: "Arial",
    padding: 40,
    maxWidth: 1000,
    margin: "auto",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  navLinks: {
    display: "flex",
    gap: 15,
  },
  hero: {
    padding: 40,
    background: "#f5f5f5",
    marginBottom: 40,
  },
};

export default App;
