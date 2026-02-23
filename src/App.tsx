import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="nav">
      <h2>Boreal Insurance</h2>
      <div className="nav-links">
        <Link to="/what-is-pgi">What is PGI</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/apply" className="button-primary">Apply Now</Link>
      </div>
    </div>
  );
}

function Home() {
  return (
    <>
      <div className="hero">
        <div>
          <h1>Personal Guarantee Insurance</h1>
          <p>
            Protect your personal assets when guaranteeing business loans.
            Designed for Canadian business owners and directors.
          </p>
          <Link to="/apply" className="button-primary">Get Protected</Link>
        </div>
        <img src="https://images.unsplash.com/photo-1605902711622-cfb43c4437d1" />
      </div>

      <div className="section">
        <div className="container">
          <h2>Why It Matters</h2>
          <div className="grid">
            <div className="card">
              <h3>Protect Your Home</h3>
              <p>
                Most business loans require a personal guarantee.
                If the business fails, your home and savings are exposed.
              </p>
            </div>
            <div className="card">
              <h3>Support from Day One</h3>
              <p>
                Legal assistance and negotiated settlements if a claim occurs.
              </p>
            </div>
            <div className="card">
              <h3>Peace of Mind</h3>
              <p>
                Focus on growing your business knowing your family assets are protected.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section section-light">
        <div className="container">
          <h2>Real Example</h2>
          <p>
            A Calgary manufacturing company borrowed $500,000.
            Market disruption forced closure.
            Without insurance, the director would have faced personal bankruptcy.
            With PGI, legal defense and negotiated settlement reduced exposure by over 60%.
          </p>
        </div>
      </div>
    </>
  );
}

function WhatIsPGI() {
  return (
    <div className="container">
      <h1>What is Personal Guarantee Insurance?</h1>
      <p>
        When business loans require directors to personally guarantee repayment,
        those individuals become personally liable if the company defaults.
      </p>
      <p>
        Personal Guarantee Insurance provides protection, legal support,
        and negotiated settlements to reduce personal exposure.
      </p>
    </div>
  );
}

function Claims() {
  return (
    <div className="container">
      <h1>Claims</h1>
      <p>
        If a lender calls on your personal guarantee, notify us immediately.
        We coordinate legal defence and work toward negotiated settlements.
      </p>
    </div>
  );
}

function Resources() {
  return (
    <div className="container">
      <h1>Resources</h1>
      <p>Case studies, guides, and educational materials coming soon.</p>
    </div>
  );
}

function Contact() {
  return (
    <div className="container">
      <h1>Contact Us</h1>
      <form>
        <input placeholder="Full Name" />
        <input placeholder="Email" />
        <textarea placeholder="Message"></textarea>
        <button className="button-primary">Send Message</button>
      </form>
    </div>
  );
}

function Apply() {
  return (
    <div className="container">
      <h1>Apply for Coverage</h1>
      <p>
        Complete the short application to receive a quote.
      </p>
    </div>
  );
}

function LenderLogin() {
  return (
    <div className="container">
      <h1>Lender Login</h1>
      <p>Secure portal access for lending partners.</p>
    </div>
  );
}

function ReferrerLogin() {
  return (
    <div className="container">
      <h1>Referrer Login</h1>
      <p>Track referred client applications.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/what-is-pgi" element={<WhatIsPGI />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/lender-login" element={<LenderLogin />} />
        <Route path="/referrer-login" element={<ReferrerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}
