// BI_WEBSITE_BLOCK_v82 — pinned smoke render to catch any regression
// in the header/footer reskin. Asserts brand wordmark + cross-link
// to boreal.financial render, both header and footer.
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

describe("Header (v82)", () => {
  it("renders the BI wordmark and the BF cross-link", () => {
    const { getAllByText, container } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(getAllByText("Boreal Insurance").length).toBeGreaterThan(0);
    const bfLink = container.querySelector('a[href="https://boreal.financial"]');
    expect(bfLink).not.toBeNull();
  });

  it("shows Apply Now CTA when not signed in", () => {
    const { getAllByText } = render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(getAllByText("Apply Now").length).toBeGreaterThan(0);
  });
});

describe("Footer (v82)", () => {
  it("renders the three-column structure with BF cross-link", () => {
    const { getByText, container } = render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(getByText("Boreal Insurance")).toBeTruthy();
    expect(getByText("Explore")).toBeTruthy();
    expect(getByText("Sign In")).toBeTruthy();
    const bfLink = container.querySelector('a[href="https://boreal.financial"]');
    expect(bfLink).not.toBeNull();
  });
});
