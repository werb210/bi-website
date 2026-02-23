import { useState } from "react";
import { z } from "zod";

const Schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  loanAmount: z.number().positive(),
  securedType: z.enum(["secured", "unsecured"]),
  hasBankruptcy: z.boolean(),
  hasExistingPG: z.boolean(),
  existingPGAmount: z.number().optional(),
  hasPreviousClaims: z.boolean()
});

export default function Application() {
  const [form, setForm] = useState<any>({
    directors: [{ name: "", ownership: "" }]
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (k: string, v: any) =>
    setForm((p: any) => ({ ...p, [k]: v }));

  const updateDirector = (index: number, field: string, value: string) => {
    const updated = [...form.directors];
    updated[index][field] = value;
    setForm((p: any) => ({ ...p, directors: updated }));
  };

  const addDirector = () => {
    setForm((p: any) => ({
      ...p,
      directors: [...p.directors, { name: "", ownership: "" }]
    }));
  };

  const submit = async () => {
    try {
      const parsed = Schema.parse({
        ...form,
        loanAmount: Number(form.loanAmount),
        existingPGAmount: form.existingPGAmount
          ? Number(form.existingPGAmount)
          : undefined
      });

      const res = await fetch(
        import.meta.env.VITE_API_BASE + "/api/applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...parsed, directors: form.directors })
        }
      );

      if (!res.ok) throw new Error("Submission failed");
      setSuccess(true);

    } catch (e: any) {
      setError(e.message);
    }
  };

  if (success) {
    return (
      <div className="container">
        <h1>Application Submitted</h1>
        <p>Our underwriting team will review your submission.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Personal Guarantee Insurance Application</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Applicant</h2>
      <input placeholder="First Name" onChange={e => update("firstName", e.target.value)} />
      <input placeholder="Last Name" onChange={e => update("lastName", e.target.value)} />
      <input placeholder="Email" onChange={e => update("email", e.target.value)} />

      <h2>Loan</h2>
      <input placeholder="Loan Amount" onChange={e => update("loanAmount", e.target.value)} />
      <select onChange={e => update("securedType", e.target.value)}>
        <option value="">Select Type</option>
        <option value="secured">Secured</option>
        <option value="unsecured">Unsecured</option>
      </select>

      <h2>Directors</h2>
      {form.directors.map((d: any, i: number) => (
        <div key={i}>
          <input
            placeholder="Director Name"
            value={d.name}
            onChange={e => updateDirector(i, "name", e.target.value)}
          />
          <input
            placeholder="Ownership %"
            value={d.ownership}
            onChange={e => updateDirector(i, "ownership", e.target.value)}
          />
        </div>
      ))}
      <button onClick={addDirector}>Add Director</button>

      <h2>Existing Guarantees</h2>
      <label>
        <input type="checkbox"
          onChange={e => update("hasExistingPG", e.target.checked)} />
        Existing Personal Guarantees?
      </label>

      {form.hasExistingPG && (
        <input
          placeholder="Total Existing PG Exposure"
          onChange={e => update("existingPGAmount", e.target.value)}
        />
      )}

      <h2>Bankruptcy / Insolvency</h2>
      <label>
        <input type="checkbox"
          onChange={e => update("hasBankruptcy", e.target.checked)} />
        Declared bankrupt in past 5 years?
      </label>

      <h2>Previous Claims</h2>
      <label>
        <input type="checkbox"
          onChange={e => update("hasPreviousClaims", e.target.checked)} />
        Previous PGI claims?
      </label>

      <button className="btn" onClick={submit}>Submit Application</button>
    </div>
  );
}
