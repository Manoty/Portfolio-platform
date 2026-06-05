// =============================================================================
// GITHUB IMPORT PAGE — Admin: fetch and import GitHub repositories as drafts
// =============================================================================
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, ArrowLeft, ArrowRight,
  Star, GitFork, CheckCircle, AlertCircle, Info,
  ExternalLink, X, Download,
} from "lucide-react";
import { githubService } from "@/services/github.service";
import { useSettingsStore } from "@/store/settings.store";
import type { GitHubRepository, GitHubImportResult } from "@/types";
import Button from "@/components/ui/Button";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate, cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Language color map — visual indicator on repo cards
// ---------------------------------------------------------------------------
const LANGUAGE_COLORS: Record<string, string> = {
  Python:     "bg-blue-500",
  TypeScript: "bg-blue-600",
  JavaScript: "bg-yellow-400",
  Go:         "bg-cyan-500",
  Rust:       "bg-orange-600",
  Java:       "bg-red-500",
  "C++":      "bg-pink-600",
  C:          "bg-gray-600",
  Ruby:       "bg-red-600",
  PHP:        "bg-indigo-500",
  Swift:      "bg-orange-500",
  Kotlin:     "bg-purple-500",
  Dart:       "bg-cyan-400",
  Shell:      "bg-green-600",
  HTML:       "bg-orange-400",
  CSS:        "bg-blue-400",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function RepoCard({
  repo,
  selected,
  onToggle,
}: {
  repo:     GitHubRepository;
  selected: boolean;
  onToggle: () => void;
}) {
  const langColor = repo.language ? (LANGUAGE_COLORS[repo.language] ?? "bg-gray-400") : null;
  const isDisabled = repo.already_imported;

  return (
    <div
      onClick={isDisabled ? undefined : onToggle}
      className={cn(
        "relative flex items-start gap-4 px-5 py-4 rounded-2xl border transition-all duration-200",
        isDisabled
          ? "bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed"
          : selected
          ? "bg-blue-50 border-blue-300 shadow-sm shadow-blue-100 cursor-pointer"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer"
      )}
    >
      {/* Checkbox */}
      <div className={cn(
        "mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
        isDisabled
          ? "bg-gray-100 border-gray-300"
          : selected
          ? "bg-blue-600 border-blue-600"
          : "border-gray-300 hover:border-blue-400"
      )}>
        {isDisabled ? (
          <CheckCircle size={12} className="text-gray-400" />
        ) : selected ? (
          <CheckCircle size={12} className="text-white" />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm"
            >
              {repo.name}
              <ExternalLink size={12} className="text-gray-400 shrink-0" />
            </a>
            {repo.already_imported && (
              <Badge variant="success">
                <CheckCircle size={10} className="mr-1" /> Imported
              </Badge>
            )}
            {repo.is_archived && (
              <Badge variant="warning">Archived</Badge>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {repo.stargazers_count > 0 && (
              <span className="flex items-center gap-1">
                <Star size={11} /> {repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span className="flex items-center gap-1">
                <GitFork size={11} /> {repo.forks_count}
              </span>
            )}
          </div>
        </div>

        {repo.description && (
          <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {repo.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-2.5 flex-wrap">
          {/* Language */}
          {repo.language && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <span className={cn("w-2.5 h-2.5 rounded-full", langColor ?? "bg-gray-400")} />
              {repo.language}
            </span>
          )}

          {/* Topics */}
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 3 && (
            <span className="text-xs text-gray-400">+{repo.topics.length - 3} more</span>
          )}

          {/* Updated */}
          <span className="text-xs text-gray-400 ml-auto">
            Updated {repo.pushed_at ? formatDate(repo.pushed_at) : "recently"}
          </span>
        </div>
      </div>
    </div>
  );
}


function ImportResultPanel({
  result,
  onDone,
}: {
  result:  GitHubImportResult;
  onDone:  () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Imported */}
      {result.imported.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <h3 className="font-bold text-green-800">
              {result.imported.length} project{result.imported.length !== 1 ? "s" : ""} imported successfully
            </h3>
          </div>
          <div className="space-y-2">
            {result.imported.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 bg-white rounded-xl px-4 py-2.5 border border-green-100">
                <span className="text-sm font-semibold text-gray-800">{p.title}</span>
                <Link
                  to={`/admin/projects/${p.slug}/edit`}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Edit <ArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skipped */}
      {result.skipped.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-yellow-600 shrink-0" />
            <h3 className="font-bold text-yellow-800">
              {result.skipped.length} skipped (already imported)
            </h3>
          </div>
          <div className="space-y-1.5">
            {result.skipped.map((s) => (
              <div key={s.repo_id} className="flex items-center gap-2 text-sm text-yellow-700">
                <span className="font-medium">{s.name}</span>
                <span className="text-yellow-600 text-xs">— {s.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Errors */}
      {result.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-red-600 shrink-0" />
            <h3 className="font-bold text-red-800">
              {result.errors.length} failed to import
            </h3>
          </div>
          <div className="space-y-1.5">
            {result.errors.map((e, i) => (
              <div key={i} className="text-sm text-red-700">
                <span className="font-medium">{e.name ?? `Repo #${e.repo_id}`}</span>
                <span className="text-red-600 text-xs ml-2">— {e.reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {result.imported.length > 0 && (
          <Button onClick={() => navigate("/admin/projects")}>
            View Draft Projects <ArrowRight size={15} />
          </Button>
        )}
        <Button variant="outline" onClick={onDone}>
          Import More
        </Button>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// MAIN PAGE
// ---------------------------------------------------------------------------
export default function GitHubImportPage() {
  const { settings } = useSettingsStore();
  const navigate     = useNavigate();

  // State
  const [repos, setRepos]                 = useState<GitHubRepository[]>([]);
  const [loading, setLoading]             = useState(false);
  const [loadError, setLoadError]         = useState<{ code: string; message: string } | null>(null);
  const [search, setSearch]               = useState("");
  const [includeForks, setIncludeForks]   = useState(false);
  const [selectedIds, setSelectedIds]     = useState<Set<number>>(new Set());
  const [importing, setImporting]         = useState(false);
  const [importResult, setImportResult]   = useState<GitHubImportResult | null>(null);

  const username = settings.github_username;

  // Load repos on mount if username is configured
  useEffect(() => {
    if (username) {
      loadRepos();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRepos = async () => {
    setLoading(true);
    setLoadError(null);
    setSelectedIds(new Set());
    setImportResult(null);
    try {
      const data = await githubService.fetchRepos({ include_forks: includeForks });
      setRepos(data.repos);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error_code: string; error_message: string } } };
      const errData = axiosErr?.response?.data;
      setLoadError({
        code:    errData?.error_code    ?? "UNKNOWN",
        message: errData?.error_message ?? "Failed to load repositories.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when include_forks changes
  useEffect(() => {
    if (repos.length > 0 || loadError) {
      loadRepos();
    }
  }, [includeForks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter repos by search
  const filteredRepos = useMemo(() => {
    if (!search.trim()) return repos;
    const q = search.toLowerCase();
    return repos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q)) ||
        (r.language ?? "").toLowerCase().includes(q)
    );
  }, [repos, search]);

  // Selectable repos (not yet imported)
  const selectableRepos   = filteredRepos.filter((r) => !r.already_imported);
  const importedCount     = filteredRepos.filter((r) => r.already_imported).length;
  const allSelected       = selectableRepos.length > 0 && selectableRepos.every((r) => selectedIds.has(r.id));
  const someSelected      = selectedIds.size > 0;

  const toggleRepo = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(selectableRepos.map((r) => r.id)));
    }
  };

  const handleImport = async () => {
    if (!someSelected) return;
    setImporting(true);
    try {
      const result = await githubService.importRepos(Array.from(selectedIds));
      setImportResult(result);
      // Reload repos to update "already imported" status
      if (result.imported.length > 0) {
        await loadRepos();
      }
    } catch (err: unknown) {
      setImportResult({
        imported: [],
        skipped:  [],
        errors: [{
          repo_id: 0,
          reason:  "Import failed due to a network or server error. Please try again.",
        }],
      });
    } finally {
      setImporting(false);
      setSelectedIds(new Set());
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!username) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/settings")}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Import from GitHub</h1>
        </div>

        <EmptyState
          icon={<ExternalLink size={36} className="text-gray-400" />}
          title="GitHub username not configured"
          description="Set your GitHub username in Site Settings before importing repositories."
          action={
            <Link to="/admin/settings">
              <Button>Go to Site Settings <ArrowRight size={15} /></Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/projects")}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import from GitHub</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Importing from {" "}
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{username}
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/settings">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors">
              Change Username
            </button>
          </Link>
          <button
            onClick={loadRepos}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Workflow hint */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
        <Info size={14} className="shrink-0 text-blue-500" />
        <span>
          Selected repositories will be created as <strong>Draft</strong> projects.
          Review and edit them at <Link to="/admin/projects" className="text-blue-600 hover:underline">Projects</Link> before publishing.
        </span>
      </div>

      {/* Import result panel */}
      {importResult && !importing && (
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Import Results</h2>
          </CardHeader>
          <CardBody>
            <ImportResultPanel
              result={importResult!}
              onDone={() => { setImportResult(null); loadRepos(); }}
            />
          </CardBody>
        </Card>
      )}

      {/* Load error */}
      {loadError && !loading && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-5">
          <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 text-sm">{loadError?.message}</p>
            {loadError?.code === "NO_USERNAME" && (
              <Link to="/admin/settings" className="text-xs text-blue-600 hover:underline mt-1 block">
                Configure GitHub username →
              </Link>
            )}
            {loadError?.code === "RATE_LIMITED" && (
              <p className="text-xs text-red-600 mt-1">
                Add a GITHUB_TOKEN environment variable to increase rate limits.
              </p>
            )}
            <button
              onClick={loadRepos}
              className="mt-2 text-xs font-semibold text-red-700 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Repos list */}
      {!loadError && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                {/* Select all checkbox */}
                <button
                  onClick={toggleAll}
                  disabled={loading || selectableRepos.length === 0}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                    allSelected
                      ? "bg-blue-600 border-blue-600"
                      : someSelected
                      ? "bg-blue-200 border-blue-400"
                      : "border-gray-300 hover:border-blue-400",
                    "disabled:opacity-40 disabled:cursor-not-allowed"
                  )}
                >
                  {(allSelected || someSelected) && (
                    <CheckCircle size={12} className="text-white" />
                  )}
                </button>
                <span className="text-sm font-semibold text-gray-700">
                  {loading ? "Loading repositories..." : (
                    <>
                      {filteredRepos.length} repos
                      {importedCount > 0 && (
                        <span className="text-gray-400 font-normal"> · {importedCount} already imported</span>
                      )}
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search repos..."
                    className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-48"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Include forks toggle */}
                <button
                  onClick={() => setIncludeForks(!includeForks)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all",
                    includeForks
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <GitFork size={13} />
                  {includeForks ? "Forks: On" : "Forks: Off"}
                </button>
              </div>
            </div>
          </CardHeader>

          <CardBody className="p-3">
            {loading ? (
              <PageSpinner />
            ) : filteredRepos.length === 0 ? (
              <EmptyState
                title={search ? "No repositories match your search" : "No repositories found"}
                description={
                  search
                    ? "Try a different search term."
                    : `No public repositories found for @${username}.`
                }
                action={
                  search ? (
                    <button onClick={() => setSearch("")} className="text-blue-600 text-sm hover:underline">
                      Clear search
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="space-y-2">
                {filteredRepos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    selected={selectedIds.has(repo.id)}
                    onToggle={() => toggleRepo(repo.id)}
                  />
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Sticky bottom action bar */}
      {someSelected && !importing && !importResult && (
        <div className="sticky bottom-4 z-30">
          <div className="bg-gray-950/95 backdrop-blur-sm border border-gray-800 rounded-2xl px-6 py-4 flex items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                {selectedIds.size}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">
                  {selectedIds.size} repo{selectedIds.size !== 1 ? "s" : ""} selected
                </p>
                <p className="text-gray-400 text-xs">
                  Will be created as Draft projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-gray-400 text-sm hover:text-gray-200 transition-colors"
              >
                Clear selection
              </button>
              <Button onClick={handleImport} loading={importing}>
                <Download size={15} /> Import {selectedIds.size} Project{selectedIds.size !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}