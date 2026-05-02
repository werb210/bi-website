import { useMemo, useState } from "react";

const STAGES = ["New", "Underwriting", "Risk", "Docs", "Approved", "Quoted", "Bound", "Issued", "Closed"];

export default function ReferrerPortal() {
  const [stage, setStage] = useState<"otp"|"verify"|"intake"|"dashboard">("otp");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [profile, setProfile] = useState<Record<string,string>>({});
  const [popup, setPopup] = useState(false);
  const [draft, setDraft] = useState({ name: "", company: "", email: "", mobile: "", stage: "New" });
  const [items, setItems] = useState<any[]>([]);

  const mine = useMemo(()=>items.filter((i)=>i.referrer===phone),[items,phone]);

  if (stage === "otp") return <div className="bi-card"><h1>Referrer Login</h1><input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone" /><button onClick={()=>setStage("verify")}>Send OTP</button></div>;
  if (stage === "verify") return <div className="bi-card"><h1>Verify OTP</h1><input value={code} onChange={(e)=>setCode(e.target.value)} /><button onClick={()=>setStage("intake")}>Verify</button></div>;
  if (stage === "intake") return <div className="bi-card"><h1>First-time Intake</h1>{["legal_name","business_name","email","phone","etransfer_email","license","province","city","postal_code","address"].map((k)=><label key={k} className="bi-field"><span>{k}</span><input value={profile[k]||""} onChange={(e)=>setProfile(p=>({...p,[k]:e.target.value}))} /></label>)}<button className="primary" onClick={()=>setStage("dashboard")}>Continue</button></div>;

  return <div className="bi-card"><h1>Referrer Dashboard</h1><button onClick={()=>setPopup(true)}>+ Add Referral</button>
    {popup && <div className="bi-scrape-modal"><h3>Add Referral</h3>{["name","company","email","mobile"].map((k)=><input key={k} placeholder={k} value={(draft as any)[k]} onChange={(e)=>setDraft((p)=>({...p,[k]:e.target.value}))} />)}<div><button onClick={()=>{setItems(p=>[...p,{...draft,referrer:phone,id:Date.now()}]); setPopup(false);}}>Save</button><button onClick={()=>{setItems(p=>[...p,{...draft,referrer:phone,id:Date.now()}]); setDraft({ name:"",company:"",email:"",mobile:"",stage:"New"});}}>Save & Next</button></div></div>}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">{STAGES.map((st)=><div key={st} className="bi-section"><h3>{st}</h3><ul>{mine.filter((m)=>m.stage===st).map((m)=><li key={m.id}>{m.name} · {m.company}</li>)}</ul></div>)}</div>
  </div>;
}
