import { create } from "zustand";
import type { TemplateComponent, TemplateSchema } from "../shared/types/template";

interface BuilderState {
  // Current template data
  templateData: TemplateSchema | null;

  // Component selection
  selectedComponentId: string | null;

  // History for undo/redo
  history: TemplateSchema[];
  historyIndex: number;

  // Actions
  setTemplateData: (data: TemplateSchema) => void;
  selectComponent: (id: string | null) => void;

  // Component manipulation
  addComponent: (component: TemplateComponent, index?: number) => void;
  updateComponent: (id: string, updates: Partial<TemplateComponent>) => void;
  removeComponent: (id: string) => void;
  reorderComponent: (id: string, newIndex: number) => void;

  // Undo/redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Reset
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  templateData: null,
  selectedComponentId: null,
  history: [],
  historyIndex: -1,

  setTemplateData: (data) => {
    set({
      templateData: data,
      history: [data],
      historyIndex: 0,
    });
  },

  selectComponent: (id) => {
    set({ selectedComponentId: id });
  },

  addComponent: (component, index) => {
    const { templateData, history, historyIndex } = get();
    if (!templateData) return;

    const newComponents = [...templateData.components];
    if (index !== undefined) {
      newComponents.splice(index, 0, component);
    } else {
      newComponents.push(component);
    }

    const newTemplateData: TemplateSchema = {
      ...templateData,
      components: newComponents,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTemplateData);

    set({
      templateData: newTemplateData,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateComponent: (id, updates) => {
    const { templateData, history, historyIndex } = get();
    if (!templateData) return;

    const newComponents = templateData.components.map((comp) =>
      comp.id === id ? { ...comp, ...updates } : comp
    );

    const newTemplateData: TemplateSchema = {
      ...templateData,
      components: newComponents,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTemplateData);

    set({
      templateData: newTemplateData,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  removeComponent: (id) => {
    const { templateData, history, historyIndex, selectedComponentId } = get();
    if (!templateData) return;

    const newComponents = templateData.components.filter(
      (comp) => comp.id !== id
    );

    const newTemplateData: TemplateSchema = {
      ...templateData,
      components: newComponents,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTemplateData);

    set({
      templateData: newTemplateData,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedComponentId: selectedComponentId === id ? null : selectedComponentId,
    });
  },

  reorderComponent: (id, newIndex) => {
    const { templateData, history, historyIndex } = get();
    if (!templateData) return;

    const components = [...templateData.components];
    const oldIndex = components.findIndex((comp) => comp.id === id);
    if (oldIndex === -1) return;

    const [component] = components.splice(oldIndex, 1);
    components.splice(newIndex, 0, component);

    const newTemplateData: TemplateSchema = {
      ...templateData,
      components,
    };

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newTemplateData);

    set({
      templateData: newTemplateData,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        templateData: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        templateData: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  canUndo: () => {
    const { historyIndex } = get();
    return historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  reset: () => {
    set({
      templateData: null,
      selectedComponentId: null,
      history: [],
      historyIndex: -1,
    });
  },
}));
