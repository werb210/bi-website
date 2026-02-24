export default function Home() {
  return (
    <div>

      {/* HERO */}
      <section
        style={{
          backgroundImage: "url('/hero-business.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "140px 20px",
          textAlign: "center",
          color: "white"
        }}
      >
        <div style={{ background: "rgba(0,0,0,0.65)", padding: 40 }}>
          <h1 style={{ fontSize: 42 }}>Protect What You’ve Built</h1>
          <p style={{ fontSize: 20, maxWidth: 700, margin: "20px auto" }}>
            Personal Guarantee Insurance protects directors and business owners
            when lenders enforce personal guarantees on business debt.
          </p>
          <a href="/apply" className="btn-primary">Apply Now</a>
        </div>
      </section>

      {/* WHAT IS PGI */}
      <section className="content-section">
        <h2>What is Personal Guarantee Insurance?</h2>
        <p>
          Personal Guarantee Insurance (PGI) covers up to 80% of an enforced
          personal guarantee where a business loan defaults and the lender
          pursues the guarantor personally.
        </p>
        <p>
          We insure both secured and unsecured liabilities.
        </p>
        <p style={{ marginTop: 20, fontWeight: 600 }}>
          Claims must be initiated prior to the commencement of any bankruptcy
          or insolvency proceedings.
        </p>
      </section>

      {/* CASE STUDIES */}
      <section className="content-section">
        <h2>Real Protection. Real Scenarios.</h2>

        <div className="case-grid">
          <div>
            <h3>Construction Firm</h3>
            <p>
              $1.2M secured loan. Lender enforced personal guarantee following
              downturn. Policy covered 80% of exposure.
            </p>
          </div>

          <div>
            <h3>Franchise Operator</h3>
            <p>
              $750k unsecured facility. Guarantee enforced after closure.
              Claim submitted prior to insolvency filing and paid.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
