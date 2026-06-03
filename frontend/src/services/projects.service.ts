import apiClient from "@/lib/axios";
import type {
  Project, ProjectSummary, Technology, Skill, Experience,
  PaginatedResponse, ProjectQueryParams,
} from "@/types";

export const projectsService = {
  list: async (params: ProjectQueryParams = {}) => {
    const { data } = await apiClient.get<PaginatedResponse<ProjectSummary>>(
      "/projects/",
      { params }
    );
    return data;
  },

  get: async (slug: string) => {
    const { data } = await apiClient.get<Project>(`/projects/${slug}/`);
    return data;
  },

  create: async (payload: FormData) => {
    const { data } = await apiClient.post<Project>("/projects/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (slug: string, payload: FormData | Partial<Project>) => {
    const isFormData = payload instanceof FormData;
    const { data } = await apiClient.patch<Project>(
      `/projects/${slug}/`,
      payload,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {}
    );
    return data;
  },

  delete: async (slug: string) => {
    await apiClient.delete(`/projects/${slug}/`);
  },

  addImage: async (slug: string, formData: FormData) => {
    const { data } = await apiClient.post(
      `/projects/${slug}/images/`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data;
  },

  deleteImage: async (slug: string, imageId: number) => {
    await apiClient.delete(`/projects/${slug}/images/${imageId}/`);
  },

  // Meta
  getTechnologies: async () => {
    const { data } = await apiClient.get<Technology[]>("/projects/meta/technologies/");
    return data;
  },

  createTechnology: async (payload: Partial<Technology>) => {
    const { data } = await apiClient.post<Technology>("/projects/meta/technologies/", payload);
    return data;
  },

  updateTechnology: async (id: number, payload: Partial<Technology>) => {
    const { data } = await apiClient.patch<Technology>(
      `/projects/meta/technologies/${id}/`,
      payload
    );
    return data;
  },

  deleteTechnology: async (id: number) => {
    await apiClient.delete(`/projects/meta/technologies/${id}/`);
  },

  getSkills: async () => {
    const { data } = await apiClient.get<Skill[]>("/projects/meta/skills/");
    return data;
  },

  createSkill: async (payload: Omit<Skill, "id">) => {
    const { data } = await apiClient.post<Skill>("/projects/meta/skills/", payload);
    return data;
  },

  updateSkill: async (id: number, payload: Partial<Skill>) => {
    const { data } = await apiClient.patch<Skill>(`/projects/meta/skills/${id}/`, payload);
    return data;
  },

  deleteSkill: async (id: number) => {
    await apiClient.delete(`/projects/meta/skills/${id}/`);
  },

  getExperience: async () => {
    const { data } = await apiClient.get<Experience[]>("/projects/meta/experience/");
    return data;
  },

  createExperience: async (payload: Omit<Experience, "id">) => {
    const { data } = await apiClient.post<Experience>("/projects/meta/experience/", payload);
    return data;
  },

  updateExperience: async (id: number, payload: Partial<Experience>) => {
    const { data } = await apiClient.patch<Experience>(
      `/projects/meta/experience/${id}/`,
      payload
    );
    return data;
  },

  deleteExperience: async (id: number) => {
    await apiClient.delete(`/projects/meta/experience/${id}/`);
  },
};