import { useState } from "react";
import { Check, RotateCcw, Save, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

type Role = "superadmin" | "admin" | "user";
const permissions = ["View dashboard", "View citizens", "Add citizens", "Import data", "Export data", "Manage users", "Manage roles"];
const defaultPermissions: Record<Role, string[]> = { superadmin: permissions, admin: permissions.slice(0, 6), user: permissions.slice(0, 2) };
const storageKey = "jan-data-role-permissions";
const loadPermissions = (): Record<Role, string[]> => { try { const saved = localStorage.getItem(storageKey); return saved ? JSON.parse(saved) as Record<Role, string[]> : defaultPermissions; } catch { return defaultPermissions; } };

export default function RolesPermissionsPage() {
    const [role, setRole] = useState<Role>("admin"); const [rolePermissions, setRolePermissions] = useState(loadPermissions);
    const toggle = (permission: string) => setRolePermissions((current) => ({ ...current, [role]: current[role].includes(permission) ? current[role].filter((item) => item !== permission) : [...current[role], permission] }));
    const save = () => { localStorage.setItem(storageKey, JSON.stringify(rolePermissions)); toast.success("Role permissions saved."); };
    const reset = () => setRolePermissions((current) => ({ ...current, [role]: defaultPermissions[role] }));
    return <div className="space-y-6"><div><h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1><p className="mt-1 text-sm text-muted-foreground">Configure access for each application role.</p></div><Card><CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5 text-primary" />Role access</CardTitle></CardHeader><CardContent className="space-y-5"><div className="flex flex-wrap gap-2">{(["superadmin", "admin", "user"] as Role[]).map((item) => <Button key={item} variant={role === item ? "default" : "outline"} onClick={() => setRole(item)}>{item[0].toUpperCase() + item.slice(1)}</Button>)}</div><div className="divide-y rounded-lg border">{permissions.map((permission) => { const checked = rolePermissions[role].includes(permission); return <label className="flex cursor-pointer items-center justify-between gap-4 p-4" key={permission}><span>{permission}</span><input type="checkbox" checked={checked} onChange={() => toggle(permission)} className="size-4 accent-primary" /></label>; })}</div><div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={reset} icon={<RotateCcw />}>Reset role</Button><Button onClick={save} icon={<Save />}>Save permissions</Button></div></CardContent></Card><p className="flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4" />Changes are stored for this browser until a permissions API is added.</p></div>;
}
