/**
 * Electron Preload Script
 * Exposes safe APIs to the renderer process
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose safe APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveFile: (data: any) => ipcRenderer.send('file:save', data),
  openFile: () => ipcRenderer.send('file:open'),
  onFileSaveResponse: (callback: any) =>
    ipcRenderer.on('file:save-response', (_, data) => callback(data)),
  onFileOpenResponse: (callback: any) =>
    ipcRenderer.on('file:open-response', (_, data) => callback(data)),

  // Print operations
  printPreview: (data: any) => ipcRenderer.send('print:preview', data),
  sendToPrinter: (data: any) => ipcRenderer.send('print:send', data),
  onPrintPreviewResponse: (callback: any) =>
    ipcRenderer.on('print:preview-response', (_, data) => callback(data)),
  onPrintSendResponse: (callback: any) =>
    ipcRenderer.on('print:send-response', (_, data) => callback(data)),

  // Export operations
  exportPDF: (data: any) => ipcRenderer.send('export:pdf', data),
  exportPNG: (data: any) => ipcRenderer.send('export:png', data),
  onExportPDFResponse: (callback: any) =>
    ipcRenderer.on('export:pdf-response', (_, data) => callback(data)),
  onExportPNGResponse: (callback: any) =>
    ipcRenderer.on('export:png-response', (_, data) => callback(data)),

  // Menu events
  onMenuNew: (callback: any) => ipcRenderer.on('menu:new', callback),
  onMenuOpen: (callback: any) => ipcRenderer.on('menu:open', callback),
  onMenuSave: (callback: any) => ipcRenderer.on('menu:save', callback),
  onMenuExportPDF: (callback: any) => ipcRenderer.on('menu:export-pdf', callback),
  onMenuExportPNG: (callback: any) => ipcRenderer.on('menu:export-png', callback),
  onMenuExportSVG: (callback: any) => ipcRenderer.on('menu:export-svg', callback),
  onMenuExportZPL: (callback: any) => ipcRenderer.on('menu:export-zpl', callback),
  onMenuPrint: (callback: any) => ipcRenderer.on('menu:print', callback),
  onMenuUndo: (callback: any) => ipcRenderer.on('menu:undo', callback),
  onMenuRedo: (callback: any) => ipcRenderer.on('menu:redo', callback),
  onMenuCut: (callback: any) => ipcRenderer.on('menu:cut', callback),
  onMenuCopy: (callback: any) => ipcRenderer.on('menu:copy', callback),
  onMenuPaste: (callback: any) => ipcRenderer.on('menu:paste', callback),
  onMenuZoomIn: (callback: any) => ipcRenderer.on('menu:zoom-in', callback),
  onMenuZoomOut: (callback: any) => ipcRenderer.on('menu:zoom-out', callback),
  onMenuZoomReset: (callback: any) => ipcRenderer.on('menu:zoom-reset', callback),
  onMenuAbout: (callback: any) => ipcRenderer.on('menu:about', callback),
});

// Type definitions for TypeScript
declare global {
  interface Window {
    electronAPI: {
      saveFile: (data: any) => void;
      openFile: () => void;
      onFileSaveResponse: (callback: any) => void;
      onFileOpenResponse: (callback: any) => void;
      printPreview: (data: any) => void;
      sendToPrinter: (data: any) => void;
      onPrintPreviewResponse: (callback: any) => void;
      onPrintSendResponse: (callback: any) => void;
      exportPDF: (data: any) => void;
      exportPNG: (data: any) => void;
      onExportPDFResponse: (callback: any) => void;
      onExportPNGResponse: (callback: any) => void;
      onMenuNew: (callback: any) => void;
      onMenuOpen: (callback: any) => void;
      onMenuSave: (callback: any) => void;
      onMenuExportPDF: (callback: any) => void;
      onMenuExportPNG: (callback: any) => void;
      onMenuExportSVG: (callback: any) => void;
      onMenuExportZPL: (callback: any) => void;
      onMenuPrint: (callback: any) => void;
      onMenuUndo: (callback: any) => void;
      onMenuRedo: (callback: any) => void;
      onMenuCut: (callback: any) => void;
      onMenuCopy: (callback: any) => void;
      onMenuPaste: (callback: any) => void;
      onMenuZoomIn: (callback: any) => void;
      onMenuZoomOut: (callback: any) => void;
      onMenuZoomReset: (callback: any) => void;
      onMenuAbout: (callback: any) => void;
    };
  }
}
