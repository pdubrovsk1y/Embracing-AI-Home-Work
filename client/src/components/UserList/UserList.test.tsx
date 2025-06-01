import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, beforeEach, test, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserList } from "./UserList";
import * as useUsersHook from "../../hooks/useUsers";

// Mock the useUsers hook
vi.mock("../../hooks/useUsers", () => ({
  useUsers: vi.fn(),
}));

// Sample user data
const mockUsers = [
  {
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
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    email: "jane@example.com",
    address: {
      street: "Broadway",
      suite: "Suite 200",
      city: "Chicago",
      zipcode: "60601",
      geo: {
        lat: "41.8781",
        lng: "-87.6298",
      },
    },
    phone: "555-555-5555",
    website: "janesmith.com",
    company: {
      name: "XYZ Corp",
      catchPhrase: "Innovation first",
      bs: "Leading the industry",
    },
  },
];

// Create a wrapper component with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("UserList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    window.confirm = vi.fn(() => true); // Mock window.confirm to always return true
  });

  test("renders loading state", () => {
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      users: [],
      isLoading: true,
      error: null,
      deleteUser: vi.fn(),
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  test("renders error state", () => {
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      users: [],
      isLoading: false,
      error: new Error("Failed to fetch users"),
      deleteUser: vi.fn(),
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText(/error loading users/i)).toBeInTheDocument();
  });

  test("renders user list", () => {
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      users: mockUsers,
      isLoading: false,
      error: null,
      deleteUser: vi.fn(),
    });

    render(<UserList />, { wrapper: createWrapper() });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Main St, New York")).toBeInTheDocument();
  });

  test("calls deleteUser when delete button is clicked", async () => {
    const deleteUserMock = vi.fn();
    vi.mocked(useUsersHook.useUsers).mockReturnValue({
      users: mockUsers,
      isLoading: false,
      error: null,
      deleteUser: deleteUserMock,
    });

    render(<UserList />, { wrapper: createWrapper() });

    // Click the delete button for the first user
    const deleteButtons = screen.getAllByLabelText("Delete user");
    await userEvent.click(deleteButtons[0]);

    // Confirm that deleteUser was called with the correct user ID
    expect(deleteUserMock).toHaveBeenCalledWith(1);
  });
});
