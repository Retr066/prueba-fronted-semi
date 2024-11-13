import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/home/page";
import LoginPage from "./pages/Login/page";
import RegisterPage from "./pages/Register/page";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Navbar from "./Layout/components/navbar";
import AdminPage from "./pages/admin/page";
import AdminRoute from "./components/AdminRoute";

const router = createBrowserRouter([
    {
        path: "/home",
        element: (
            <PrivateRoute>
                <>
                    <Navbar />
                    <Home />
                </>
            </PrivateRoute>
        )
    },{
        path: "/admin",
        element: (
            <PrivateRoute>
                <AdminRoute>
                    <>
                    <Navbar />
                    <AdminPage />
                    </>
                </AdminRoute>
            </PrivateRoute>
        )
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        path: "/register",
        element: (
            <PublicRoute>
                <RegisterPage />
            </PublicRoute>
        )
    },
    {
        path: "*",
        element: <Navigate to="/home" />,
        ErrorBoundary: () => <h1>Not Found</h1>
    }
]


)

export default router;
