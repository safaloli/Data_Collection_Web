import axiosInstance from "../../config/axios.config";
import type { DashboardData } from "./dashboard.types";

interface DashboardResponse { data: DashboardData }

export const getDashboardData = async (period = "30d"): Promise<DashboardData> => {
    const response = await axiosInstance.get(`/dashboard?period=${period}`) as DashboardResponse;
    return response.data;
};
