import apiClient from "@/lib/axios";
import type { AnalyticsSummary, DailyView, TopItem } from "@/types";

export const analyticsService = {
  trackPageView: async (path: string, sessionKey: string, referrer?: string) => {
    // Fire-and-forget — don't await, don't block UI
    apiClient
      .post("/analytics/track/pageview/", { path, session_key: sessionKey, referrer })
      .catch(() => {}); // silently fail — never break the user's experience
  },

  trackEvent: async (
    eventType: string,
    sessionKey: string,
    objectId?: string,
    objectTitle?: string
  ) => {
    apiClient
      .post("/analytics/track/event/", {
        event_type: eventType,
        session_key: sessionKey,
        object_id: objectId ?? "",
        object_title: objectTitle ?? "",
      })
      .catch(() => {});
  },

  getSummary: async () => {
    const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary/");
    return data;
  },

  getDailyViews: async (days = 30) => {
    const { data } = await apiClient.get<DailyView[]>("/analytics/daily/", {
      params: { days },
    });
    return data;
  },

  getTopProjects: async () => {
    const { data } = await apiClient.get<TopItem[]>("/analytics/top/projects/");
    return data;
  },

  getTopPosts: async () => {
    const { data } = await apiClient.get<TopItem[]>("/analytics/top/posts/");
    return data;
  },
};