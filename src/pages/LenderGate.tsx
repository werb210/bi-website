import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const LENDER_PASSWORD = import.meta.env.VITE_LENDER_GATE_PASSWORD || "boreal-lender";

export default function LenderGate() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (password === LENDER_PASSWORD) {
      setError("");
      nav(`/lender/apply${window.location.search}`);
      return;
    }

    setError("Incorrect password.");
  }

  return (
    <div className="container">
      <h1>Lender Access</h1>
      <p>Enter the temporary lender password to continue.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Continue</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
