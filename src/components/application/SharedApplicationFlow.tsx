import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../../lib/api";

type ApplicationFlowStep = "application" | "documents" | "signature";

type ApplicationData = {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  loanAmount: number;
  facilityType: "secured" | "unsecured";
  registrationNumber: string;
  industry: string;
  lender: string;
  referrerId: string;
  incorporationDate: string;
  addressLine1: string;
  city: string;
  province: string;
  postalCode: string;
};

type ApplicationState = {
  applicationId?: string;
  data: ApplicationData;
  documentsDeferred: boolean;
  documents: {
    financialStatements?: File | null;
    bankStatements?: File | null;
    governmentId?: File | null;
  };
  signature: string;
  consentAccepted: boolean;
  bankruptcy: boolean;
};

const initialData: ApplicationData = {
  companyName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  loanAmount: 0,
  facilityType: "secured",
  registrationNumber: "",
  industry: "",
  lender: "",
  referrerId: "",
  incorporationDate: "",
  addressLine1: "",
  city: "",
  province: "",
  postalCode: "",
};

const STORAGE_KEY = "bi_application_flow";

const safeParse = (raw: string | null): ApplicationState | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ApplicationState;
    return {
      ...parsed,
      documents: parsed.documents || {},
      data: {
        ...initialData,
        ...(parsed.data || {}),
      },
      bankruptcy: Boolean(parsed.bankruptcy),
    };
  } catch {
    return null;
  }
};

