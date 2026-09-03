import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import axiosInstance from "../../config/axios.config";

interface PasswordFields {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const initialFields: PasswordFields = { currentPassword: "", newPassword: "", confirmPassword: "" };
const getErrorMessage = (error: unknown) => (error as { message?: string })?.message ?? "Unable to change password.";

export default function ChangePasswordPage() {
    const navigate = useNavigate();
    const [fields, setFields] = useState<PasswordFields>(initialFields);
    const [visible, setVisible] = useState({ current: false, next: false, confirm: false });
    const [submitting, setSubmitting] = useState(false);

    const updateField = (field: keyof PasswordFields, value: string) => setFields((current) => ({ ...current, [field]: value }));
    const changePassword = async () => {
        if (!fields.currentPassword || !fields.newPassword || !fields.confirmPassword) return toast.error("Complete all password fields.");
        if (fields.newPassword.length < 6) return toast.error("New password must be at least 6 characters.");
        if (fields.newPassword !== fields.confirmPassword) return toast.error("Passwords do not match.");
        setSubmitting(true);
        try {
            await axiosInstance.post("/auth/change-password", fields);
            setFields(initialFields);
            toast.success("Password changed successfully.");
        } catch (error) {
            toast.error(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };
    const passwordInput = (field: keyof PasswordFields, label: string, isVisible: boolean, toggle: () => void) => <div className="space-y-2"><label className="text-sm font-medium" htmlFor={field}>{label}</label><div className="relative"><Input id={field} type={isVisible ? "text" : "password"} value={fields[field]} onChange={(event) => updateField(field, event.target.value)} className="pr-10" autoComplete={field === "currentPassword" ? "current-password" : "new-password"} /><button type="button" className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground" onClick={toggle} aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}><span className="sr-only">{isVisible ? "Hide" : "Show"} {label}</span>{isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>;

    return <div className="mx-auto w-full max-w-xl space-y-6"><Button variant="ghost" onClick={() => navigate(-1)} icon={<ArrowLeft />}>Back</Button><Card><CardHeader><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><LockKeyhole className="size-5" /></span><div><CardTitle>Change password</CardTitle><CardDescription className="mt-1">Update the password used to access your account.</CardDescription></div></div></CardHeader><CardContent className="space-y-5">{passwordInput("currentPassword", "Current password", visible.current, () => setVisible((current) => ({ ...current, current: !current.current })))}{passwordInput("newPassword", "New password", visible.next, () => setVisible((current) => ({ ...current, next: !current.next })))}{passwordInput("confirmPassword", "Confirm new password", visible.confirm, () => setVisible((current) => ({ ...current, confirm: !current.confirm })))}<p className="text-xs text-muted-foreground">Use at least 6 characters. Your new password must differ from your current password.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button><Button onClick={changePassword} isSubmitting={submitting} disabled={submitting}>Change password</Button></div></CardContent></Card></div>;
}
