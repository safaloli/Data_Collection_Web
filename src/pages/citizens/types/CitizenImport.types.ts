export type ImportRowStatus = "VALID" | "INVALID" | "DUPLICATE_IN_FILE" | "DUPLICATE_IN_DATABASE";
export type DuplicateStrategy = "SKIP";
export interface ImportRowError { field: string; message: string }
export interface ImportPreviewRow { row_number: number; data: Record<string, unknown>; status: ImportRowStatus; errors: ImportRowError[] }
export interface ImportSummary { total_rows: number; valid_rows: number; invalid_rows: number; duplicate_in_file: number; duplicate_in_database: number }
export interface ImportPreview { import_job_id: string; file_name: string; summary: ImportSummary; rows: ImportPreviewRow[] }
export interface ImportResult { import_job_id: string; summary: { total_rows: number; imported_rows: number; skipped_rows: number; failed_rows: number } }
