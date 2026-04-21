import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "https://server.boreal.financial";

export default function Quote() {
  const nav = useNavigate();

  const [amount, setAmount] = useState(500000);
  const [type, setType] = useState("secured");

  const handleSubmit = async () => {
    const res = await fetch(`${API_URL}/api/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loanAmount: amount,
        loanType: type,
        coverage: 0.8,
        termMonths: 60,
      }),
    });

    const data = await res.json();

    sessionStorage.setItem("quote", JSON.stringify(data));

    nav("/quote/result");
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <h2 className="text-2xl mb-6">Get a Quote</h2>

      <div className="space-y-4 max-w-md">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded bg-gray-800"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded bg-gray-800"
        >
          <option value="secured">Secured</option>
          <option value="unsecured">Unsecured</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 w-full py-3 rounded"
        >
          Calculate Quote
        </button>
      </div>
    </div>
  );
}
