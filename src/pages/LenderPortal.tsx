import { useState } from "react";

const STAGES = ["New", "Underwriting", "Risk", "Docs", "Approved", "Quoted", "Bound", "Issued", "Closed"];

export default function LenderPortal() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("bi.lender_key") || "");
  const [otp, setOtp] = useState("");
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ country: "CA", consent_attest: false, consent_pii: false, consent_terms: false });
  const [apps, setApps] = useState<any[]>([]);

  async function login() {
    if (!apiKey || !otp) return;
    localStorage.setItem("bi.lender_key", apiKey);
    setAuthed(true);
  }

  function set(k: string, v: any) { setForm((p) => ({ ...p, [k]: v })); }
  function submit() { setApps((p) => [{ id: `APP-${Date.now()}`, stage: STAGES[0], ...form }, ...p]); }

  if (!authed) return <div className="bi-card lender"><h1>Lender Login</h1><label className="bi-field"><span>API key</span><input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} /></label><label className="bi-field"><span>OTP</span><input value={otp} onChange={(e) => setOtp(e.target.value)} /></label><button className="primary" onClick={login}>Verify & Continue</button></div>;

  return <div className="bi-card lender"><h1>Lender Portal Dashboard</h1><button className="secondary" onClick={() => setAuthed(false)}>Sign out</button>
    <div className="grid md:grid-cols-2 gap-3 mt-4">{["borrower_name","borrower_email","industry","annual_revenue","ebitda","total_debt","monthly_debt_service","loan_amount","guarantee_amount","collateral_value","enterprise_value","years_in_business","owner_credit_score","debt_to_income"].map((f)=><label key={f} className="bi-field"><span>{f.replaceAll("_"," ")}</span><input value={form[f] ?? ""} onChange={(e)=>set(f,e.target.value)} /></label>)}</div>
    <div className="mt-3">{["consent_attest","consent_pii","consent_terms"].map((k)=><label key={k} className="mr-4"><input type="checkbox" checked={!!form[k]} onChange={(e)=>set(k,e.target.checked)} /> {k}</label>)}</div>
    <button className="primary mt-4" onClick={submit}>Submit Application</button>
    <h2 className="mt-6">9-stage Pipeline</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{STAGES.map((st)=><div key={st} className="bi-section"><h3>{st}</h3><ul>{apps.filter((a)=>a.stage===st).map((a)=><li key={a.id}>{a.id}</li>)}</ul></div>)}</div>
  </div>;
}
