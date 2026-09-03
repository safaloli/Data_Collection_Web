export type Size = "sm" | "md" | "lg"

export interface IException {
    code: number;
    data: any;
    message: string;
    status: string;
}