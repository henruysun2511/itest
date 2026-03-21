import { useAuthStore } from "@/stores/useAuthStore";
import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import qs from "qs";

// Instance này CHỈ dùng để gọi refresh token, không đính kèm Interceptor đính token cũ
export const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

// ===== Main API =====
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
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
  console.log(accessToken)

  return config;
});

// ===== Refresh token handling =====
let isRefreshing = false;
let queue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token: string) => {
              originalRequest.headers!.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => {
              reject(err);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await refreshApi.post("/auth/refresh-token");
        const newToken = res.data?.data?.accessToken;

        if (!newToken) throw new Error("No token returned from refresh endpoint");

        // Cập nhật Zustand
        useAuthStore.getState().setAccessToken(newToken);

        // Cập nhật Cookie cho Next.js middleware
        const expires = new Date(new Date().getTime() + 30 * 60 * 1000); // 30 mins
        Cookies.set("accessToken", newToken, {
          expires: expires,
          path: "/",
          sameSite: "strict"
        });

        queue.forEach((cb) => cb.resolve(newToken));
        queue = [];

        originalRequest.headers!.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        queue.forEach((cb) => cb.reject(err));
        queue = [];

        useAuthStore.getState().logout();
        Cookies.remove("accessToken");

        // window.location.href = "/auth/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;