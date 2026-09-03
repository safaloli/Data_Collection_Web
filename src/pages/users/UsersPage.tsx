import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Plus, RefreshCw, Search, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import axiosInstance from "../../config/axios.config";
import { useAuth } from "../../hooks/useAuth";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type Role = "superadmin" | "admin" | "user";

type Status = "active" | "inactive" | "suspended";

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    status: Status;
}

interface UserResponse {
    data: User[];
}

interface FormState {
    name: string;
    email: string;
    password: string;
    role: Role;
    status: Status;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const initialForm: FormState = {
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const getError = (error: unknown) =>
    (error as { message?: string })?.message ??
    "The request could not be completed.";

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function UsersPage() {
    const queryClient = useQueryClient();
    const { loggedInUser } = useAuth();

    const [search, setSearch] = useState("");
    const [form, setForm] = useState<FormState>(initialForm);
    const [creating, setCreating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    // -------------------------------------------------------------------------
    // Get Users
    // -------------------------------------------------------------------------

    const usersQuery = useQuery({
        queryKey: ["users", search],

        queryFn: async () => {
            const response = (await axiosInstance.get(
                `/users?search=${encodeURIComponent(search)}`
            )) as UserResponse;

            return response.data;
        },
    });

    // -------------------------------------------------------------------------
    // Create User
    // -------------------------------------------------------------------------

    const createMutation = useMutation({
        mutationFn: async () => {
            return await axiosInstance.post("/users", form);
        },

        onSuccess: () => {
            toast.success("User created successfully.");

            setForm(initialForm);
            setCreating(false);

            void queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        onError: (error) => {
            toast.error(getError(error));
        },
    });

    // -------------------------------------------------------------------------
    // Update User
    // -------------------------------------------------------------------------

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            field,
            value,
        }: {
            id: string;
            field: "role" | "status";
            value: string;
        }) => {
            return await axiosInstance.patch(`/users/${id}`, {
                [field]: value,
            });
        },

        onSuccess: () => {
            toast.success("User updated.");

            void queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        },

        onError: (error) => {
            toast.error(getError(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => axiosInstance.delete(`/users/${id}`),
        onSuccess: () => {
            toast.success("User deleted successfully.");
            setUserToDelete(null);
            void queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: (error) => toast.error(getError(error)),
    });

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
        <div className="space-y-6">
            {/* -----------------------------------------------------------------
                Page Header
            ----------------------------------------------------------------- */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage administrator and collection accounts.
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => void usersQuery.refetch()}
                        isSubmitting={usersQuery.isFetching}
                        aria-label="Refresh users"
                        title="Refresh users"
                        icon={<RefreshCw />}
                    />
                    <Button
                        onClick={() => setCreating((value) => !value)}
                        icon={<Plus />}
                    >
                        {creating ? "Close" : "Add user"}
                    </Button>
                </div>
            </div>

            {/* -----------------------------------------------------------------
                Create User Form
            ----------------------------------------------------------------- */}

            {creating && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create user</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                                placeholder="Full name"
                                value={form.name}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        name: event.target.value,
                                    })
                                }
                            />

                            <Input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        email: event.target.value,
                                    })
                                }
                            />

                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (8+ characters)"
                                    value={form.password}
                                    onChange={(event) =>
                                        setForm({
                                            ...form,
                                            password: event.target.value,
                                        })
                                    }
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>

                            <select
                                className="h-10 rounded-lg border bg-background px-2.5"
                                value={form.role}
                                onChange={(event) =>
                                    setForm({
                                        ...form,
                                        role: event.target.value as Role,
                                    })
                                }
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="superadmin">
                                    Superadmin
                                </option>
                            </select>
                        </div>

                        <Button
                            className="mt-4"
                            onClick={() => createMutation.mutate()}
                            isSubmitting={createMutation.isPending}
                            disabled={
                                !form.name ||
                                !form.email ||
                                form.password.length < 8
                            }
                        >
                            Create user
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* -----------------------------------------------------------------
                Users List
            ----------------------------------------------------------------- */}

            <Card>
                <CardHeader>
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <CardTitle>All users</CardTitle>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />

                            <Input
                                className="pl-8"
                                placeholder="Search users"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b text-muted-foreground">
                                <tr>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Contact</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Loading */}
                                {usersQuery.isLoading && (
                                    <tr>
                                        <td
                                            className="p-4"
                                            colSpan={5}
                                        >
                                            Loading users...
                                        </td>
                                    </tr>
                                )}

                                {/* Error */}
                                {usersQuery.isError && (
                                    <tr>
                                        <td
                                            className="p-4 text-destructive"
                                            colSpan={5}
                                        >
                                            Unable to load users.
                                        </td>
                                    </tr>
                                )}

                                {/* Data */}
                                {!usersQuery.isLoading &&
                                    !usersQuery.isError &&
                                    (usersQuery.data ?? []).map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            {/* User */}
                                            <td className="p-3">
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </div>
                                            </td>

                                            {/* Role */}
                                            <td className="p-3">
                                                <select
                                                    className="rounded-md border bg-background p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={user.role}
                                                    disabled={updateMutation.isPending || user.id === loggedInUser?.id || user.role === "superadmin"}
                                                    onChange={(event) =>
                                                        updateMutation.mutate({
                                                            id: user.id,
                                                            field: "role",
                                                            value: event.target
                                                                .value,
                                                        })
                                                    }
                                                >
                                                    <option value="user">
                                                        User
                                                    </option>

                                                    <option value="admin">
                                                        Admin
                                                    </option>

                                                    <option value="superadmin">
                                                        Superadmin
                                                    </option>
                                                </select>
                                            </td>

                                            {/* Status */}
                                            <td className="p-3">
                                                <select
                                                    className="rounded-md border bg-background p-1.5 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={user.status}
                                                    disabled={updateMutation.isPending || user.id === loggedInUser?.id || user.role === "superadmin"}
                                                    onChange={(event) =>
                                                        updateMutation.mutate({
                                                            id: user.id,
                                                            field: "status",
                                                            value: event.target
                                                                .value,
                                                        })
                                                    }
                                                >
                                                    <option value="active">
                                                        Active
                                                    </option>

                                                    <option value="inactive">
                                                        Inactive
                                                    </option>

                                                    <option value="suspended">
                                                        Suspended
                                                    </option>
                                                </select>
                                            </td>

                                            {/* Contact */}
                                            <td className="p-3 text-muted-foreground">
                                                {user.phone || "No phone"}
                                            </td>

                                            <td className="p-3 text-right">
                                                {user.id !== loggedInUser?.id && user.role !== "superadmin" && (
                                                    <Button
                                                        variant="destructive"
                                                        size="icon-sm"
                                                        onClick={() => setUserToDelete(user)}
                                                        disabled={deleteMutation.isPending}
                                                        aria-label={`Delete ${user.name}`}
                                                        title={`Delete ${user.name}`}
                                                        icon={<Trash2 />}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog
                open={userToDelete !== null}
                onOpenChange={(open) => {
                    if (!open && !deleteMutation.isPending) setUserToDelete(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete user</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setUserToDelete(null)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => userToDelete && deleteMutation.mutate(userToDelete.id)}
                            isSubmitting={deleteMutation.isPending}
                        >
                            Delete user
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* -----------------------------------------------------------------
                Access Information
            ----------------------------------------------------------------- */}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4" />

                <span>
                    Superadmin accounts and your own account cannot be changed here.
                </span>
            </div>
        </div>
    );
}
