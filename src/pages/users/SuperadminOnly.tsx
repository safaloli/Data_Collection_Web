import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SuperadminOnly({ children }: Readonly<{ children: ReactNode }>) {
    const { loggedInUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser && loggedInUser.role !== "superadmin") {
            navigate("/", { replace: true });
        }
    }, [loggedInUser, navigate]);

    if (loggedInUser?.role !== "superadmin") return null;
    return children;
}
