import apiClient from "@/lib/axios";
import type { ContactFormData, ContactMessage, PaginatedResponse, MessageQueryParams } from "@/types";

export const contactService = {
  submit: async (payload: ContactFormData) => {
    await apiClient.post("/contact/", payload);
  },

  list: async (params: MessageQueryParams = {}) => {
    const { data } = await apiClient.get<PaginatedResponse<ContactMessage>>(
      "/contact/messages/",
      { params }
    );
    return data;
  },

  get: async (id: string) => {
    const { data } = await apiClient.get<ContactMessage>(`/contact/messages/${id}/`);
    return data;
  },

  updateStatus: async (id: string, status: ContactMessage["status"]) => {
    const { data } = await apiClient.patch<ContactMessage>(
      `/contact/messages/${id}/`,
      { status }
    );
    return data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/contact/messages/${id}/`);
  },
};