export default function SharedApplicationFlow({
  step,
  lenderMode,
}: {
  step: ApplicationFlowStep;
  lenderMode: boolean;
}) {
  const navigate = useNavigate();
  const lenderPathPrefix = lenderMode ? "/lender" : "";

  const [state, setState] = useState<ApplicationState>(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;

    return {
      data: {
        ...initialData,
        lender: lenderMode ? "Lender Portal" : "",
      },
      documentsDeferred: false,
      documents: {},
      signature: "",
      consentAccepted: false,
      bankruptcy: false,
    };
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const saveState = (next: ApplicationState) => {
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const updateData = (key: keyof ApplicationData, value: string | number) => {
    saveState({
      ...state,
      data: {
        ...state.data,
        [key]: value,
      },
    });
  };

  const requiredFieldsComplete = useMemo(() => {
    const d = state.data;
    return Boolean(d.companyName && d.firstName && d.lastName && d.email && d.phone && d.loanAmount > 0 && d.registrationNumber && d.industry);
  }, [state.data]);

  const goDocuments = (event: FormEvent) => {
    event.preventDefault();
    if (!requiredFieldsComplete) {
      alert("Please complete all required fields before continuing.");
      return;
    }

    navigate(`${lenderPathPrefix}/application/documents`);
  };

  const uploadDocuments = async () => {
    if (!state.applicationId) {
      alert("Save your draft first to upload documents.");
      return;
    }

    const files = Object.values(state.documents).filter(Boolean) as File[];
    if (files.length === 0) {
      continueToSignature();
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    try {
      await apiPost(`/api/v1/bi/application/${state.applicationId}/documents`, formData, { credentials: "include" });
      continueToSignature();
    } catch (error) {
      console.error(error);
      alert("Unable to upload documents. Please re-upload and try again.");
    } finally {
      setUploading(false);
    }
  };

  const continueToSignature = () => navigate(`${lenderPathPrefix}/application/signature`);

  const submit = async () => {
    if (!state.signature.trim() || !state.consentAccepted) {
      alert("Please provide your typed signature and consent.");
      return;
    }

    setSubmitting(true);
    try {
      await apiPost("/api/v1/bi/application/submit", {
        applicationId: state.applicationId,
        facilityType: state.data.facilityType,
        loanAmount: state.data.loanAmount,
        bankruptcy: state.bankruptcy,
      }, {
        credentials: "include",
      });

      localStorage.removeItem(STORAGE_KEY);
      alert("Application submitted.");
    } catch (error) {
      console.error(error);
      alert("Unable to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "application") {
    return <main className="min-h-screen bg-[#07182E] px-6 py-10 text-white"><div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/5 p-6 md:p-8"><h1 className="mb-6 text-3xl font-bold">Application</h1><form className="grid gap-4 md:grid-cols-2" onSubmit={goDocuments}><input className="input" placeholder="Company Name*" value={state.data.companyName} onChange={(e) => updateData("companyName", e.target.value)} /><input className="input" placeholder="First Name*" value={state.data.firstName} onChange={(e) => updateData("firstName", e.target.value)} /><input className="input" placeholder="Last Name*" value={state.data.lastName} onChange={(e) => updateData("lastName", e.target.value)} /><input className="input" type="email" placeholder="Email*" value={state.data.email} onChange={(e) => updateData("email", e.target.value)} /><input className="input" placeholder="Phone*" value={state.data.phone} onChange={(e) => updateData("phone", e.target.value)} /><input className="input" type="number" placeholder="Loan Amount*" value={state.data.loanAmount || ""} onChange={(e) => updateData("loanAmount", Number(e.target.value) || 0)} /><select className="input" value={state.data.facilityType} onChange={(e) => updateData("facilityType", e.target.value)}><option value="secured">Secured</option><option value="unsecured">Unsecured</option></select><input className="input" placeholder="Registration Number*" value={state.data.registrationNumber} onChange={(e) => updateData("registrationNumber", e.target.value)} /><input className="input" placeholder="Industry*" value={state.data.industry} onChange={(e) => updateData("industry", e.target.value)} /><input className="input" type="date" placeholder="Incorporation Date" value={state.data.incorporationDate} onChange={(e) => updateData("incorporationDate", e.target.value)} /><input className="input" placeholder="Address Line 1" value={state.data.addressLine1} onChange={(e) => updateData("addressLine1", e.target.value)} /><input className="input" placeholder="City" value={state.data.city} onChange={(e) => updateData("city", e.target.value)} /><input className="input" placeholder="Province" value={state.data.province} onChange={(e) => updateData("province", e.target.value)} /><input className="input" placeholder="Postal Code" value={state.data.postalCode} onChange={(e) => updateData("postalCode", e.target.value)} /><button type="submit" className="rounded bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-700 md:col-span-2">Continue to Documents</button></form></div></main>;
  }

  if (step === "documents") {
    return (
      <main className="min-h-screen bg-[#07182E] px-6 py-10 text-white">
        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h1 className="mb-6 text-3xl font-bold">Required Documents</h1>
          <p className="mb-4 text-white/80">Upload now (you can re-upload before submit).</p>

          <div className="grid gap-4">
            <label className="text-sm">Financial Statements*</label>
            <input type="file" onChange={(e) => saveState({ ...state, documentsDeferred: false, documents: { ...state.documents, financialStatements: e.target.files?.[0] || null } })} />
            <label className="text-sm">Bank Statements*</label>
            <input type="file" onChange={(e) => saveState({ ...state, documentsDeferred: false, documents: { ...state.documents, bankStatements: e.target.files?.[0] || null } })} />
            <label className="text-sm">Government ID*</label>
            <input type="file" onChange={(e) => saveState({ ...state, documentsDeferred: false, documents: { ...state.documents, governmentId: e.target.files?.[0] || null } })} />
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <button className="rounded bg-blue-600 py-3 font-semibold hover:bg-blue-700" onClick={uploadDocuments} disabled={uploading}>
              {uploading ? "Uploading..." : "Upload & Continue"}
            </button>
            <button className="rounded bg-slate-700 py-3 font-semibold hover:bg-slate-600" onClick={continueToSignature}>
              Continue Without Uploading
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07182E] px-6 py-10 text-white">
      <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h1 className="mb-4 text-3xl font-bold">Terms & Conditions + Signature</h1>
        <label className="mb-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={state.bankruptcy} onChange={(e) => saveState({ ...state, bankruptcy: e.target.checked })} />Bankruptcy filed?</label>
        <input className="input mb-4" placeholder="Type your full name" value={state.signature} onChange={(e) => saveState({ ...state, signature: e.target.value })} />
        <label className="mb-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={state.consentAccepted} onChange={(e) => saveState({ ...state, consentAccepted: e.target.checked })} />I consent to electronic signature and agree to the Terms & Conditions.</label>
        <button className="w-full rounded bg-emerald-600 py-3 font-semibold hover:bg-emerald-700 disabled:opacity-60" onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Submit Application"}</button>
      </div>
    </main>
  );
}
