import axiosInstance from "../config/axios.config";
import type { DuplicateStrategy, ImportPreview, ImportResult } from "../pages/citizens/types/CitizenImport.types";

const unwrap = <T>(response: unknown): T => (response as { data: T }).data;
export const previewCitizenImport = async (file: File, address: Record<string, number>) => { const form = new FormData(); form.append("file", file); Object.entries(address).forEach(([key, value]) => form.append(key, String(value))); return unwrap<ImportPreview>(await axiosInstance.post("/citizens/import/preview", form, { headers: { "Content-Type": "multipart/form-data" } })); };
export const confirmCitizenImport = async (id: string, duplicate_strategy: DuplicateStrategy) => unwrap<ImportResult>(await axiosInstance.post(`/citizens/import/${id}/confirm`, { duplicate_strategy }));
export const cancelCitizenImport = async (id: string) => unwrap(await axiosInstance.post(`/citizens/import/${id}/cancel`));
export const downloadCitizenImportTemplate = () => axiosInstance.get("/citizens/import/template", { responseType: "blob" });
export const downloadCitizenImportErrors = (id: string) => axiosInstance.get(`/citizens/imports/${id}/errors`, { responseType: "blob" });
