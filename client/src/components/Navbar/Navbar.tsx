import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/AuthContext";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        User Directory
      </Link>

      {isAuthenticated && user && (
        <div className={styles.userSection}>
          <span className={styles.userName}>Welcome, {user.name}</span>
          <button className={styles.logoutButton} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
