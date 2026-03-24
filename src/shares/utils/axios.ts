import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import qs from "qs";

// Instance này CHỈ dùng để gọi refresh token, không đính kèm Interceptor đính token cũ
export const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
});

// ===== Main API =====
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "true",
    Accept: "application/json",
  },
  paramsSerializer: (params) =>
    qs.stringify(params, {
      arrayFormat: "repeat",
    }),
});

// ===== Request interceptor =====
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ===== Refresh token handling =====
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Kiểm tra điều kiện: Lỗi 401 VÀ không phải là API login/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Gọi refresh token
        const res = await refreshApi.post("/auth/refresh-token");
        const newToken = res.data?.data?.accessToken;

        if (!newToken) throw new Error("No token returned");

        // Cập nhật Store và Cookie
        useAuthStore.getState().setAccessToken(newToken);
        const decoded = jwtDecode(newToken) as any;
        Cookies.set("accessToken", newToken, {
          expires: new Date(decoded.exp * 1000),
          path: "/",
          sameSite: "strict",
        });

        // Giải tỏa hàng đợi
        queue.forEach((cb) => cb.resolve(newToken));
        queue = [];
        isRefreshing = false;

        // Cập nhật header cho request hiện tại và thực hiện lại
        // Dùng cách này để đảm bảo header được ghi đè hoàn toàn
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (err) {
        isRefreshing = false;
        queue.forEach((cb) => cb.reject(err));
        queue = [];

        // Nếu refresh thất bại -> Logout
        useAuthStore.getState().logout();
        Cookies.remove("accessToken");

        // Chỉ redirect nếu đang ở môi trường client
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
