import { Outlet, useNavigate } from "react-router-dom";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
// import DashboardFooter from "../../components/dashboard/DashboardFooter";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserRoles } from "../../utils/constants";
import { toast } from "sonner";
import Cookies from "js-cookie";
import AppConfig from "@/config/app.config";

export default function UserLayout({ allowRole }: Readonly<{ allowRole: string | string[] }>) {
    const { loggedInUser, handleLogout } = useAuth();
    const navigate = useNavigate();

    
    
    const [isMobile, setIsMobile] = useState(() =>
        window.matchMedia("(max-width: 1023px)").matches
    )

    const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
        window.matchMedia("(max-width: 1023px)").matches
    )

const [sidebarPeek, setSidebarPeek] = useState(false)

    // sidebar handle
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1023px)")
        
        const handleMediaChange = () => {
            const mobile = mediaQuery.matches
            
            setIsMobile(mobile)
            setSidebarPeek(false)

                if (mobile) {
                    setSidebarCollapsed(true)
                }
            }

            mediaQuery.addEventListener("change", handleMediaChange)

            return () => {
                mediaQuery.removeEventListener("change", handleMediaChange)
            }
        }, [])

    const sidebarExpanded = !sidebarCollapsed || sidebarPeek
    
    // auth handle
    useEffect(() => {
        const checkAuthentication = async () => {
            // User is not loaded/authenticated
            if (!loggedInUser) {
                 toast.error("Authentication required", {
                    description: "Please login to continue.",
                });
                navigate("/login", { replace: true });
                return;
            }
    
            // Check access token
            const token = Cookies.get(AppConfig.accessToken);
    
            if (!token) {
                 toast.error("Session expired", {
                    description: "Please login again to continue.",
                });
    
                handleLogout()
    
                navigate("/login", { replace: true });
                return;
            }
    
            // Super admin
            if (loggedInUser.role === UserRoles.SUPERADMIN) {
                return;
            }
    
            // Role authorization
            if (!allowRole.includes(loggedInUser.role)) {
                 toast.error("Access denied", {
                    description: "You do not have permission to access this page.",
                });
    
                await handleLogout()
    
                navigate("/login", { replace: true });
                return;
            }
        };
    
        checkAuthentication();
    }, [loggedInUser, allowRole, navigate]);

    return (<>
        <div className="bg-background text-foreground font-inter min-h-screen">

            <DashboardHeader
                collapsed={!sidebarExpanded}
                onToggleSidebar={() => {
                    setSidebarCollapsed(prev => {
                        console.log("TOGGLE sidebarCollapsed:", prev, "=>", !prev)
                        return !prev
                    })
                    setSidebarPeek(false)
                    console.log("Sidebar toggle button clicked")
                }}
            />

            <DashboardSidebar
                collapsed={sidebarCollapsed}
                isMobile={isMobile}
                temporarilyExpanded={sidebarPeek}
                onTemporaryExpand={() => setSidebarPeek(true)}
                onTemporaryCollapse={() => setSidebarPeek(false)}
                onClose={() => {
                    setSidebarCollapsed(true);
                    setSidebarPeek(false)
                }}
            />

            {/* Main Canvas */}
            <main className={`flex-1 min-h-screen flex flex-col py-8 pr-4 space-y-8 transition-[margin] duration-200 ${!sidebarExpanded ? "ml-4 sm:ml-24" : "ml-4 sm:ml-70"}`}>
                <Outlet />
            </main>

            {/* <DashboardFooter /> */}
        </div>
    </>)
}