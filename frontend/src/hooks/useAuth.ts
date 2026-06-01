// =============================================================================
// HOOK — Auth guard logic, re-exported for convenience
// =============================================================================
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout, fetchMe } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === "admin",
    isEditor: user?.role === "editor",
    login,
    logout,
    fetchMe,
  };
}