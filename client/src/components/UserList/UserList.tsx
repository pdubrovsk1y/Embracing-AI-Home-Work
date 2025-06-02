import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { UserDetail } from "../UserDetail";
import { Modal } from "../Modal";
import type { User } from "../../types/user";
import styles from "./UserList.module.css";

export const UserList = () => {
  const { users, isLoading, error, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteUser = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(id);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>
          Error loading users:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Directory</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th>Name / Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className={styles.tableRow}
                onClick={() => handleUserClick(user)}
              >
                <td>
                  <div>
                    <strong>{user.name}</strong>
                  </div>
                  <div>{user.email}</div>
                </td>
                <td>{`${user.address.street}, ${user.address.city}`}</td>
                <td>{user.phone}</td>
                <td>{user.website}</td>
                <td>{user.company.name}</td>
                <td className={styles.actions}>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={(e) => handleDeleteUser(e, user.id)}
                    aria-label="Delete user"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedUser.name}
        >
          <UserDetail user={selectedUser} />
        </Modal>
      )}
    </div>
  );
};
