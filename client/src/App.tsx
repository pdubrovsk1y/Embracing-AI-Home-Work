import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserList } from "./components/UserList";
import { Auth } from "./components/Auth";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./hooks/auth/AuthContext";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <main className="app-content">
              <Routes>
                <Route path="/login" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <footer className="app-footer">
              <p>© {new Date().getFullYear()} User Directory App</p>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
