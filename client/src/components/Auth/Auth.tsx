import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/AuthContext";
import { Login } from "./Login";
import { Register } from "./Register";

export const Auth = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to UserList if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const switchToRegister = () => {
    setIsLoginView(false);
  };

  const switchToLogin = () => {
    setIsLoginView(true);
  };

  return (
    <div>
      {isLoginView ? (
        <Login onSwitchToRegister={switchToRegister} />
      ) : (
        <Register onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};
