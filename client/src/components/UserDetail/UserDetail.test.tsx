import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserDetail } from "./UserDetail";

const mockUser = {
  id: 1,
  name: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  address: {
    street: "Main St",
    suite: "Apt 1",
    city: "New York",
    zipcode: "10001",
    geo: {
      lat: "40.7128",
      lng: "-74.0060",
    },
  },
  phone: "123-456-7890",
  website: "johndoe.com",
  company: {
    name: "ABC Inc",
    catchPhrase: "The best company",
    bs: "Make things happen",
  },
};

describe("UserDetail component", () => {
  it("renders user information correctly", () => {
    render(<UserDetail user={mockUser} />);

    // Check personal info
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByText("johndoe")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();

    // Check company info
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("ABC Inc")).toBeInTheDocument();
    expect(screen.getByText("The best company")).toBeInTheDocument();

    // Check address info
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText("Street")).toBeInTheDocument();
    expect(screen.getByText("Main St")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();

    // Check Google Maps link
    const mapLink = screen.getByText("View on Google Maps");
    expect(mapLink).toBeInTheDocument();
    expect(mapLink.getAttribute("href")).toBe(
      "https://www.google.com/maps?q=40.7128,-74.0060"
    );
  });
});
