import apiClient from "@/lib/axios";
import type { SiteSettings } from "@/types";

export const settingsService = {
  get: async (): Promise<SiteSettings> => {
    const { data } = await apiClient.get<SiteSettings>("/core/settings/");
    return data;
  },

  update: async (payload: FormData | Partial<SiteSettings>): Promise<SiteSettings> => {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.patch<SiteSettings>(
      "/core/settings/",
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );
    return data;
  },
};