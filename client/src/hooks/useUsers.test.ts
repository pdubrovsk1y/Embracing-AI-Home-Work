import { renderHook, act } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsers } from "./useUsers";
import * as userApi from "../api/userApi";

// Mock the API
vi.mock("../api/userApi", () => ({
  fetchUsers: vi.fn(),
}));

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

// Create a wrapper with QueryClientProvider
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

describe("useUsers hook", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("should return users data from API", async () => {
    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    // Wait for the data to load
    await vi.waitFor(() => {
      expect(result.current.users.length).toBe(2);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.users).toEqual(mockUsers);
  });

  test("should delete a user", async () => {
    vi.mocked(userApi.fetchUsers).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: createWrapper(),
    });

    // Wait for the data to load
    await vi.waitFor(() => {
      expect(result.current.users.length).toBe(2);
    });

    // Delete a user
    act(() => {
      result.current.deleteUser(1);
    });

    // Check that the user was deleted
    expect(result.current.users.length).toBe(1);
    expect(result.current.users[0].id).toBe(2);
  });
});
