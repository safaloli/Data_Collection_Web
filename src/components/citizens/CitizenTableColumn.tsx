import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { DataTableFeatures } from "../table/data-table-features";
import type { DisplayCitizen } from "../../pages/citizens/types/Citizen.types";
import MaterialIcon from "../../assets/icons/MaterialIcon";
import { formatDate } from "../../utils/helpers";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import axiosInstance from "../../config/axios.config";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";

const columnHelper = createColumnHelper<DataTableFeatures, DisplayCitizen>()

function CitizenActions({ citizen }: { citizen: DisplayCitizen }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const deleteMutation = useMutation({
        mutationFn: () => axiosInstance.delete(`/citizens/${citizen.id}`),
        onSuccess: () => {
            toast.success("Citizen deleted successfully.");
            setDeleteDialogOpen(false);
            queryClient.setQueryData<DisplayCitizen[]>(["citizens"], (currentCitizens) =>
                currentCitizens?.filter((currentCitizen) => currentCitizen.id !== citizen.id) ?? []
            );
            void queryClient.invalidateQueries({ queryKey: ["citizens"] });
        },
        onError: (error: { message?: string }) => {
            toast.error(error.message ?? "Failed to delete citizen.");
        },
    });

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/citizens/${citizen.id}`)}>
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/citizens/edit/${citizen.id}`)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={() => setDeleteDialogOpen(true)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete citizen?</DialogTitle>
                        <DialogDescription>
                            Delete {citizen.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}


export const citizenColumn = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={
                    table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("name", {
        header: ({ column }) =>
            <div className="px-2 py-3">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Citizen Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>

            </div>,
        cell: ({ row }) => {
            return <>
                <div className="p-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <MaterialIcon icon="person" className="text-lg!" />
                        </div>

                        <p className="font-medium">{row.getValue("name")}</p>
                    </div>
                </div>
            </>
        }
    }),
    columnHelper.accessor("phone", {
        header: () => <div className="px-2 py-3">Phone</div>,
        cell: ({ row }) => {
            return <>
                <div className="p-2">
                    <div className="flex items-center gap-2">
                        <MaterialIcon icon="phone" className="text-base! text-muted-foreground" />
                        <span>{row.getValue("phone")}</span>
                    </div>
                </div>
            </>
        }
    }),
    columnHelper.accessor("dob", {
        header: "Date of Birth",
        cell: ({ row }) => {
            return <>
                <div className="px-6 py-4 text-muted-foreground">
                    {formatDate(row.getValue("dob"))}
                </div>
            </>
        }
    }),
    columnHelper.accessor("address", {
        header: () => <div className="px-2 py-3">Address</div>,
        cell: ({ row }) => {
            const citizen = row.original;
            return <>
                <div className="p-2">
                    <div className="space-y-0.5">
                        <p className="font-medium">
                            {citizen.address.province}, {citizen.address.district}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {citizen.address.municipality} · Ward {citizen.address.wardNo}
                        </p>
                    </div>
                </div>
            </>
        }
    }),
    columnHelper.accessor("father", {
        header: () => <div className="px-2 py-3">Father</div>,
        cell: ({ row }) => {
            const citizen = row.original
            return <>
                <div className="p-2">
                    <div className="space-y-0.5">
                        <p className="font-medium">
                            {citizen.father.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {citizen.father.contact}
                        </p>
                    </div>
                </div>
            </>
        }
    }),
    columnHelper.accessor("mother", {
        header: () => <div className="px-2 py-3">Mother</div>,
        cell: ({ row }) => {
            const citizen = row.original
            return <>
                <div className="p-2">
                    <div className="space-y-0.5">
                        <p className="font-medium">
                            {citizen.mother.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {citizen.mother.contact}
                        </p>
                    </div>
                </div>
            </>
        }
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            return <CitizenActions citizen={row.original} />
        },
    }),

])