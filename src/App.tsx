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
      <div>Boreal Insurance</div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/apply">Apply</Link>

        {role && <Link to="/dashboard">Dashboard</Link>}
        {role === "admin" && <Link to="/reports">Reports</Link>}

        {!role && <Link to="/login">Login</Link>}

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

/* ================= HOME ================= */

function Home() {
  return (
    <div className="container">
      <h1>Personal Guarantee Insurance</h1>
      <p>
        Protect your personal assets from business loan default.
      </p>
      <Link to="/apply" className="button-primary">
        Get a Quote
      </Link>
    </div>
  );
}

/* ================= APPLY ================= */

function Apply() {
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const calculate = () => {
    const loan = parseFloat(form.loanAmount || 0);
    const insured = Math.min(loan * 0.8, 1400000);
    const rate = form.loanType === "Secured" ? 0.016 : 0.04;
    return {
      insured,
      premium: insured * rate
    };
  };

  const submit = async () => {
    setLoading(true);
    const { insured, premium } = calculate();

    await fetch(`${API}/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        loanAmount: parseFloat(form.loanAmount),
        insuredAmount: insured,
        annualPremium: premium
      })
    });

    navigate("/success");
  };

  const { insured, premium } = calculate();

  return (
    <div className="container">
      <h1>Application</h1>

      <input
        placeholder="Loan Amount"
        onChange={(e) =>
          setForm({ ...form, loanAmount: e.target.value })
        }
      />

      <select
        onChange={(e) =>
          setForm({ ...form, loanType: e.target.value })
        }
      >
        <option value="Secured">Secured (1.6%)</option>
        <option value="Unsecured">Unsecured (4.0%)</option>
      </select>

      <input
        placeholder="Full Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
      />
      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />
      <input
        placeholder="Business Name"
        onChange={(e) =>
          setForm({ ...form, businessName: e.target.value })
        }
      />

      <div className="quote-box">
        Coverage: ${insured.toLocaleString()}
        <br />
        Premium: ${premium.toLocaleString()}
      </div>

      <button disabled={loading} onClick={submit}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}

/* ================= LOGIN ================= */

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("referrer");

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role })
    });

    const data = await res.json();

    localStorage.setItem("bi_token", data.token);
    localStorage.setItem("bi_role", role);

    navigate("/dashboard");
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="referrer">Referrer</option>
        <option value="lender">Lender</option>
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
            <th>Premium</th>
            <th>Start</th>
            {role === "referrer" && <th>Commission</th>}
          </tr>
        </thead>
        <tbody>
          {policies.map((p) => (
            <tr key={p.id}>
              <td>{p.policy_number}</td>
              <td>${p.annual_premium}</td>
              <td>{p.start_date}</td>
              {role === "referrer" && (
                <td>${p.commission}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= ADMIN REPORTS ================= */

function Reports() {
  const [summary, setSummary] = useState<any>({});
  const [referrers, setReferrers] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/reports/summary`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((r) => r.json())
      .then(setSummary);

    fetch(`${API}/reports/referrers`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((r) => r.json())
      .then(setReferrers);
  }, []);

  const markPaid = async (email: string) => {
    await fetch(`${API}/commission/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ referrer_email: email })
    });

    window.location.reload();
  };

  return (
    <div className="container">
      <h1>Admin Reports</h1>

      <div className="stats">
        <div>
          Total Premium: $
          {parseFloat(summary.total_premium || 0).toLocaleString()}
        </div>
        <div>
          Total Commission: $
          {parseFloat(summary.total_commission || 0).toLocaleString()}
        </div>
      </div>

      <h3>Referrer Ledger</h3>

      <table>
        <thead>
          <tr>
            <th>Referrer</th>
            <th>Total</th>
            <th>Unpaid</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map((r) => (
            <tr key={r.referrer_email}>
              <td>{r.referrer_email}</td>
              <td>${r.total_commission}</td>
              <td>${r.unpaid}</td>
              <td>
                <button
                  onClick={() =>
                    markPaid(r.referrer_email)
                  }
                >
                  Mark Paid
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ================= SUCCESS ================= */

function Success() {
  return (
    <div className="container">
      <h1>Application Submitted</h1>
      <p>We will review your submission.</p>
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
        <Route
          path="/reports"
          element={
            <Protected>
              <Reports />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
