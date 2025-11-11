import { create } from "zustand";

interface BuilderState {
  history: any[];
  currentIndex: number;
  templateData: any;
  selectedComponent: string | null;
  pushState: (state: any) => void;
  undo: () => void;
  redo: () => void;
  setTemplateData: (data: any) => void;
  setSelectedComponent: (id: string | null) => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  history: [],
  currentIndex: -1,
  templateData: {},
  selectedComponent: null,
  pushState: (state) => {
    const { history, currentIndex } = get();
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(state);
    set({
      history: newHistory,
      currentIndex: newHistory.length - 1,
      templateData: state,
    });
  },
  undo: () => {
    const { history, currentIndex } = get();
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      set({
        currentIndex: newIndex,
        templateData: history[newIndex],
      });
    }
  },
  redo: () => {
    const { history, currentIndex } = get();
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      set({
        currentIndex: newIndex,
        templateData: history[newIndex],
      });
    }
  },
  setTemplateData: (data) => {
    set({ templateData: data });
    get().pushState(data);
  },
  setSelectedComponent: (id) => set({ selectedComponent: id }),
}));

