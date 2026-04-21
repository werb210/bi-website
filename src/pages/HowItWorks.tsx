import React from "react";

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6">How does PGI work?</h1>

      <p className="mb-4">
        Personal Guarantee Insurance (PGI) protects Canadian business owners who have signed a personal
        guarantee as part of business financing.
      </p>

      <p className="mb-4">
        When a business cannot repay its loan, lenders can pursue the guarantor personally.
        PGI transfers a portion of that risk to the insurer.
      </p>

      <p className="mb-4">
        If the guarantee is enforced, the policy pays a percentage of the loss—up to 80%,
        with a maximum coverage of $1,000,000.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-4">What can be covered</h2>

      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Secured business loans</li>
        <li>Unsecured business loans</li>
        <li>Equipment financing</li>
        <li>Commercial mortgages</li>
        <li>Lines of credit</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">Why it matters</h2>

      <p>
        PGI allows business owners to access capital while reducing personal financial exposure.
      </p>
    </div>
  );
}
