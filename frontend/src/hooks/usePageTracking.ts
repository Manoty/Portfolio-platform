// =============================================================================
// HOOK — Auto-track page views on route change
// =============================================================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analyticsService } from "@/services/analytics.service";
import { getSessionKey } from "../lib/session";

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const sessionKey = getSessionKey();
    const referrer = document.referrer;
    analyticsService.trackPageView(location.pathname, sessionKey, referrer);
  }, [location.pathname]);
}