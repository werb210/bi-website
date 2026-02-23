export default function Application() {
  return (
    <div className="container">
      <h1>Personal Guarantee Insurance Application</h1>

      <form className="form">

        <h2>Applicant Details</h2>
        <input placeholder="Full Legal Name" />
        <input placeholder="Date of Birth" />
        <input placeholder="Home Address" />
        <input placeholder="Email" />
        <input placeholder="Phone Number" />

        <h2>Business Details</h2>
        <input placeholder="Company Name" />
        <input placeholder="Incorporation Number" />
        <input placeholder="Registered Address" />
        <input placeholder="Trading Address" />
        <input placeholder="Years Trading" />
        <input placeholder="Industry" />
        <input placeholder="Website" />

        <h2>Loan Details</h2>
        <input placeholder="Lender Name" />
        <input placeholder="Type of Facility" />
        <input placeholder="Secured or Unsecured" />
        <input placeholder="Loan Amount" />
        <input placeholder="Personal Guarantee Amount" />
        <input placeholder="Term of Loan" />
        <input placeholder="Security Provided" />

        <h2>Financial Information</h2>
        <input placeholder="Annual Turnover" />
        <input placeholder="Net Profit" />
        <input placeholder="Total Assets" />
        <input placeholder="Total Liabilities" />

        <h2>Declaration</h2>
        <textarea placeholder="Disclosure of insolvency, previous claims, or director status issues"></textarea>

        <button type="submit" className="btn">Submit Application</button>
      </form>

      <footer>
        © Boreal Insurance — Canada
      </footer>
    </div>
  );
}
