import { useNavigate } from "react-router-dom";

export default function QuoteResult() {
  const nav = useNavigate();

  const quote = JSON.parse(sessionStorage.getItem("quote") || "{}");

  if (!quote || !quote.annualPremium) {
    return (
      <div className="text-white p-6">
        Quote unavailable. Please retry.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-6">
      <h2 className="text-2xl mb-4">Your Quote</h2>

      <div className="bg-gray-900 p-6 rounded-lg max-w-md">
        <p className="text-lg">
          Estimated Annual Premium: ${quote.annualPremium}
        </p>

        <p className="text-sm text-gray-400 mt-2">
          This is an indicative quote. Final pricing subject to underwriting.
        </p>
      </div>

      <button
        onClick={() => nav("/apply")}
        className="mt-6 bg-green-600 px-6 py-3 rounded"
      >
        Proceed to Application
      </button>
    </div>
  );
}
