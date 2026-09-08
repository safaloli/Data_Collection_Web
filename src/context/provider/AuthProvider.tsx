import { useEffect, useState, type ReactNode } from "react";
import type { ICredentials } from "../../components/auth/LoginForm";
import { AuthContext, type IUser } from "../AuthContext";
import axiosInstance from "../../config/axios.config";
import Cookies from "js-cookie";
import AppConfig from "../../config/app.config";
import { toast } from "sonner";
import type { IException } from "@/config/globalTypeConfig";
import PageSkeleton from "../../components/ui/PageSkeleton";

export default function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
    const [loggedInUser, setLoggedInUser] = useState<IUser | undefined | null>(null)
    const [loading, setLoading] = useState<boolean>(true)


    const loginUser = async (data: ICredentials) => {
        const response = await axiosInstance.post("/auth/login", data)

        Cookies.set(AppConfig.accessToken, response.data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: "Lax"
        })

        return await getLoggedInUser()
    }

    const getLoggedInUser = async (): Promise<IUser | undefined | void> => {
        try {
            const userDetailResponse = await axiosInstance.get("/auth/me")

            setLoggedInUser(userDetailResponse.data)
            return userDetailResponse.data
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async (): Promise<void> => {
        try {
            await axiosInstance.post("/auth/logout");

        } catch (exception) {
            const error = exception as IException;

            toast.error("Failed to logout", {
                description: error.message || "Something went wrong.",
            });
        } finally {
            // Always clear local authentication
            Cookies.remove(AppConfig.accessToken);

            // Clear React authentication state
            setLoggedInUser(null);
        }
    };

    useEffect(() => {
        getLoggedInUser()
    }, [])

    return (
        loading ? <PageSkeleton cards={4} rows={4} /> : <AuthContext.Provider value={{
            loginUser: loginUser,
            loggedInUser: loggedInUser,
            getLoggedInUser: getLoggedInUser,
            setLoggedInUser: setLoggedInUser,
            handleLogout: handleLogout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}