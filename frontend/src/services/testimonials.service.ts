import apiClient from "@/lib/axios";
import type { Testimonial } from "@/types";

export const testimonialsService = {
  list: async (params: { featured?: boolean; all?: boolean } = {}) => {
    const { data } = await apiClient.get<Testimonial[]>("/testimonials/", { params });
    return data;
  },

  create: async (formData: FormData) => {
    const { data } = await apiClient.post<Testimonial>("/testimonials/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: number, payload: FormData | Partial<Testimonial>) => {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.patch<Testimonial>(
      `/testimonials/${id}/`,
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );
    return data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/testimonials/${id}/`);
  },
};