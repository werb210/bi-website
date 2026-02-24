import { useState, useEffect } from "react";
import BIAuthGate from "../components/BIAuthGate";

export default function ReferrerPortal() {
  const [phone, setPhone] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [form, setForm] = useState({
    company_name: "",
    full_name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (phone) {
      loadProfile();
    }
  }, [phone]);

  async function loadProfile() {
    const res = await fetch(`/api/bi/referrer/profile?phone=${phone}`);
    const data = await res.json();
    setProfile(data.profile);
    setReferrals(data.referrals || []);
  }

  async function requestAgreement() {
    await fetch("/api/bi/referrer/request-agreement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });

    alert("Agreement sent for signing.");
  }

  async function addReferral() {
    await fetch("/api/bi/referrer/add-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, ...form })
    });

    setForm({
      company_name: "",
      full_name: "",
      email: "",
      phone: ""
    });

    loadProfile();
  }

  if (!phone) {
    return <BIAuthGate onVerified={setPhone} />;
  }

  return (
    <div className="application-wrapper">
      <h1>Referrer Portal</h1>

      {!profile?.is_active && (
        <>
          <p>You must sign the referral agreement before submitting referrals.</p>
          <button onClick={requestAgreement}>Sign Agreement</button>
        </>
      )}

      {profile?.is_active && (
        <>
          <h2>Add Referral</h2>

          <input
            placeholder="Company Name"
            value={form.company_name}
            onChange={e => setForm({ ...form, company_name: e.target.value })}
          />

          <input
            placeholder="Full Name"
            value={form.full_name}
            onChange={e => setForm({ ...form, full_name: e.target.value })}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <button onClick={addReferral}>Add To List</button>

          <h2>Your Referrals</h2>
          {referrals.map(r => (
            <div key={r.id} className="crm-card">
              <strong>{r.full_name}</strong>
              <p>{r.company_name}</p>
              <p>Status: {r.status}</p>
              <p>
                {r.application_created
                  ? "Application Submitted"
                  : "No Application Yet"}
              </p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
