import axios from "axios";
import AppConfig from "./app.config";
import Cookies from "js-cookie"

const axiosInstance = axios.create({
    baseURL: AppConfig.baseUrl,
    timeout: 30000, // 30sec
    timeoutErrorMessage: "Server timed out...",
    responseType: "json",
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use((req) => {
    const token = Cookies.get(AppConfig.accessToken)
    if (token) {
        req.headers.Authorization = "Bearer " + token
    }
    return req
})

axiosInstance.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    const payload = error?.response?.data ?? {
        code: error?.status ?? 500,
        message: error?.message ?? "Request failed.",
        status: "REQUEST_FAILED",
    };

    throw payload;
})

export default axiosInstance