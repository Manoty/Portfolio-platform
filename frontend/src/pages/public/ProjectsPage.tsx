import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Star, ArrowRight, X } from "lucide-react";
import { projectsService } from "@/services/projects.service";
import type { ProjectSummary, Technology, ProjectCategory } from "@/types";
import { PROJECT_CATEGORIES } from "@/types";
import CategoryBadge from "@/components/ui/CategoryBadge";
import Pagination from "@/components/ui/Pagination";
import { SkeletonCard } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { formatDateShort, cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Tab definitions — "All" + the 4 categories
// ---------------------------------------------------------------------------
const TABS = [
  { value: "",                 label: "All" },
  ...PROJECT_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
];

const ORDERING_OPTIONS = [
  { value: "latest",   label: "Latest" },
  { value: "oldest",   label: "Oldest" },
  { value: "featured", label: "Featured First" },
];

// ---------------------------------------------------------------------------
// Project card — shared between grid items
// ---------------------------------------------------------------------------
function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/80 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 shrink-0">
        {project.cover_image ? (
          <img
            src={project.cover_image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🚀</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

        {/* Featured badge — overlaid on image */}
        {project.is_featured && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-sm">
              <Star size={10} className="fill-yellow-900" /> Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        <div className="mb-2.5">
          <CategoryBadge category={project.category} />
        </div>

        <h3 className="font-bold text-gray-900 text-lg mb-1.5 group-hover:text-blue-600 transition-colors duration-200 leading-snug">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.summary}
        </p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech.id}
              className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tech.name}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 text-xs font-medium">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card footer */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">
          {project.project_start ? formatDateShort(project.project_start) : ""}
        </span>
        <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
          View Project <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// PROJECTS PAGE
// ---------------------------------------------------------------------------
export default function ProjectsPage() {
  const [projects, setProjects]       = useState<ProjectSummary[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters
  const [search, setSearch]           = useState(searchParams.get("search") ?? "");
  const [activeTab, setActiveTab]     = useState(searchParams.get("category") ?? "");
  const [selectedTech, setSelectedTech] = useState(searchParams.get("technology") ?? "");
  const [ordering, setOrdering]       = useState(searchParams.get("ordering") ?? "latest");

  const debouncedSearch = useDebounce(search, 400);
  const { page, setPage } = usePagination();
  const totalPages = Math.ceil(total / 12);

  // Load technology list once
  useEffect(() => {
    projectsService.getTechnologies().then(setTechnologies);
  }, []);

  // Load projects whenever filters change
  useEffect(() => {
    setLoading(true);

    const params: Record<string, string | number | boolean> = { page };
    if (debouncedSearch) params.search     = debouncedSearch;
    if (activeTab)       params.category   = activeTab;
    if (selectedTech)    params.technology = selectedTech;
    if (ordering)        params.ordering   = ordering;

    projectsService.list(params).then((data) => {
      setProjects(data.results);
      setTotal(data.count);
      setLoading(false);
    });

    // Sync URL
    const next = new URLSearchParams();
    if (debouncedSearch) next.set("search",     debouncedSearch);
    if (activeTab)       next.set("category",   activeTab);
    if (selectedTech)    next.set("technology", selectedTech);
    if (ordering !== "latest") next.set("ordering", ordering);
    if (page > 1)        next.set("page", String(page));
    setSearchParams(next, { replace: true });
  }, [debouncedSearch, activeTab, selectedTech, ordering, page]);

  // When tab changes, reset to page 1
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1);
  };

  const hasSecondaryFilters = !!selectedTech || ordering !== "latest";

  const clearAll = () => {
    setSearch("");
    setActiveTab("");
    setSelectedTech("");
    setOrdering("latest");
    setPage(1);
  };

  const activeTabLabel = TABS.find((t) => t.value === activeTab)?.label ?? "All";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ------------------------------------------------------------------ */}
      {/* PAGE HEADER                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-0">
          <div className="pt-8 pb-0">
            <h1 className="text-4xl font-black text-gray-900 mb-1">Projects</h1>
            <p className="text-gray-500 font-medium mb-6">
              {loading ? "Loading..." : `${total} project${total !== 1 ? "s" : ""}`}
              {activeTab && ` in ${activeTabLabel}`}
            </p>

            {/* ---- CATEGORY TABS ---- */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px scrollbar-none">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap",
                    "border-b-2 transition-all duration-200 rounded-t-lg",
                    activeTab === tab.value
                      ? "border-blue-600 text-blue-600 bg-blue-50/50"
                      : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {tab.label}
                  {/* Count badge — only shown on non-loading active tab */}
                  {activeTab === tab.value && !loading && total > 0 && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {total}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECONDARY FILTERS — search, technology, ordering                   */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 py-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Technology filter */}
            <select
              value={selectedTech}
              onChange={(e) => { setSelectedTech(e.target.value); setPage(1); }}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 min-w-[170px]"
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
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 min-w-[160px]"
            >
              {ORDERING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Clear button */}
            {(search || hasSecondaryFilters) && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all duration-200 whitespace-nowrap"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* GRID                                                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            title={
              activeTab
                ? `No ${activeTabLabel} projects yet`
                : "No projects found"
            }
            description={
              search || hasSecondaryFilters
                ? "Try adjusting your search or filters."
                : "Check back soon — new projects are on the way."
            }
            action={
              (search || activeTab || hasSecondaryFilters) ? (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <X size={14} /> Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}