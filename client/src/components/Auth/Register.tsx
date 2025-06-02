import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/AuthContext";
import styles from "./Login.module.css";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register = ({ onSwitchToLogin }: RegisterProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const { register, isLoading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to UserList if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      const response = await register({ name, email, password });
      setMessage(response.message || "Registration successful! Please log in.");
      // Reset form after successful registration
      setName("");
      setEmail("");
      setPassword("");

      // Optionally auto-switch to login after a delay
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch {
      // Error is handled by the auth context
    }
  };

  return (
    <form className={styles.authForm} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Register</h2>

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {message && <div className={styles.success}>{message}</div>}

      <button
        type="submit"
        className={styles.button}
        disabled={isLoading || !name || !email || !password}
      >
        {isLoading ? "Registering..." : "Register"}
      </button>

      <div className={styles.switchText}>
        Already have an account?{" "}
        <span className={styles.switchLink} onClick={onSwitchToLogin}>
          Log In
        </span>
      </div>
    </form>
  );
};
