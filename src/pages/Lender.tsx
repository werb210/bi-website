import { Link, Route, Routes } from "react-router-dom";

function Dashboard() {
  return (
    <section>
      <h2 className="mb-2 text-2xl font-semibold">Lender Dashboard</h2>
      <p className="mb-6 text-white/80">Select a workflow to continue.</p>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link to="quote" className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
          Quote
        </Link>
        <Link to="application" className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
          Application
        </Link>
        <Link to="pipeline" className="rounded bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700">
          Pipeline
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded border border-white/10 bg-white/5 p-4">Live quote intake</div>
        <div className="rounded border border-white/10 bg-white/5 p-4">Application progress tracking</div>
        <div className="rounded border border-white/10 bg-white/5 p-4">Pipeline visibility by lender</div>
      </div>
    </section>
  );
}

function Pipeline() {
  return <div className="rounded border border-white/10 bg-white/5 p-4">Pipeline (filtered to lender only)</div>;
}

function Quote() {
  return <div className="rounded border border-white/10 bg-white/5 p-4">Quote Tool</div>;
}

function Application() {
  return <div className="rounded border border-white/10 bg-white/5 p-4">Application Form</div>;
}

export default function Lender() {
  return (
    <main className="min-h-screen bg-[#07182E] p-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="quote" element={<Quote />} />
          <Route path="application" element={<Application />} />
          <Route path="pipeline" element={<Pipeline />} />
        </Routes>
      </div>
    </main>
  );
}
