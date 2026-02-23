import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
      <div className="logo">Boreal Insurance</div>
      <div className="nav-links">
        <Link to="/">What is PGI</Link>
        <Link to="/claims">Claims</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/apply" className="primary">Apply Now</Link>
        <Link to="/lender-login">Lender Login</Link>
        <Link to="/referrer-login">Referrer Login</Link>
      </div>
    </div>
  );
}
