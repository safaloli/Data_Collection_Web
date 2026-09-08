import { useEffect, useState, type ReactNode } from "react";
import { Download, FileText, RefreshCw, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getCitizenReport, type CitizenReport } from "./reports.service";
import PageSkeleton from "../../components/ui/PageSkeleton";

const number = new Intl.NumberFormat("en-US");
const genderLabels = [["MALE", "Male"], ["FEMALE", "Female"], ["OTHER", "Other"]] as const;
const ageLabels = [["0_17", "0-17"], ["18_30", "18-30"], ["31_45", "31-45"], ["46_60", "46-60"], ["60_plus", "60+"]] as const;

export default function CitizenReportPage() {
    const [report, setReport] = useState<CitizenReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const load = async () => { setLoading(true); setError(false); try { setReport(await getCitizenReport()); } catch { setError(true); } finally { setLoading(false); } };
    useEffect(() => { void load(); }, []);

    if (loading) return <PageSkeleton cards={4} rows={6} />;
    if (error || !report) return <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center"><p>Unable to load citizen report.</p><Button onClick={() => void load()}>Retry</Button></CardContent></Card>;
    const exportExcel = () => {
        const rows = [["Citizen Report"], ["Metric", "Count"], ["Total Citizens", report.total], ...genderLabels.map(([key, label]) => [label, report.gender[key]]), ...ageLabels.map(([key, label]) => [`Age ${label}`, report.age_groups[key]]), ["Single Entry", report.source.SINGLE_ENTRY], ["Excel Imports", report.source.IMPORT]];
        const html = `<table>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
        const blob = new Blob([`<html><body>${html}</body></html>`], { type: "application/vnd.ms-excel" });
        const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "citizen-report.xls"; link.click(); URL.revokeObjectURL(url);
    };
    return <div className="space-y-6" id="citizen-report">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold tracking-tight">Citizen Report</h1><p className="mt-1 text-sm text-muted-foreground">Overview of registered citizen records and collection statistics.</p></div><div className="flex gap-2"><Button variant="outline" size="icon" onClick={() => void load()} aria-label="Refresh report"><RefreshCw /></Button><Button variant="outline" onClick={exportExcel}><Download /> Export Excel</Button><Button onClick={() => window.print()}><FileText /> Export PDF</Button></div></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Total Citizens" value={report.total} icon={<Users />} /><Stat label="Male" value={report.gender.MALE} /><Stat label="Female" value={report.gender.FEMALE} /><Stat label="Other" value={report.gender.OTHER} /></div>
        <div className="grid gap-6 lg:grid-cols-2"><Breakdown title="Citizens by gender" entries={genderLabels.map(([key, label]) => [label, report.gender[key]])} total={report.total} /><Breakdown title="Citizens by age" entries={ageLabels.map(([key, label]) => [label, report.age_groups[key]])} total={report.total} /></div>
        <Card><CardHeader><CardTitle>Collection statistics</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><Stat label="Single Entry" value={report.source.SINGLE_ENTRY} /><Stat label="Excel Imports" value={report.source.IMPORT} /><Stat label="Records with age" value={Object.values(report.age_groups).reduce((sum, value) => sum + value, 0)} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Citizens by province, district, local level and ward</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b"><th className="p-3">Province</th><th className="p-3">District</th><th className="p-3">Local level</th><th className="p-3">Ward</th><th className="p-3">Citizens</th></tr></thead><tbody>{report.addresses.map((row) => <tr className="border-b" key={`${row.province}-${row.district}-${row.municipality}-${row.ward}`}><td className="p-3">{row.province}</td><td className="p-3">{row.district}</td><td className="p-3">{row.municipality}</td><td className="p-3">{row.ward}</td><td className="p-3 font-semibold">{number.format(row.count)}</td></tr>)}</tbody></table>{report.addresses.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No address data recorded yet.</p>}</CardContent></Card>
    </div>;
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: ReactNode }) { return <Card><CardContent className="flex items-center gap-3">{icon}<div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{number.format(value)}</p></div></CardContent></Card>; }
function Breakdown({ title, entries, total }: { title: string; entries: [string, number][]; total: number }) { return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent className="space-y-4">{entries.map(([label, value]) => <div key={label}><div className="mb-1 flex justify-between text-sm"><span>{label}</span><span className="font-medium">{number.format(value)}{total ? ` (${((value / total) * 100).toFixed(1)}%)` : ""}</span></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${total ? (value / total) * 100 : 0}%` }} /></div></div>)}</CardContent></Card>; }