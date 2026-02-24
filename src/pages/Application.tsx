import { useMemo, useState } from "react";
import { useDraft } from "../hooks/useDraft";
import LoadingButton from "../components/LoadingButton";
import { apiPost } from "../lib/api";
import { track } from "../lib/analytics";
import { emailValid, required } from "../lib/validation";

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  loanAmount: "",
  securedType: ""
};

export default function Application() {
  const { state: form, setState: setForm, clearDraft } = useDraft(
    "bi-application-draft",
    initialFormState
  );
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRestoredDraft] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("bi-application-draft"));
  });

  const update = (k: string, v: string) =>
    setForm((p: typeof initialFormState) => ({ ...p, [k]: v }));

  const valid =
    required(form.firstName) &&
    required(form.lastName) &&
    emailValid(form.email) &&
    Number(form.loanAmount) > 0 &&
    required(form.securedType);

  const calc = useMemo(() => {
    const loan = Number(form.loanAmount || 0);
    if (!loan || !form.securedType) return null;

    const insured = Math.min(loan * 0.8, 1400000);
    const rate = form.securedType === "secured" ? 0.016 : 0.04;
    const premium = insured * rate;

    return { insured, premium };
  }, [form.loanAmount, form.securedType]);

  const submit = async () => {
    if (!valid) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const source = localStorage.getItem("bi_source") || "direct";
      const lenderEmail = localStorage.getItem("bi_lender_email");
      const referrerCode = localStorage.getItem("bi_referrer_code");

      await apiPost("/api/pgi-application", {
        ...form,
        loanAmount: Number(form.loanAmount),
        source,
        lenderEmail,
        referrerCode
      });

      track("application_submitted");
      clearDraft();
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container">
        <h1>Application Submitted</h1>
        <p>Our team will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Apply for Personal Guarantee Insurance</h1>

      {hasRestoredDraft && (
        <div className="bg-brand-bgAlt border border-card rounded-lg p-4 mb-6 text-sm">
          Draft restored from previous session.
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="First Name *"
        value={form.firstName}
        onChange={e => update("firstName", e.target.value)}
      />

      <input
        placeholder="Last Name *"
        value={form.lastName}
        onChange={e => update("lastName", e.target.value)}
      />

      <input
        placeholder="Email *"
        value={form.email}
        onChange={e => update("email", e.target.value)}
      />

      <input
        placeholder="Loan Amount (CAD) *"
        value={form.loanAmount}
        onChange={e =>
          update("loanAmount", e.target.value.replace(/[^0-9]/g, ""))
        }
      />

      <select
        value={form.securedType}
        onChange={e => update("securedType", e.target.value)}
      >
        <option value="">Select Loan Type *</option>
        <option value="secured">Secured (1.6%)</option>
        <option value="unsecured">Unsecured (4.0%)</option>
      </select>

      {calc && (
        <div className="premium-box">
          <h3>Estimated Coverage</h3>
          <p>Insured Amount: ${calc.insured.toLocaleString()}</p>
          <p>Annual Premium: ${calc.premium.toLocaleString()}</p>
        </div>
      )}

      <LoadingButton
        className="btn"
        disabled={!valid}
        style={{ opacity: valid ? 1 : 0.5 }}
        loading={loading}
        onClick={submit}
      >
        Submit Application
      </LoadingButton>
    </div>
  );
}
