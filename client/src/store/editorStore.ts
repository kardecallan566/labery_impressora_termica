/**
 * Editor Store - Global state management using Zustand
 * Manages ZPL code, elements, canvas state, and undo/redo
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  ZPLElement,
  LabelConfig,
  PrinterConfig,
  HistoryEntry,
  ThermalMode,
  DPI,
} from '@/lib/zpl/types';

// ============================================================================
// TYPES
// ============================================================================

export interface EditorState {
  // Document
  zplCode: string;
  elements: ZPLElement[];
  selectedElementIds: string[];
  hoveredElementId: string | null;

  // Canvas
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  showRuler: boolean;
  snapToGrid: boolean;
  gridSize: number;

  // Configuration
  labelConfig: LabelConfig;
  printerConfig: PrinterConfig;

  // Thermal optimization
  thermalMode: ThermalMode;
  autoOptimize: boolean;

  // History
  history: HistoryEntry[];
  historyIndex: number;

  // UI
  showCodeEditor: boolean;
  showPreview: boolean;
  showProperties: boolean;
  darkMode: boolean;

  // Actions
  setZPLCode: (code: string) => void;
  setElements: (elements: ZPLElement[]) => void;
  addElement: (element: ZPLElement) => void;
  updateElement: (id: string, updates: Partial<ZPLElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  deselectAll: () => void;
  setHoveredElement: (id: string | null) => void;

  // Canvas
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setShowGrid: (show: boolean) => void;
  setShowRuler: (show: boolean) => void;
  setSnapToGrid: (snap: boolean) => void;
  setGridSize: (size: number) => void;

  // Configuration
  setLabelConfig: (config: Partial<LabelConfig>) => void;
  setPrinterConfig: (config: Partial<PrinterConfig>) => void;

  // Thermal
  setThermalMode: (mode: ThermalMode) => void;
  setAutoOptimize: (auto: boolean) => void;

  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // UI
  toggleCodeEditor: () => void;
  togglePreview: () => void;
  toggleProperties: () => void;
  toggleDarkMode: () => void;

  // Utilities
  reset: () => void;
  exportState: () => string;
  importState: (json: string) => void;
}

// ============================================================================
// DEFAULT STATE
// ============================================================================

const defaultLabelConfig: LabelConfig = {
  width: 100,
  height: 150,
  dpi: 203,
  mediaType: 'label',
  printSpeed: 'normal',
  density: 15,
  darkness: 15,
  printDirection: 'normal',
  labelOffset: 0,
  printMode: 'thermal',
};

const defaultPrinterConfig: PrinterConfig = {
  brand: 'zebra',
  model: 'ZM400',
  dpi: 203,
  maxWidth: 104,
  maxHeight: 152,
  nativeResolution: 203,
};

// ============================================================================
// STORE
// ============================================================================

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        zplCode: '^XA\n^XZ',
        elements: [],
        selectedElementIds: [],
        hoveredElementId: null,

        zoom: 1,
        panX: 0,
        panY: 0,
        showGrid: true,
        showRuler: true,
        snapToGrid: true,
        gridSize: 10,

        labelConfig: defaultLabelConfig,
        printerConfig: defaultPrinterConfig,

        thermalMode: 'normal',
        autoOptimize: false,

        history: [],
        historyIndex: -1,

        showCodeEditor: false,
        showPreview: true,
        showProperties: true,
        darkMode: false,

        // ====================================================================
        // DOCUMENT ACTIONS
        // ====================================================================

        setZPLCode: (code: string) => {
          set((state) => ({
            zplCode: code,
            history: [
              ...state.history.slice(0, state.historyIndex + 1),
              {
                id: uuidv4(),
                action: 'modify',
                timestamp: new Date(),
              },
            ],
            historyIndex: state.historyIndex + 1,
          }));
        },

        setElements: (elements: ZPLElement[]) => {
          set((state) => ({
            elements,
            history: [
              ...state.history.slice(0, state.historyIndex + 1),
              {
                id: uuidv4(),
                action: 'modify',
                timestamp: new Date(),
              },
            ],
            historyIndex: state.historyIndex + 1,
          }));
        },

        addElement: (element: ZPLElement) => {
          set((state) => ({
            elements: [...state.elements, element],
            history: [
              ...state.history.slice(0, state.historyIndex + 1),
              {
                id: uuidv4(),
                action: 'add',
                element,
                elementId: element.id,
                timestamp: new Date(),
              },
            ],
            historyIndex: state.historyIndex + 1,
          }));
        },

        updateElement: (id: string, updates: Partial<ZPLElement>) => {
          set((state) => {
            const element = state.elements.find((el) => el.id === id);
            if (!element) return state;

            return {
              elements: state.elements.map((el) =>
                el.id === id ? { ...el, ...updates } : el
              ),
              history: [
                ...state.history.slice(0, state.historyIndex + 1),
                {
                  id: uuidv4(),
                  action: 'modify',
                  elementId: id,
                  element: { ...element, ...updates },
                  previousValue: element,
                  timestamp: new Date(),
                },
              ],
              historyIndex: state.historyIndex + 1,
            };
          });
        },

        deleteElement: (id: string) => {
          set((state) => {
            const element = state.elements.find((el) => el.id === id);
            if (!element) return state;

            return {
              elements: state.elements.filter((el) => el.id !== id),
              selectedElementIds: state.selectedElementIds.filter((eid) => eid !== id),
              history: [
                ...state.history.slice(0, state.historyIndex + 1),
                {
                  id: uuidv4(),
                  action: 'remove',
                  element,
                  elementId: id,
                  timestamp: new Date(),
                },
              ],
              historyIndex: state.historyIndex + 1,
            };
          });
        },

        selectElement: (id: string, multiSelect = false) => {
          set((state) => ({
            selectedElementIds: multiSelect
              ? state.selectedElementIds.includes(id)
                ? state.selectedElementIds.filter((eid) => eid !== id)
                : [...state.selectedElementIds, id]
              : [id],
          }));
        },

        deselectAll: () => {
          set({ selectedElementIds: [] });
        },

        setHoveredElement: (id: string | null) => {
          set({ hoveredElementId: id });
        },

        // ====================================================================
        // CANVAS ACTIONS
        // ====================================================================

        setZoom: (zoom: number) => {
          set({ zoom: Math.max(0.1, Math.min(zoom, 10)) });
        },

        setPan: (x: number, y: number) => {
          set({ panX: x, panY: y });
        },

        setShowGrid: (show: boolean) => {
          set({ showGrid: show });
        },

        setShowRuler: (show: boolean) => {
          set({ showRuler: show });
        },

        setSnapToGrid: (snap: boolean) => {
          set({ snapToGrid: snap });
        },

        setGridSize: (size: number) => {
          set({ gridSize: Math.max(5, size) });
        },

        // ====================================================================
        // CONFIGURATION ACTIONS
        // ====================================================================

        setLabelConfig: (config: Partial<LabelConfig>) => {
          set((state) => ({
            labelConfig: { ...state.labelConfig, ...config },
          }));
        },

        setPrinterConfig: (config: Partial<PrinterConfig>) => {
          set((state) => ({
            printerConfig: { ...state.printerConfig, ...config },
          }));
        },

        // ====================================================================
        // THERMAL ACTIONS
        // ====================================================================

        setThermalMode: (mode: ThermalMode) => {
          set({ thermalMode: mode });
        },

        setAutoOptimize: (auto: boolean) => {
          set({ autoOptimize: auto });
        },

        // ====================================================================
        // HISTORY ACTIONS
        // ====================================================================

        undo: () => {
          set((state) => ({
            historyIndex: Math.max(-1, state.historyIndex - 1),
          }));
        },

        redo: () => {
          set((state) => ({
            historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
          }));
        },

        canUndo: () => {
          return get().historyIndex > -1;
        },

        canRedo: () => {
          return get().historyIndex < get().history.length - 1;
        },

        // ====================================================================
        // UI ACTIONS
        // ====================================================================

        toggleCodeEditor: () => {
          set((state) => ({ showCodeEditor: !state.showCodeEditor }));
        },

        togglePreview: () => {
          set((state) => ({ showPreview: !state.showPreview }));
        },

        toggleProperties: () => {
          set((state) => ({ showProperties: !state.showProperties }));
        },

        toggleDarkMode: () => {
          set((state) => ({ darkMode: !state.darkMode }));
        },

        // ====================================================================
        // UTILITIES
        // ====================================================================

        reset: () => {
          set({
            zplCode: '^XA\n^XZ',
            elements: [],
            selectedElementIds: [],
            hoveredElementId: null,
            zoom: 1,
            panX: 0,
            panY: 0,
            history: [],
            historyIndex: -1,
            labelConfig: defaultLabelConfig,
            printerConfig: defaultPrinterConfig,
          });
        },

        exportState: () => {
          const state = get();
          return JSON.stringify({
            zplCode: state.zplCode,
            elements: state.elements,
            labelConfig: state.labelConfig,
            printerConfig: state.printerConfig,
          });
        },

        importState: (json: string) => {
          try {
            const data = JSON.parse(json);
            set({
              zplCode: data.zplCode || '^XA\n^XZ',
              elements: data.elements || [],
              labelConfig: data.labelConfig || defaultLabelConfig,
              printerConfig: data.printerConfig || defaultPrinterConfig,
              selectedElementIds: [],
              history: [],
              historyIndex: -1,
            });
          } catch (error) {
            console.error('Failed to import state:', error);
          }
        },
      }),
      {
        name: 'labery-editor-store',
        partialize: (state) => ({
          labelConfig: state.labelConfig,
          printerConfig: state.printerConfig,
          darkMode: state.darkMode,
          showGrid: state.showGrid,
          showRuler: state.showRuler,
          snapToGrid: state.snapToGrid,
          gridSize: state.gridSize,
        }),
      }
    )
  )
);
