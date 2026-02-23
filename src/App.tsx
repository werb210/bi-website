import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate
} from "react-router-dom";
import { useState, useEffect } from "react";

/* ================= CONFIG ================= */

const API = "https://api.boreal.financial/bi";

/* ================= PRODUCT RULES ================= */

function calculateQuote(data: any) {
  const loan = parseFloat(data.loanAmount || 0);
  const insuredAmount = Math.min(loan * 0.8, 1400000);
  const rate = data.loanType === "Secured" ? 0.016 : 0.04;
  const annualPremium = insuredAmount * rate;
  return { insuredAmount, annualPremium, rate };
}

/* ================= AUTH HELPERS ================= */

function getToken() {
  return localStorage.getItem("bi_token");
}

function getRole() {
  return localStorage.getItem("bi_role");
}

function clearAuth() {
  localStorage.removeItem("bi_token");
  localStorage.removeItem("bi_role");
}

function Protected({ children, role }: any) {
  const token = getToken();
  const userRole = getRole();

  if (!token) return <Navigate to="/login" />;
  if (role && role !== userRole && userRole !== "admin")
    return <Navigate to="/" />;

  return children;
}

/* ================= NAVBAR ================= */

function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  return (
    <div className="nav">
      <h2>Boreal Insurance</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/apply">Apply</Link>

        {!role && <Link to="/login" className="button-primary">Login</Link>}

        {role && (
          <>
            <Link to={`/${role}-dashboard`}>Dashboard</Link>
            <button
              className="button-primary"
              onClick={() => {
                clearAuth();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ================= HOME ================= */

function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanType, setLoanType] = useState("Secured");
  const navigate = useNavigate();

  const calculate = () => {
    const result = calculateQuote({ loanAmount, loanType });
    navigate("/quote", {
      state: { loanAmount, loanType, quote: result }
    });
  };

  return (
    <div className="container">
      <h1>Personal Guarantee Insurance</h1>

      <div className="card">
        <input
          placeholder="Loan Amount (CAD)"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />

        <select
          value={loanType}
          onChange={(e) => setLoanType(e.target.value)}
        >
          <option value="Secured">Secured (1.6%)</option>
          <option value="Unsecured">Unsecured (4.0%)</option>
        </select>

        <button className="button-primary" onClick={calculate}>
          Calculate Premium
        </button>
      </div>
    </div>
  );
}

/* ================= APPLICATION ================= */

function Apply() {
  const navigate = useNavigate();
  const role = getRole();
  const [form, setForm] = useState<any>({ loanType: "Secured" });

  const update = (f: string, v: any) =>
    setForm({ ...form, [f]: v });

  const submit = async () => {
    const quote = calculateQuote(form);

    const body = {
      ...form,
      ...quote,
      referrerEmail: role === "referrer" ? localStorage.getItem("bi_email") : null
    };

    await fetch(`${API}/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken() || ""}`
      },
      body: JSON.stringify(body)
    });

    navigate("/quote", { state: { ...form, quote } });
  };

  return (
    <div className="container">
      <h1>PGI Application</h1>

      <input placeholder="Full Name" onChange={(e) => update("name", e.target.value)} />
      <input placeholder="Email" onChange={(e) => update("email", e.target.value)} />
      <input placeholder="Business Name" onChange={(e) => update("businessName", e.target.value)} />
      <input placeholder="Loan Amount (CAD)" onChange={(e) => update("loanAmount", e.target.value)} />

      <select onChange={(e) => update("loanType", e.target.value)}>
        <option value="Secured">Secured</option>
        <option value="Unsecured">Unsecured</option>
      </select>

      <button className="button-primary" onClick={submit}>
        Submit Application
      </button>
    </div>
  );
}

/* ================= QUOTE ================= */

function Quote() {
  const location = useLocation();
  const data: any = location.state;

  if (!data) return <Navigate to="/" />;

  return (
    <div className="container">
      <h1>Your Quote</h1>

      <div className="card">
        <h3>Insured Amount</h3>
        <h2>${data.quote.insuredAmount.toLocaleString()}</h2>

        <h3>Annual Premium</h3>
        <h2>${data.quote.annualPremium.toLocaleString()}</h2>
      </div>
    </div>
  );
}

/* ================= LOGIN ================= */

function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lender");
  const navigate = useNavigate();

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

    navigate(`/${role}-dashboard`);
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="lender">Lender</option>
        <option value="referrer">Referrer</option>
        <option value="admin">Admin</option>
      </select>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="button-primary" onClick={login}>
        Login
      </button>
    </div>
  );
}

/* ================= LENDER DASHBOARD ================= */

function LenderDashboard() {
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/applications`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then((r) => r.json())
      .then(setApps);
  }, []);

  return (
    <div className="container">
      <h1>Lender Dashboard</h1>

      {apps.map((a) => (
        <div key={a.id} className="card">
          <p><strong>{a.business_name}</strong></p>
          <p>Status: {a.status}</p>
          <p>Premium: ${Number(a.annual_premium).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

/* ================= REFERRER DASHBOARD ================= */

function ReferrerDashboard() {
  const [commission, setCommission] = useState(0);

  useEffect(() => {
    fetch(`${API}/commission`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    })
      .then((r) => r.json())
      .then((data) => setCommission(Number(data.total)));
  }, []);

  return (
    <div className="container">
      <h1>Referrer Dashboard</h1>

      <div className="card">
        <h3>Total Commission (10%)</h3>
        <h2>${commission.toLocaleString()}</h2>
      </div>
    </div>
  );
}

/* ================= APP ================= */

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/lender-dashboard"
          element={
            <Protected role="lender">
              <LenderDashboard />
            </Protected>
          }
        />

        <Route
          path="/referrer-dashboard"
          element={
            <Protected role="referrer">
              <ReferrerDashboard />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
