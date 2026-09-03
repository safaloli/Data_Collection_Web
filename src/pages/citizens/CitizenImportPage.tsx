import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

import { Button } from "../../components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

import {
    NepalDistrictSelect,
    NepalLocalSelect,
    NepalProvinceSelect,
    NepalWardSelect,
} from "@itzsa/nepal-geo";

import {
    confirmCitizenImport,
    downloadCitizenImportErrors,
    downloadCitizenImportTemplate,
    previewCitizenImport,
} from "../../services/citizenImport.service";

import type {
    ImportPreview,
    ImportPreviewRow,
    ImportResult,
} from "./types/CitizenImport.types";


const saveBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = name;

    link.click();

    URL.revokeObjectURL(url);
};


const errorMessage = (error: unknown) => {
    return (
        (error as { message?: string })?.message ??
        "The request could not be completed."
    );
};


export default function CitizenImportPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Address State

    const [provinceId, setProvinceId] = useState<number | null>(null);
    const [districtId, setDistrictId] = useState<number | null>(null);
    const [localId, setLocalId] = useState<number | null>(null);
    const [wardId, setWardId] = useState<number | null>(null);

    // Import State

    const [file, setFile] = useState<File | null>(null);

    const [preview, setPreview] = useState<ImportPreview | null>(null);

    const [result, setResult] = useState<ImportResult | null>(null);

    const [filter, setFilter] = useState("ALL");

    const [search, setSearch] = useState("");

    const [busy, setBusy] = useState(false);

    // Address Object
    const address = {
        province_id: provinceId ?? 0,
        district_id: districtId ?? 0,
        local_id: localId ?? 0,
        ward_id: wardId ?? 0,
    };

    // File Selection
    const selectFile = (candidate: File | undefined) => {
        if (!candidate) {
            return;
        }

        if (!/\.(xlsx|xls)$/i.test(candidate.name)) {
            return toast.error("Select an .xlsx or .xls file.");
        }

        setFile(candidate);
    };

    // Upload & Preview
    const continueUpload = async () => {
        if (!provinceId || !districtId || !localId || !wardId) {
            return toast.error(
                "Select province, district, municipality, and ward first."
            );
        }

        if (!file) {
            return toast.error("Choose an Excel file first.");
        }

        setBusy(true);

        try {
            const data = await previewCitizenImport(file, address);

            setPreview(data);
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    // Confirm Import
    const confirm = async () => {
        if (!preview || preview.summary.valid_rows === 0) {
            return;
        }

        setBusy(true);

        try {
            const data = await confirmCitizenImport(
                preview.import_job_id,
                "SKIP"
            );

            setResult(data);

            await queryClient.invalidateQueries({
                queryKey: ["citizens"],
            });
        } catch (error) {
            toast.error(errorMessage(error));
        } finally {
            setBusy(false);
        }
    };

    // Filter Preview Rows
    const rows = (preview?.rows ?? []).filter(
        (row: ImportPreviewRow) => {
            const matchesFilter =
                filter === "ALL" ||
                (
                    filter === "DUPLICATE"
                        ? row.status.startsWith("DUPLICATE")
                        : row.status === filter
                );

            const text = JSON.stringify(row.data).toLowerCase();

            return (
                matchesFilter &&
                (
                    !search ||
                    text.includes(search.toLowerCase()) ||
                    row.errors.some((item) =>
                        item.message
                            .toLowerCase()
                            .includes(search.toLowerCase())
                    )
                )
            );
        }
    );

    // Reset Import
    const reset = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setFilter("ALL");
        setSearch("");
    };

    // Render
    return (
        <div className="space-y-6">

            {/* Page Header */}

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Import Citizens
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Select the collection address, then preview your
                        Excel records.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={() => navigate("/citizens/list")}
                >
                    Back to citizens
                </Button>

            </div>


            {/* STEP 1 + STEP 2 */}
            {!preview && !result && (
                <>
                    {/* Step 1: Address */}

                    <Card>

                        <CardHeader>
                            <CardTitle className="text-base">
                                1. Select address
                            </CardTitle>
                        </CardHeader>

                        <CardContent>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                                {/* Province */}

                                <NepalProvinceSelect
                                    label="Province"
                                    value={provinceId}
                                    onChange={(value) => {
                                        setProvinceId(value);

                                        setDistrictId(null);
                                        setLocalId(null);
                                        setWardId(null);
                                    }}
                                    clearable
                                />

                                {/* District */}

                                <NepalDistrictSelect
                                    provinceId={provinceId}
                                    label="District"
                                    value={districtId}
                                    onChange={(value) => {
                                        setDistrictId(value);

                                        setLocalId(null);
                                        setWardId(null);
                                    }}
                                    disabled={!provinceId}
                                    clearable
                                />

                                {/* Municipality */}

                                <NepalLocalSelect
                                    districtId={districtId}
                                    label="Municipality"
                                    value={localId}
                                    onChange={(value) => {
                                        setLocalId(value);

                                        setWardId(null);
                                    }}
                                    disabled={!districtId}
                                    clearable
                                />

                                {/* Ward */}

                                <NepalWardSelect
                                    localId={localId}
                                    label="Ward"
                                    value={wardId}
                                    onChange={setWardId}
                                    disabled={!localId}
                                    clearable
                                />

                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                Every imported citizen will be assigned to
                                this address.
                            </p>

                        </CardContent>

                    </Card>

                    {/* Step 2: Excel File */}
                    <Card>

                        <CardHeader>
                            <CardTitle className="text-base">
                                2. Choose Excel file
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">

                            {/* Download Template */}

                            <Button
                                variant="outline"
                                onClick={async () => {
                                    const blob =
                                        await downloadCitizenImportTemplate();

                                    saveBlob(
                                        blob as unknown as Blob,
                                        "citizens-template.xlsx"
                                    );
                                }}
                                icon={<Download />}
                            >
                                Download template
                            </Button>


                            {/* File Picker */}

                            <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center">

                                <FileSpreadsheet className="size-8 text-muted-foreground" />

                                <span>
                                    {file?.name ?? "Choose Excel file"}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    .xlsx or .xls, maximum 10 MB
                                </span>

                                <input
                                    className="sr-only"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={(event) =>
                                        selectFile(
                                            event.target.files?.[0]
                                        )
                                    }
                                />

                            </label>

                        </CardContent>

                    </Card>

                    {/* Continue */}
                    <Button
                        onClick={continueUpload}
                        isSubmitting={busy}
                        disabled={
                            !file ||
                            !provinceId ||
                            !districtId ||
                            !localId ||
                            !wardId
                        }
                        icon={<Upload />}
                    >
                        Continue to preview
                    </Button>

                </>
            )}

            {/* STEP 3: PREVIEW */}
            {preview && !result && (
                <Card>

                    <CardHeader>
                        <CardTitle className="text-base">
                            3. Preview and confirm: {preview.file_name}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* --------------------------------------------------
                            Summary
                        -------------------------------------------------- */}

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">

                            {[
                                [
                                    "Total",
                                    preview.summary.total_rows,
                                ],
                                [
                                    "Valid",
                                    preview.summary.valid_rows,
                                ],
                                [
                                    "Invalid",
                                    preview.summary.invalid_rows,
                                ],
                                [
                                    "File duplicates",
                                    preview.summary.duplicate_in_file,
                                ],
                                [
                                    "Existing",
                                    preview.summary.duplicate_in_database,
                                ],
                            ].map(([label, value]) => (
                                <div
                                    className="rounded-lg border p-3"
                                    key={label as string}
                                >
                                    <div className="text-xs text-muted-foreground">
                                        {label}
                                    </div>

                                    <div className="text-xl font-semibold">
                                        {value}
                                    </div>
                                </div>
                            ))}

                        </div>


                        {/* --------------------------------------------------
                            Search & Filters
                        -------------------------------------------------- */}

                        <div className="flex flex-wrap gap-2">

                            <input
                                className="h-8 rounded-md border px-2 text-sm"
                                placeholder="Search rows"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            {[
                                "ALL",
                                "VALID",
                                "INVALID",
                                "DUPLICATE",
                            ].map((value) => (
                                <Button
                                    key={value}
                                    size="sm"
                                    variant={
                                        filter === value
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        setFilter(value)
                                    }
                                >
                                    {value[0] +
                                        value.slice(1).toLowerCase()}
                                </Button>
                            ))}

                        </div>


                        {/* --------------------------------------------------
                            Preview Table
                        -------------------------------------------------- */}

                        <div className="overflow-x-auto rounded-lg border">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-muted">

                                    <tr>
                                        <th className="p-2">
                                            Row
                                        </th>

                                        <th className="p-2">
                                            Name
                                        </th>

                                        <th className="p-2">
                                            Phone
                                        </th>

                                        <th className="p-2">
                                            Status
                                        </th>

                                        <th className="p-2">
                                            Errors
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {rows
                                        .slice(0, 100)
                                        .map((row) => (
                                            <tr
                                                className="border-t"
                                                key={row.row_number}
                                            >

                                                <td className="p-2">
                                                    {row.row_number}
                                                </td>

                                                <td className="p-2">
                                                    {String(
                                                        row.data.name ?? ""
                                                    )}
                                                </td>

                                                <td className="p-2">
                                                    {String(
                                                        row.data.phone ?? ""
                                                    )}
                                                </td>

                                                <td className="p-2">
                                                    {row.status}
                                                </td>

                                                <td className="p-2 text-destructive">
                                                    {row.errors
                                                        .map(
                                                            (item) =>
                                                                item.message
                                                        )
                                                        .join("; ")}
                                                </td>

                                            </tr>
                                        ))}

                                </tbody>

                            </table>

                        </div>


                        <p className="text-xs text-muted-foreground">
                            Duplicate handling: skip existing and repeated
                            phone numbers. Showing up to 100 filtered rows.
                        </p>


                        {/* --------------------------------------------------
                            Actions
                        -------------------------------------------------- */}

                        <div className="flex flex-wrap justify-end gap-2">

                            <Button
                                variant="outline"
                                onClick={reset}
                            >
                                Choose another file
                            </Button>


                            <Button
                                variant="outline"
                                onClick={async () => {
                                    const blob =
                                        await downloadCitizenImportErrors(
                                            preview.import_job_id
                                        );

                                    saveBlob(
                                        blob as unknown as Blob,
                                        "citizen-import-errors.xlsx"
                                    );
                                }}
                                icon={<Download />}
                            >
                                Error report
                            </Button>


                            <Button
                                onClick={confirm}
                                disabled={
                                    preview.summary.valid_rows === 0
                                }
                                isSubmitting={busy}
                            >
                                Import {preview.summary.valid_rows} records
                            </Button>

                        </div>

                    </CardContent>

                </Card>
            )}

            {/* STEP 4: RESULT */}
            {result && (
                <Card>

                    <CardHeader>
                        <CardTitle>
                            4. Import completed
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">

                        {/* Result Summary */}

                        <div className="grid grid-cols-2 gap-3">

                            <div>
                                Total rows:{" "}
                                {result.summary.total_rows}
                            </div>

                            <div>
                                Imported:{" "}
                                {result.summary.imported_rows}
                            </div>

                            <div>
                                Skipped:{" "}
                                {result.summary.skipped_rows}
                            </div>

                            <div>
                                Failed:{" "}
                                {result.summary.failed_rows}
                            </div>

                        </div>


                        {/* Result Actions */}

                        <div className="flex gap-2">

                            <Button
                                onClick={() =>
                                    navigate("/citizens/list")
                                }
                            >
                                View citizens
                            </Button>


                            <Button
                                variant="outline"
                                onClick={async () => {
                                    const blob =
                                        await downloadCitizenImportErrors(
                                            result.import_job_id
                                        );

                                    saveBlob(
                                        blob as unknown as Blob,
                                        "citizen-import-errors.xlsx"
                                    );
                                }}
                                icon={<Download />}
                            >
                                Error report
                            </Button>


                            <Button
                                variant="outline"
                                onClick={reset}
                            >
                                New import
                            </Button>

                        </div>

                    </CardContent>

                </Card>
            )}

        </div>
    );
}

