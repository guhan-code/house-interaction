import { create } from "zustand";
import { DEFAULT_CONFIG, type DesignConfig, type ElementType } from "./materials";

interface CustomizerState {
  config: DesignConfig;
  selectedElement: ElementType | null;
  isNight: boolean;
  savedDesigns: { id: string; name: string; config: DesignConfig }[];
  loadingDesigns: boolean;

  selectElement: (el: ElementType | null) => void;
  setOption: (element: ElementType, optionId: string) => void;
  toggleNight: () => void;
  resetConfig: () => void;
  loadConfig: (config: DesignConfig) => void;
  fetchDesigns: () => Promise<void>;
  saveDesign: (name: string) => Promise<void>;
  deleteDesign: (id: string) => Promise<void>;
}

export const useStore = create<CustomizerState>((set, get) => ({
  config: { ...DEFAULT_CONFIG },
  selectedElement: null,
  isNight: false,
  savedDesigns: [],
  loadingDesigns: false,

  selectElement: (el) => set({ selectedElement: el }),
  setOption: (element, optionId) =>
    set((state) => ({
      config: { ...state.config, [element]: optionId },
    })),
  toggleNight: () => set((state) => ({ isNight: !state.isNight })),
  resetConfig: () => set({ config: { ...DEFAULT_CONFIG } }),
  loadConfig: (config) => set({ config }),

  fetchDesigns: async () => {
    set({ loadingDesigns: true });
    try {
      const { supabase } = await import("./supabase");
      const { data, error } = await supabase
        .from("designs")
        .select("id, name, config")
        .order("created_at", { ascending: false });
      if (error) throw error;
      set({ savedDesigns: (data as { id: string; name: string; config: DesignConfig }[]) ?? [] });
    } catch (e) {
      console.error("Failed to fetch designs:", e);
    } finally {
      set({ loadingDesigns: false });
    }
  },

  saveDesign: async (name: string) => {
    try {
      const { supabase } = await import("./supabase");
      const config = get().config;
      const { data, error } = await supabase
        .from("designs")
        .insert({ name, config })
        .select("id, name, config")
        .single();
      if (error) throw error;
      set((state) => ({
        savedDesigns: [data as { id: string; name: string; config: DesignConfig }, ...state.savedDesigns],
      }));
    } catch (e) {
      console.error("Failed to save design:", e);
      throw e;
    }
  },

  deleteDesign: async (id: string) => {
    try {
      const { supabase } = await import("./supabase");
      const { error } = await supabase.from("designs").delete().eq("id", id);
      if (error) throw error;
      set((state) => ({ savedDesigns: state.savedDesigns.filter((d) => d.id !== id) }));
    } catch (e) {
      console.error("Failed to delete design:", e);
    }
  },
}));
