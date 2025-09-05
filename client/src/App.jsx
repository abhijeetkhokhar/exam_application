import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import StartExam from "./pages/StartExam";
import TakeExam from "./pages/TakeExam";
import Result from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./state/useAuth";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            Exam Module
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const protectedRoutes = [
    { path: "/", element: <StartExam /> },
    { path: "/take-exam", element: <TakeExam /> },
    { path: "/result", element: <Result /> },
  ];

  const publicRoutes = [
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route, index) => (
              <Route
                key={`public-${index}`}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Protected Routes */}
            {protectedRoutes.map((route, index) => (
              <Route
                key={`protected-${index}`}
                path={route.path}
                element={<ProtectedRoute>{route.element}</ProtectedRoute>}
              />
            ))}

            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <StartExam />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-2">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LeadMaster AI. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
