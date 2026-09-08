import axiosInstance from "../../config/axios.config";

export interface AddressRow { province: string; district: string; municipality: string; ward: string; count: number }
export interface CitizenReport {
    total: number;
    gender: { MALE: number; FEMALE: number; OTHER: number };
    age_groups: Record<"0_17" | "18_30" | "31_45" | "46_60" | "60_plus", number>;
    source: { SINGLE_ENTRY: number; IMPORT: number };
    addresses: AddressRow[];
}

export interface SummaryUser {
    id: string;
    name: string;
    role: string;
    status: string;
    single_entry: number;
    imported_citizens: number;
    import_files: number;
    total_collected: number;
}

export interface SummaryImport {
    id: string;
    file_name: string;
    created_by: string;
    user_name: string;
    total_rows: number;
    imported_rows: number;
    failed_rows: number;
    invalid_rows: number;
    createdAt: string;
    status: string;
}

export interface DataSummary {
    totals: { total_citizens: number; single_entries: number; import_files: number; imported_citizens: number; total_admins: number; active_collectors: number };
    users: SummaryUser[];
    imports: { total_files: number; imported_citizens: number; failed: number; history: SummaryImport[] };
    recent: { id: string; user_name: string; user_role: string; action: string; source: string; citizen_id: string; import_job_id?: string | null; created_at: string; changed_fields: string[] }[];
}

export const getCitizenReport = async (): Promise<CitizenReport> => {
    const response = await axiosInstance.get("/reports/citizens");
    return (response as { data: CitizenReport }).data;
};

export const getDataSummary = async (params: Record<string, string>): Promise<DataSummary> => {
    const response = await axiosInstance.get("/reports/summary", { params });
    return (response as { data: DataSummary }).data;
};
