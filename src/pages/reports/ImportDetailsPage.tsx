import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import PageSkeleton from "../../components/ui/PageSkeleton";
import { getImportDetails, getImportRows, type ImportDetails, type ImportHistoryRow } from "./reports.service";

const number = new Intl.NumberFormat("en-US");

export default function ImportDetailsPage() {
    const navigate = useNavigate();
    const { importJobId } = useParams();
    const [details, setDetails] = useState<ImportDetails | null>(null);
    const [rows, setRows] = useState<ImportHistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!importJobId) {
            setError(true);
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                const [importDetails, importRows] = await Promise.all([
                    getImportDetails(importJobId),
                    getImportRows(importJobId),
                ]);
                setDetails(importDetails);
                setRows(importRows);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [importJobId]);

    if (loading) return <PageSkeleton cards={4} rows={8} />;

    if (error || !details) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                    <p>Unable to load import details.</p>
                    <Button variant="outline" onClick={() => navigate("/reports/data-summary")}>
                        Back to data summary
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Import Details</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{details.file_name}</p>
                </div>
                <Button variant="outline" onClick={() => navigate("/reports/data-summary")}>
                    <ArrowLeft />
                    Back to data summary
                </Button>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-base">Import Summary</CardTitle></CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Detail label="File name" value={details.file_name} />
                    <Detail label="Imported at" value={new Date(details.createdAt).toLocaleString()} />
                    <Detail label="Total rows" value={number.format(details.total_rows)} />
                    <Detail label="Imported" value={number.format(details.imported_rows)} />
                    <Detail label="Failed" value={number.format(details.failed_rows || details.invalid_rows || 0)} />
                    <Detail label="Status" value={details.status} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-base">Import Rows</CardTitle></CardHeader>
                <CardContent className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted">
                            <tr><th className="p-2">Row</th><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Status</th><th className="p-2">Errors</th></tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr className="border-t" key={row.id}>
                                    <td className="p-2">{row.row_number}</td>
                                    <td className="p-2">{String(row.normalized_data?.name ?? row.raw_data?.name ?? "")}</td>
                                    <td className="p-2">{String(row.normalized_data?.phone ?? row.raw_data?.phone ?? "")}</td>
                                    <td className="p-2">{row.status}</td>
                                    <td className="p-2 text-destructive">{row.errors?.map((item) => item.message).join("; ") || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!rows.length && <p className="py-8 text-center text-sm text-muted-foreground">No import rows found.</p>}
                </CardContent>
            </Card>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return <div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>;
}
