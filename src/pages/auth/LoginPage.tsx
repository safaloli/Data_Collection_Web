import { useEffect } from "react";
import LoginForm from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";


export default function LoginPage() {
    const { loggedInUser } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (loggedInUser) {
            // already logged in 
            navigate("/")
        }
    }, [loggedInUser])

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background px-4">

            <Card className="w-full max-w-md rounded-2xl border-border bg-card shadow-lg outline-4/10 p-4">

                <CardHeader className="text-center pb-6">

                    <CardTitle className="font-h1 text-h3 tracking-tight">
                        Welcome Back
                    </CardTitle>

                    <CardDescription>
                        Sign in to access your account
                    </CardDescription>

                </CardHeader>


                <CardContent>
                    <LoginForm />
                </CardContent>


                <CardFooter className="mt-2 flex items-center justify-center gap-2 text-outline/70">

                    <span
                        className="material-symbols-outlined text-body-lg"
                        data-icon="verified_user"
                    >
                        verified_user
                    </span>

                    <p className="font-body-sm text-label-caps tracking-wide">
                        Secure, end-to-end encrypted portal
                    </p>

                </CardFooter>

            </Card>

        </div>
    );
}