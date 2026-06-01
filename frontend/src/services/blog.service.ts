import apiClient from "@/lib/axios";
import type {
  Post, PostSummary, Category, Tag,
  PaginatedResponse, PostQueryParams,
} from "@/types";

export const blogService = {
  list: async (params: PostQueryParams = {}) => {
    const { data } = await apiClient.get<PaginatedResponse<PostSummary>>(
      "/blog/",
      { params }
    );
    return data;
  },

  get: async (slug: string) => {
    const { data } = await apiClient.get<Post>(`/blog/${slug}/`);
    return data;
  },

  create: async (payload: FormData) => {
    const { data } = await apiClient.post<Post>("/blog/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (slug: string, payload: FormData | Partial<Post>) => {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.patch<Post>(
      `/blog/${slug}/`,
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );
    return data;
  },

  delete: async (slug: string) => {
    await apiClient.delete(`/blog/${slug}/`);
  },

  getCategories: async () => {
    const { data } = await apiClient.get<Category[]>("/blog/meta/categories/");
    return data;
  },

  createCategory: async (payload: Partial<Category>) => {
    const { data } = await apiClient.post<Category>("/blog/meta/categories/", payload);
    return data;
  },

  getTags: async () => {
    const { data } = await apiClient.get<Tag[]>("/blog/meta/tags/");
    return data;
  },

  createTag: async (payload: Partial<Tag>) => {
    const { data } = await apiClient.post<Tag>("/blog/meta/tags/", payload);
    return data;
  },
};