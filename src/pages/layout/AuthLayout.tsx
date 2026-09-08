import { Outlet, useNavigate } from "react-router-dom";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function AuthLayout() {
    const { loggedInUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        console.log("User", loggedInUser?.role)

        if (loggedInUser) {

            // already logged in 
            navigate("/", {replace: true})
        }
    }, [loggedInUser, navigate])
    return (<>
        <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col">
            {/* TopNavBar - Rendered based on JSON guidance for EduPremium/EduSynth Context */}
            <AuthHeader />

            <main className="grow flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">

                {/* Aesthetic background elements */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary-fixed/20 rounded-full blur-[120px]"></div>

                <Outlet />
            </main>

            {/* Footer - Rendered based on JSON guidance */}
            <AuthFooter />
        </div>
    </>)
} 