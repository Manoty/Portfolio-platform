// =============================================================================
// SETTINGS STORE — loads SiteSettings once, available everywhere
// =============================================================================
import { create } from "zustand";
import type { SiteSettings } from "@/types";
import { settingsService } from "@/services/settings.service";

// Fallback defaults so UI never crashes before API loads
const DEFAULTS: SiteSettings = {
  full_name:         "Kevin Manoti",
  tagline:           "Full Stack Engineer",
  bio_short:         "I design and ship production-grade web applications.",
  bio_long:          "",
  bio_long_2:        "",
  location:          "Nairobi, Kenya",
  open_to_work:      true,
  availability_text: "Available for opportunities",
  email:             "kevin@kevinmanoti.dev",
  github_url:        "https://github.com/kevinmanoti",
  linkedin_url:      "https://linkedin.com/in/kevinmanoti",
  twitter_url:       "https://twitter.com/kevinmanoti",
  website_url:       "",
  stat_experience:   "5+",
  stat_projects:     "30+",
  stat_technologies: "20+",
  stat_open_source:  "50+",
  meta_description:  "",
  profile_image:     null,
  updated_at:        "",
};

interface SettingsState {
  settings: SiteSettings;
  loaded: boolean;
  fetch: () => Promise<void>;
  update: (s: SiteSettings) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULTS,
  loaded:   false,

  fetch: async () => {
    try {
      const data = await settingsService.get();
      set({ settings: data, loaded: true });
    } catch {
      set({ loaded: true }); // use defaults silently
    }
  },

  update: (settings) => set({ settings }),
}));