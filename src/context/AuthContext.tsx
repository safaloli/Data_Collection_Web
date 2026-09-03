import { createContext } from "react";
import type { ICredentials } from "../components/auth/LoginForm";

export interface IUser {
    id: string,
    address: string,
    email: string,
    name: string,
    phone: string,
    role: string,
    status: string,

}

export interface IAuthContext {
    loggedInUser: null | IUser | undefined,
    loginUser: (data: ICredentials) => Promise<IUser | void | undefined>,
    getLoggedInUser: () => Promise<IUser | void | undefined>,
    setLoggedInUser: (user: IUser | null | undefined) => void,
}

export const AuthContext = createContext<IAuthContext>({
    loggedInUser: null,
    loginUser: async (): Promise<void> => { },
    getLoggedInUser: async (): Promise<IUser | undefined | void> => { },
    setLoggedInUser: () => { }
})