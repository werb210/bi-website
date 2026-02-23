import { FormEvent, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config";
import { safeRequest } from "../api/request";

export default function PolicyLookup() {
  const [email, setEmail] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [result, setResult] = useState<unknown>(null);

  async function handleLookup(event: FormEvent) {
    event.preventDefault();

    const data = await safeRequest(
      axios.post(`${API_BASE}/policy/lookup`, {
        email,
        policyNumber
      })
    );

    setResult(data);
  }

  return (
    <div className="container">
      <h1>Policy Status Lookup</h1>
      <form onSubmit={handleLookup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Policy Number"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
          required
        />
        <button type="submit">Lookup</button>
      </form>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}
