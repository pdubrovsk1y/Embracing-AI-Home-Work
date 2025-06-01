import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, deleteUser as apiDeleteUser } from "../api/userApi";
import type { User } from "../types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Set up delete mutation
  const deleteMutation = useMutation({
    mutationFn: apiDeleteUser,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteUser = useCallback(
    (id: number) => {
      // First update UI optimistically
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

      // Then make the API call
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  return {
    users,
    isLoading,
    error,
    deleteUser,
  };
};
