import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Layout from "./components/Layout.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import OrdersAdminPage from "./pages/OrdersAdminPage.tsx";
import UserProfilePage from "./pages/UserProfilePage.tsx";
import UserBasketPage from "./pages/UserBasketPage.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/auth/signin",
    element: <SignInPage />,
  },
  {
    path: "/auth/signup",
    element: <SignUpPage />,
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedRoute>
        <OrdersAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/me",
    element: (
      <ProtectedRoute>
        <UserProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/me/busket",
    element: (
      <ProtectedRoute>
        <UserBasketPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Layout>
          <RouterProvider router={router} />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
