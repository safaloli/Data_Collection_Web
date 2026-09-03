import { useState } from "react";
import MaterialIcon from "../../assets/icons/MaterialIcon";
import { Button } from "../ui/button";
import { useTheme } from "../../hooks/useTheme";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import AppConfig from "../../config/app.config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.config";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function DashboardHeader({ collapsed, onToggleSidebar }: Readonly<{ collapsed: boolean; onToggleSidebar: () => void }>) {
    const { isDark, setIsDark } = useTheme()
    const navigate = useNavigate()

    const { setLoggedInUser, loggedInUser } = useAuth()

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogout = async () => {
        if (isSubmitting) return

        setIsSubmitting(true)

        try {
            await axiosInstance.post("/auth/logout")

            Cookies.remove(AppConfig.accessToken)
            setLoggedInUser(null)
            setLogoutDialogOpen(false)
            toast.success("Logged out successfully", {
                description: "You have been signed out of your account."
            })
            navigate("/login")
        } catch (exception: any) {
            toast.error("Logout failed", {
                description: exception?.message || "Please try again."
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (<>
        <header className={`flex justify-between items-center px-4 h-16 z-500 bg-sidebar shadow-xs backdrop-blur-md full-width top-0 sticky border-border border-b transition-[margin] duration-200 ${collapsed ? " sm:ml-18" : "sm:ml-64"}`}>
            <div className="relative z-10 flex items-center flex-1 max-w-xl">
                <Button
                    data-sidebar-toggle="true"
                    variant="ghost" size="icon"
                    onClick={onToggleSidebar}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <div className="z-">
                        {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                    </div>
                </Button>
            </div>
            <div className="flex items-center ">
                <Button
                    onClick={() => setIsDark(prev => !prev)}
                    variant={"ghost"}
                    className="py-4 px-2 rounded-xl hover:bg-surface-variant"
                    icon={<MaterialIcon icon={isDark ? "dark_mode" : "light_mode"} />}
                />

                <div className="h-8 w-px bg-outline-variant mx-2"></div>

                <Dropdown
                    trigger={
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full p-0.5 flex items-center justify-center">
                                <MaterialIcon icon="account_circle" className="text-3xl! text-on-surface-variant" />
                                {/* <img
                                    alt="Admin Profile"
                                    className="h-full w-full rounded-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/..."
                                /> */}
                            </div>
                        </div>
                    }
                >
                    {/* Header */}
                    <div className="w-64 flex items-center gap-3 p-4 border-b border-outline-variant">
                        <div className="h-10 w-10 rounded-full bg-gray-300"></div>
                        <div>
                            <p className="text-sm font-medium">{loggedInUser?.name || "Adam"}</p>
                            <p className="text-xs text-on-surface-variant">{loggedInUser?.role || "Demo"}</p>
                        </div>
                    </div>

                    <div className="py-2">
                        <DropdownItem icon={<MaterialIcon icon="lock_reset" />} onClick={() => navigate("/change-password")}>
                            Change Password
                        </DropdownItem>

                        <div className="border-t border-outline-variant my-2" />

                        <DropdownItem
                            danger
                            icon={<MaterialIcon icon="logout" />}
                            onClick={() => setLogoutDialogOpen(true)}
                        >
                            Log Out
                        </DropdownItem>
                    </div>
                </Dropdown>

                <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Log out</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to sign out of this account?
                            </DialogDescription>
                        </DialogHeader>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setLogoutDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleLogout}
                                isSubmitting={isSubmitting}
                            >
                                Log out
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </header>
    </>)
}