import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import {ThemeProvider} from "./components/theme-provider.tsx";
import Layout from "./components/Layout.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <HomePage/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/auth/signin",
        element: <SignInPage/>,
    },
    {
        path: "/auth/signup",
        element: <SignUpPage/>,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <AuthProvider>
              <Layout>
                  <RouterProvider router={router}/>
              </Layout>
          </AuthProvider>
      </ThemeProvider>
  </React.StrictMode>
);
