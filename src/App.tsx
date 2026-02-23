import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://api.boreal.financial/bi";

const getToken = () => localStorage.getItem("bi_token");
const getRole = () => localStorage.getItem("bi_role");

function Protected({ children }: any) {
  if (!getToken()) return <Navigate to="/login" />;
  return children;
}

/* ================= NAV ================= */

function Nav() {
  const role = getRole();
  const navigate = useNavigate();

  return (
    <div className="nav">
      <div className="logo">Boreal Insurance</div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/what-is-pgi">What is PGI</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/apply">Apply Now</Link>

        {!role && <Link to="/login">Lender Login</Link>}
        {!role && <Link to="/login?role=referrer">Referrer Login</Link>}

        {role && <Link to="/dashboard">Dashboard</Link>}
        {role && (
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= PREMIUM CALC ================= */

function calculatePremium(loanAmount: number, loanType: string) {
  const insuredAmount = Math.min(loanAmount * 0.8, 1400000);
  const rate = loanType === "Secured" ? 0.016 : 0.04;
  const annualPremium = insuredAmount * rate;
  return { insuredAmount, annualPremium };
}

/* ================= HOME ================= */

function Home() {
  return (
    <div className="container">
      <h1>Protect Your Personal Assets</h1>
      <p>
        Personal Guarantee Insurance protects directors and business
        owners from personal liability when business loans default.
      </p>

      <div className="hero">
        <img
          src="https://images.unsplash.com/photo-1554224155-1696413565d3"
          alt="Business owner"
        />
      </div>

      <div className="cta">
        <Link to="/apply" className="button-primary">
          Get a Quote
        </Link>
      </div>
    </div>
  );
}

/* ================= WHAT IS PGI ================= */

function WhatIsPGI() {
  return (
    <div className="container">
      <h1>What is Personal Guarantee Insurance?</h1>

      <p>
        When a business takes a loan, lenders often require a personal
        guarantee from directors. If the business fails, directors can
        be personally pursued for repayment.
      </p>

      <p>
        Personal Guarantee Insurance covers up to 80% of the loan
        amount (maximum $1,400,000 CAD).
      </p>

      <h3>Example</h3>
      <p>
        $1,000,000 secured loan → coverage up to $800,000 →
        annual premium approx. 1.6% of insured amount.
      </p>
    </div>
  );
}

/* ================= CLAIMS ================= */

function Claims() {
  return (
    <div className="container">
      <h1>Claims Process</h1>

      <ol>
        <li>Loan default occurs</li>
        <li>Lender enforces personal guarantee</li>
        <li>Claim submitted</li>
        <li>Policy responds based on coverage</li>
      </ol>

      <p>
        Claims are handled by the underwriter. Boreal Insurance
        facilitates the process.
      </p>
    </div>
  );
}

/* ================= RESOURCES ================= */

function Resources() {
  return (
    <div className="container">
      <h1>Resources</h1>
      <ul>
        <li>Policy wording</li>
        <li>Application guide</li>
        <li>Case studies</li>
        <li>Director risk overview</li>
      </ul>
    </div>
  );
}

/* ================= CONTACT ================= */

function Contact() {
  const [sent, setSent] = useState(false);

  const submit = async () => {
    setSent(true);
  };

  return (
    <div className="container">
      <h1>Contact Us</h1>

      {sent ? (
        <p>Message sent.</p>
      ) : (
        <>
          <input placeholder="Name" />
          <input placeholder="Email" />
          <textarea placeholder="Message"></textarea>
          <button onClick={submit}>Send</button>
        </>
      )}
    </div>
  );
}

/* ================= APPLY ================= */

function Apply() {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const update = (k: string, v: any) =>
    setForm({ ...form, [k]: v });

  const submit = async () => {
    setLoading(true);

    const { insuredAmount, annualPremium } =
      calculatePremium(
        parseFloat(form.loanAmount),
        form.loanType
      );

    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        loanAmount: parseFloat(form.loanAmount),
        insuredAmount,
        annualPremium
      })
    });

    navigate("/success");
  };

  const { insuredAmount, annualPremium } =
    calculatePremium(
      parseFloat(form.loanAmount || 0),
      form.loanType || "Secured"
    );

  return (
    <div className="container">
      <h1>Apply</h1>

      <input
        placeholder="Loan Amount"
        onChange={(e) =>
          update("loanAmount", e.target.value)
        }
      />

      <select
        onChange={(e) =>
          update("loanType", e.target.value)
        }
      >
        <option value="Secured">Secured (1.6%)</option>
        <option value="Unsecured">Unsecured (4.0%)</option>
      </select>

      <input
        placeholder="Full Name"
        onChange={(e) =>
          update("name", e.target.value)
        }
      />
      <input
        placeholder="Email"
        onChange={(e) =>
          update("email", e.target.value)
        }
      />
      <input
        placeholder="Business Name"
        onChange={(e) =>
          update("businessName", e.target.value)
        }
      />

      <div className="quote-box">
        Coverage: ${insuredAmount.toLocaleString()}
        <br />
        Premium: ${annualPremium.toLocaleString()}
      </div>

      <button disabled={loading} onClick={submit}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

/* ================= SUCCESS ================= */

function Success() {
  return (
    <div className="container">
      <h1>Application Submitted</h1>
      <p>
        Your application has been received and will be
        reviewed.
      </p>
    </div>
  );
}

/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lender");

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role })
    });

    const data = await res.json();

    localStorage.setItem("bi_token", data.token);
    localStorage.setItem("bi_role", role);
    localStorage.setItem("bi_email", email);

    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <select
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="lender">Lender</option>
        <option value="referrer">Referrer</option>
        <option value="admin">Admin</option>
      </select>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard() {
  const [policies, setPolicies] = useState<any[]>([]);
  const role = getRole();

  useEffect(() => {
    fetch(`${API}/policies`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((r) => r.json())
      .then(setPolicies);
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Policy</th>
            <th>Start</th>
            <th>End</th>
            {role === "referrer" && (
              <th>Commission (10%)</th>
            )}
          </tr>
        </thead>
        <tbody>
          {policies.map((p) => (
            <tr key={p.id}>
              <td>{p.policy_number}</td>
              <td>{p.start_date}</td>
              <td>{p.end_date}</td>
              {role === "referrer" && (
                <td>
                  $
                  {(
                    p.annual_premium * 0.1
                  ).toLocaleString()}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/what-is-pgi" element={<WhatIsPGI />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
