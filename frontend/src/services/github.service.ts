// =============================================================================
// GITHUB SERVICE — Frontend API calls for the GitHub import feature
// =============================================================================
import apiClient from "@/lib/axios";
import type {
  GitHubReposResponse,
  GitHubImportResult,
  GitHubValidateResponse,
} from "@/types";

export const githubService = {
  /**
   * Validate a GitHub username before saving.
   * Returns { valid, username, message } or throws with error details.
   */
  validateUsername: async (username: string): Promise<GitHubValidateResponse> => {
    const { data } = await apiClient.post<GitHubValidateResponse>(
      "/projects/github/validate-username/",
      { username }
    );
    return data;
  },

  /**
   * Fetch repositories for the configured GitHub username.
   * Optional params: search string, include_forks flag.
   */
  fetchRepos: async (params?: {
    search?:        string;
    include_forks?: boolean;
    username?:      string;
  }): Promise<GitHubReposResponse> => {
    const { data } = await apiClient.get<GitHubReposResponse>(
      "/projects/github/repos/",
      { params }
    );
    return data;
  },

  /**
   * Import selected repositories as draft projects.
   * @param repo_ids — array of GitHub repository IDs to import
   */
  importRepos: async (repo_ids: number[]): Promise<GitHubImportResult> => {
    const { data } = await apiClient.post<GitHubImportResult>(
      "/projects/github/import/",
      { repo_ids }
    );
    return data;
  },
};