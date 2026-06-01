import apiClient from "@/lib/axios";
import type { Resume } from "@/types";

export const resumeService = {
  list: async () => {
    const { data } = await apiClient.get<Resume[]>("/resume/");
    return data;
  },

  upload: async (formData: FormData) => {
    const { data } = await apiClient.post<Resume>("/resume/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: number, payload: Partial<Resume>) => {
    const { data } = await apiClient.patch<Resume>(`/resume/${id}/`, payload);
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/resume/${id}/`);
  },

  // Public — triggers tracked download
  downloadUrl: () => "/api/resume/download/",
};