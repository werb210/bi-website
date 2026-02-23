import { useEffect } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";
import { safeRequest } from "../api/request";
import { useApplicationStore } from "../store/useApplicationStore";

interface Props {
  lenderMode?: boolean;
}

export default function Application({ lenderMode = false }: Props) {
  const nav = useNavigate();
  const store = useApplicationStore();
  const leadId = localStorage.getItem("biLeadId");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    store.setReferral(params.get("ref") || undefined);
    store.setLender(params.get("lender") || undefined);
  }, []);

  useEffect(() => {
    if (lenderMode && store.step < 2) {
      store.setStep(2);
    }
  }, [lenderMode, store.step]);

  async function submit() {
    if (store.submitting) {
      return;
    }

    store.setSubmitting(true);

    try {
      await safeRequest(
        axios.post(`${API_BASE}/application`, {
          leadId,
          personalData: store.personal,
          companyData: store.company,
          guaranteeData: store.guarantee,
          declarations: store.declarations,
          consentData: store.consent,
          quoteResult: store.quote,
          referralCode: store.referralCode,
          lenderId: store.lenderId
        })
      );

      localStorage.removeItem("bi_app");
      store.reset();
      nav("/thank-you");
    } finally {
      store.setSubmitting(false);
    }
  }

  return (
    <div className="container">
      <h1>Personal Guarantee Insurance</h1>

      {!lenderMode && (
        <>
          <p>
            Complete your application to protect your personal assets when backing business borrowing.
          </p>
          {store.quote && (
            <p>
              Estimated premium: <strong>{JSON.stringify(store.quote)}</strong>
            </p>
          )}
        </>
      )}

      {store.step === 1 && !lenderMode && (
        <>
          <h3>Personal Details</h3>
          <input
            placeholder="Full Name"
            onChange={(e) =>
              store.setPersonal({
                ...store.personal,
                name: e.target.value
              })
            }
          />
          <button onClick={() => store.setStep(2)}>Next</button>
        </>
      )}

      {store.step === 2 && (
        <>
          <h3>Company Details</h3>
          <input
            placeholder="Company Name"
            onChange={(e) =>
              store.setCompany({
                ...store.company,
                name: e.target.value
              })
            }
          />
          <button onClick={() => store.setStep(3)}>Next</button>
        </>
      )}

      {store.step === 3 && (
        <>
          <h3>Guarantee Details</h3>
          <input
            placeholder="Guarantee Amount"
            onChange={(e) =>
              store.setGuarantee({
                ...store.guarantee,
                amount: e.target.value
              })
            }
          />
          <button onClick={() => store.setStep(4)}>Next</button>
        </>
      )}

      {store.step === 4 && (
        <>
          <h3>Declarations</h3>
          <label>
            <input
              type="checkbox"
              onChange={(e) =>
                store.setDeclarations({
                  ...store.declarations,
                  bankrupt: e.target.checked
                })
              }
            />
            No bankruptcies
          </label>
          <button onClick={() => store.setStep(5)}>Review</button>
        </>
      )}

      {store.step === 5 && (
        <>
          <h3>Review</h3>
          <pre>{JSON.stringify(store.personal, null, 2)}</pre>
          <button onClick={submit} disabled={store.submitting}>
            {store.submitting ? "Submitting..." : "Submit Application"}
          </button>
        </>
      )}
    </div>
  );
}
