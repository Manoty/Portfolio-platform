// =============================================================================
// HOOK — URL-synced pagination
// =============================================================================
import { useSearchParams } from "react-router-dom";

export function usePagination(defaultPage = 1) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? String(defaultPage), 10);

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { page, setPage };
}