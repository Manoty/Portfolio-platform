import apiClient from "@/lib/axios";
import type { User } from "@/types";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post<{ user: User; detail: string }>(
      "/auth/login/",
      { email, password }
    );
    return data;
  },

  logout: async () => {
    await apiClient.post("/auth/logout/");
  },

  me: async () => {
    const { data } = await apiClient.get<User>("/auth/me/");
    return data;
  },

  updateMe: async (payload: Partial<Pick<User, "first_name" | "last_name">>) => {
    const { data } = await apiClient.patch<User>("/auth/me/", payload);
    return data;
  },

  changePassword: async (old_password: string, new_password: string) => {
    await apiClient.post("/auth/change-password/", { old_password, new_password });
  },

  requestPasswordReset: async (email: string) => {
    await apiClient.post("/auth/reset-password/", { email });
  },

  confirmPasswordReset: async (token: string, new_password: string) => {
    await apiClient.post("/auth/reset-password/confirm/", { token, new_password });
  },
};