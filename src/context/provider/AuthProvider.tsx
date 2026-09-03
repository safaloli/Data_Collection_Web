import { useEffect, useState, type ReactNode } from "react";
import type { ICredentials } from "../../components/auth/LoginForm";
import { AuthContext, type IUser } from "../AuthContext";
import axiosInstance from "../../config/axios.config";
import Cookies from "js-cookie";
import AppConfig from "../../config/app.config";

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

    useEffect(() => {
        getLoggedInUser()
    }, [])

    return (
        loading ? "loading..." : <AuthContext.Provider value={{
            loginUser: loginUser,
            loggedInUser: loggedInUser,
            getLoggedInUser: getLoggedInUser,
            setLoggedInUser: setLoggedInUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}