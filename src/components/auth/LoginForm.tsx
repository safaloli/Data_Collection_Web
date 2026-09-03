import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import MaterialIcon from "../../assets/icons/MaterialIcon";
import { useAuth } from "../../hooks/useAuth";
import type { IUser } from "../../context/AuthContext";
import { toast } from "sonner";


export interface ICredentials {
    email: string;
    password: string;
}

const CredentialsDTO = z.object({
    email: z.email().nonempty().nonoptional(),
    password: z.string().nonempty("Password is required").nonoptional()
})

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(CredentialsDTO)
    })

    const { loginUser } = useAuth()
    const navigate = useNavigate()

    const submitHandler = async (data: ICredentials) => {
        try {
            await loginUser(data) as unknown as IUser

            toast.success("Welcome to user panel!", {
                description: "You are successfully logged in."
            })
            navigate("/")


        } catch (exception: any) {
            console.error("login error", exception)
            toast.error("Login error!", {
                description: exception.message || "Server error"
            })
        }
    }
    return (<>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            {/* email  */}
            <div className="space-y-1.5">
                <Label htmlFor="email">EMAIL ADDRESS</Label>
                <div className="relative">
                    <MaterialIcon
                        icon="mail"
                        className="absolute left-4 top-2 text-lg! text-outline "
                    />
                    <Input
                        name="email"
                        type="email"
                        control={control}
                        placeholder="name@gmail.com"
                        errMsg={errors?.email?.message}
                        className="pl-12"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                {/* forgot password button  */}
                <div className="flex justify-between items-center">
                    <Label htmlFor="password">PASSWORD</Label>
                    <Link
                        to={'/reset-password'}
                        className="font-body-sm text-body-sm  hover:text-primary hover:underline transition-colors duration-200"
                    >Forgot Password?</Link>
                </div>

                {/* password field  */}
                <div className="relative flex items-center">
                    <MaterialIcon
                        icon="lock"
                        className="absolute left-4 top-2 text-lg! text-outline"
                    />
                    <Input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        control={control}
                        errMsg={errors?.password?.message}
                        className="pl-12"
                    />
                    {/* show password button  */}
                    <Button
                        variant={"ghost"}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1 cursor-pointer"
                    >
                        <MaterialIcon
                            icon={showPassword ? "visibility" : "visibility_off"}
                            className="text-lg! "
                        />
                    </Button>
                </div>
            </div>

            {/* remember me  */}
            <div className="flex items-center">
                <Checkbox
                    name="remember-me"
                    id="remember"
                // control={control}
                />
                <Label
                    htmlFor="remember"
                    className="ml-2 "
                >
                    Remember Me
                </Label>
            </div>

            <Button
                type="submit"
                isSubmitting={isSubmitting}
                width="full"
                size={"lg"}
            >Login</Button>
        </form>
    </>)
}