import { render, screen } from "@testing-library/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LenderPortal from "../pages/LenderPortal";

describe("BI_WEBSITE_BLOCK_v98_BRANDING_v1", () => {
  it("Header shows 'Boreal Risk Management' brand name", () => {
    render(<Header />);
    expect(screen.getByText("Boreal Risk Management")).toBeInTheDocument();
  });

  it("Header does NOT contain a standalone 'Apply' text link", () => {
    render(<Header />);
    // There should still be an "Apply Now" button, but no plain "Apply" link
    expect(screen.queryByRole("link", { name: /^Apply$/ })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Apply Now/ })).toBeInTheDocument();
  });

  it("Footer uses info@boreal.financial, not hello@", () => {
    render(<Footer />);
    expect(screen.getByText(/info@boreal\.financial/)).toBeInTheDocument();
    expect(screen.queryByText(/hello@boreal\.financial/)).not.toBeInTheDocument();
  });

  it("Footer legal paragraph references info@, not hello@", () => {
    const { container } = render(<Footer />);
    const text = container.textContent || "";
    expect(text).toContain("Questions about this referral service: info@boreal.financial");
    expect(text).not.toContain("hello@boreal.financial");
  });

  it("LenderPortal restores the 'Try Demo App' button", () => {
    render(<LenderPortal />);
    expect(screen.getByRole("button", { name: /Try Demo App/i })).toBeInTheDocument();
  });
});
