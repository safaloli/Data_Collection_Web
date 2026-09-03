
import LoginPage from "../pages/auth/LoginPage";
import AuthLayout from "../pages/layout/AuthLayout";

export const authRouter = [
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
            // { path: "reset-password", element: <>I'm reset password page</> },
        ]
    }
]