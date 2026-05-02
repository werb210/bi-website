import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { CoreBadge } from "../components/CoreBadge";
import { Section } from "../components/Section";
import { UploadAndScrape } from "../components/UploadAndScrape";

type State = Record<string, any>;

const SECTION_FIELDS: Array<{ title: string; fields: string[] }> = [
  { title: "Personal Guarantor", fields: ["guarantor_name", "guarantor_dob", "guarantor_address", "guarantor_email", "guarantor_phone"] },
  { title: "Business", fields: ["country", "business_name", "business_address", "business_website", "entity_type", "business_number", "naics_code", "formation_date"] },
  { title: "Loan", fields: ["loan_amount", "csbfp_backed", "loan_has_guaranteed_cap", "pgi_limit", "lender_name", "loan_funding_date", "loan_purpose", "personally_guaranteeing", "has_other_guarantors", "policy_start_date"] },
  { title: "Financial", fields: ["annual_revenue", "ebitda", "total_debt", "monthly_debt_service", "collateral_value", "enterprise_value"] },
  { title: "Risk", fields: ["payables_threatening", "upcoming_adverse_events", "bankruptcy_history", "insolvency_history", "personal_investigations", "business_investigations", "property_insurance_in_force", "personal_judgments", "business_judgments"] },
  { title: "Consents", fields: ["electronic_signature", "info_accurate", "business_solvent", "no_undisclosed_events", "data_use", "credit_pull", "coverage_understood"] },
];

export default function Application() {
  const { publicId } = useParams<{ publicId: string }>();
  const nav = useNavigate();
  const [s, setS] = useState<State>({ consents: {} });
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api.getApp(publicId!).then((r) => {
      if (r.application.score_decision !== "approve") {
        nav("/");
        return;
      }
      setS({ consents: {}, ...r.application });
      setLoaded(true);
    });
  }, [nav, publicId]);

  const answered = useMemo(() => SECTION_FIELDS.reduce((sum, sec) => sum + sec.fields.filter((f) => (sec.title === "Consents" ? !!s.consents?.[f] : s[f] !== undefined && s[f] !== null && s[f] !== "")).length, 0), [s]);

  async function saveDraft() {
    setBusy(true); setErr(null);
    try { await api.patchApp(publicId!, s); } catch (ex: any) { setErr(ex.message ?? "Save failed"); } finally { setBusy(false); }
  }
  async function submit() {
    setBusy(true); setErr(null);
    try { await api.patchApp(publicId!, s); await api.submit(publicId!); nav(`/applications/${publicId}/thanks`); } catch (ex: any) { setErr(ex.data?.fields?.length ? `Missing: ${ex.data.fields.join(", ")}` : ex.message ?? "Could not submit"); } finally { setBusy(false); }
  }

  if (!loaded) return <div className="bi-card">Loading…</div>;

  return <div className="bi-app-wrap">
    <div className="bi-card">
      <div className="flex items-center justify-between gap-3"><h1>Application Form</h1><CoreBadge decision={s.score_decision} score={s.score} /></div>
      <p>{answered}/45 answered</p>
      <UploadAndScrape publicId={publicId!} onApply={(merged) => setS((p: State) => ({ ...p, ...merged }))} />
      {err && <div className="form-error">{err}</div>}
      {SECTION_FIELDS.map((sec) => <Section key={sec.title} title={sec.title} answered={sec.fields.filter((f) => sec.title === "Consents" ? !!s.consents?.[f] : !!s[f]).length} total={sec.fields.length} defaultOpen>
        <div className="grid gap-3 md:grid-cols-2">
          {sec.fields.map((f) => sec.title === "Consents" ? <label key={f}><input type="checkbox" checked={!!s.consents?.[f]} onChange={(e) => setS((p: State) => ({ ...p, consents: { ...(p.consents || {}), [f]: e.target.checked } }))} /> {f.replaceAll("_", " ")}</label> : <label key={f} className="bi-field"><span>{f.replaceAll("_", " ")}</span><input value={s[f] ?? ""} onChange={(e) => setS((p: State) => ({ ...p, [f]: e.target.value }))} /></label>)}
        </div>
      </Section>)}
      <div className="mt-6 flex gap-3"><button className="secondary" disabled={busy} onClick={saveDraft}>Save Draft</button><button className="primary" disabled={busy} onClick={submit}>{busy ? "Submitting…" : "Submit"}</button></div>
    </div>
  </div>;
}
