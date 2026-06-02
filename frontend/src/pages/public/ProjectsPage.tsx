import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Star, ArrowRight, X } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { ProjectSummary, Technology } from "@/types";
import Badge from "@/components/ui/Badge";
import Pagination from "@/components/ui/Pagination";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";

const ORDERING_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "featured", label: "Featured First" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedTech, setSelectedTech] = useState(searchParams.get("technology") ?? "");
  const [ordering, setOrdering] = useState(searchParams.get("ordering") ?? "latest");
  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage } = usePagination();
  const totalPages = Math.ceil(total / 12);

  useEffect(() => {
    projectsService.getTechnologies().then(setTechnologies);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | boolean> = { page };
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedTech) params.technology = selectedTech;
    if (ordering) params.ordering = ordering;

    projectsService.list(params).then((data) => {
      setProjects(data.results);
      setTotal(data.count);
      setLoading(false);
    });

    // Sync to URL
    const next = new URLSearchParams();
    if (debouncedSearch) next.set("search", debouncedSearch);
    if (selectedTech) next.set("technology", selectedTech);
    if (ordering !== "latest") next.set("ordering", ordering);
    if (page > 1) next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, selectedTech, ordering, page]);

  const clearFilters = () => {
    setSearch("");
    setSelectedTech("");
    setOrdering("latest");
    setPage(1);
  };

  const hasFilters = !!search || !!selectedTech || ordering !== "latest";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-500">
            {total} project{total !== 1 ? "s" : ""} · everything I've built
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Technology filter */}
          <select
            value={selectedTech}
            onChange={(e) => { setSelectedTech(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            <option value="">All Technologies</option>
            {technologies.map((t) => (
              <option key={t.id} value={t.slug}>{t.name}</option>
            ))}
          </select>

          {/* Ordering */}
          <select
            value={ordering}
            onChange={(e) => { setOrdering(e.target.value); setPage(1); }}
            className="px-3 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[160px]"
          >
            {ORDERING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 bg-white"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <PageSpinner />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="Try adjusting your search or filters."
            action={
              hasFilters ? (
                <button onClick={clearFilters} className="text-blue-600 text-sm hover:underline">
                  Clear all filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.slug}`}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
                    {project.cover_image ? (
                      <img
                        src={project.cover_image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🚀</div>
                    )}
                    {project.is_featured && (
                      <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400/90 text-yellow-900 text-xs font-semibold">
                          <Star size={11} className="fill-yellow-900" /> Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech.id}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                        >
                          {tech.name}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}