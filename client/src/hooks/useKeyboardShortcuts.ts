/**
 * useKeyboardShortcuts - Handle keyboard shortcuts for the editor
 */

import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { toast } from 'sonner';

export function useKeyboardShortcuts() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
    selectedElementIds,
    deleteElement,
    selectElement,
    deselectAll,
  } = useEditorStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) {
          undo();
        }
        return;
      }

      // Redo: Ctrl+Y / Cmd+Y or Ctrl+Shift+Z / Cmd+Shift+Z
      if ((isMeta && e.key === 'y') || (isMeta && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        if (canRedo()) {
          redo();
        }
        return;
      }

      // Delete: Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        for (const id of selectedElementIds) {
          deleteElement(id);
        }
        if (selectedElementIds.length > 0) {
          toast.success(`Deleted ${selectedElementIds.length} element(s)`);
        }
        return;
      }

      // Escape: Deselect all
      if (e.key === 'Escape') {
        e.preventDefault();
        deselectAll();
        return;
      }

      // Ctrl+A / Cmd+A: Select all
      if (isMeta && e.key === 'a') {
        e.preventDefault();
        toast.info('Select all coming soon');
        return;
      }

      // Ctrl+S / Cmd+S: Save
      if (isMeta && e.key === 's') {
        e.preventDefault();
        toast.info('Save triggered');
        return;
      }

      // Ctrl+E / Cmd+E: Export
      if (isMeta && e.key === 'e') {
        e.preventDefault();
        toast.info('Export dialog coming soon');
        return;
      }

      // Ctrl+P / Cmd+P: Print
      if (isMeta && e.key === 'p') {
        e.preventDefault();
        toast.info('Print dialog coming soon');
        return;
      }

      // Arrow keys: Move selected elements
      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;

        for (const id of selectedElementIds) {
          // This would be implemented in the store
          // moveElement(id, direction, step);
        }
        return;
      }

      // +/- for zoom
      if (isMeta && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        // Zoom in
        return;
      }

      if (isMeta && e.key === '-') {
        e.preventDefault();
        // Zoom out
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo, selectedElementIds, deleteElement, deselectAll]);
}
