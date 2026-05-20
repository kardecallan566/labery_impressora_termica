/**
 * Editor Page - Main application interface
 * Layout: Toolbar | Canvas | Properties Panel
 */

import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { parseZPL } from '@/lib/zpl/parser';
import { ThermalOptimizer } from '@/lib/zpl/optimization';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Code2,
  Eye,
  Settings,
  Save,
  Download,
  Printer,
  Zap,
  Grid3x3,
  Maximize2,
  RotateCcw,
} from 'lucide-react';

export default function Editor() {
  const {
    zplCode,
    elements,
    setElements,
    setZPLCode,
    showCodeEditor,
    showPreview,
    showProperties,
    toggleCodeEditor,
    togglePreview,
    toggleProperties,
    zoom,
    setZoom,
    thermalMode,
    autoOptimize,
    canUndo,
    canRedo,
    undo,
    redo,
  } = useEditorStore();

  const [codeInput, setCodeInput] = useState(zplCode);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<any[]>([]);

  // Parse ZPL when code changes
  useEffect(() => {
    try {
      const result = parseZPL(codeInput);
      setElements(result.elements);

      // Run thermal optimization if enabled
      if (autoOptimize) {
        const optimization = ThermalOptimizer.analyze(result.elements);
        setOptimizationSuggestions(optimization.suggestions);
      }
    } catch (error) {
      console.error('Failed to parse ZPL:', error);
      toast.error('Invalid ZPL code');
    }
  }, [codeInput, autoOptimize, setElements]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeInput(e.target.value);
  };

  const handleSave = () => {
    setZPLCode(codeInput);
    toast.success('Label saved');
  };

  const handleExport = () => {
    toast.info('Export dialog coming soon');
  };

  const handlePrint = () => {
    toast.info('Print dialog coming soon');
  };

  const handleOptimize = () => {
    const optimization = ThermalOptimizer.analyze(elements);
    setOptimizationSuggestions(optimization.suggestions);

    if (optimization.suggestions.length === 0) {
      toast.success('Label is already optimized!');
    } else {
      toast.info(`Found ${optimization.suggestions.length} optimization suggestions`);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <div className="border-b border-border bg-card p-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold">Labery ZPL Editor</h1>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            ↶
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            ↷
          </Button>

          <div className="w-px h-6 bg-border" />

          <Button
            variant={showCodeEditor ? 'default' : 'outline'}
            size="sm"
            onClick={toggleCodeEditor}
            title="Toggle Code Editor"
          >
            <Code2 className="w-4 h-4" />
          </Button>

          <Button
            variant={showPreview ? 'default' : 'outline'}
            size="sm"
            onClick={togglePreview}
            title="Toggle Preview"
          >
            <Eye className="w-4 h-4" />
          </Button>

          <Button
            variant={showProperties ? 'default' : 'outline'}
            size="sm"
            onClick={toggleProperties}
            title="Toggle Properties"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleOptimize}
            title="Optimize for Thermal Printing"
          >
            <Zap className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border" />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            title="Export"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            title="Print (Ctrl+P)"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Zoom:</span>
          <select
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="px-2 py-1 text-sm border border-border rounded bg-background"
          >
            <option value={0.5}>50%</option>
            <option value={0.75}>75%</option>
            <option value={1}>100%</option>
            <option value={1.5}>150%</option>
            <option value={2}>200%</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Code Editor */}
        {showCodeEditor && (
          <Card className="flex flex-col w-1/3 min-w-0">
            <div className="p-3 border-b border-border">
              <h2 className="font-semibold text-sm">ZPL Code</h2>
            </div>
            <textarea
              value={codeInput}
              onChange={handleCodeChange}
              className="flex-1 p-3 font-mono text-sm bg-background text-foreground border-0 resize-none focus:outline-none"
              spellCheck="false"
            />
          </Card>
        )}

        {/* Canvas Preview */}
        {showPreview && (
          <Card className="flex-1 flex flex-col min-w-0">
            <div className="p-3 border-b border-border">
              <h2 className="font-semibold text-sm">Preview</h2>
            </div>
            <div className="flex-1 bg-muted flex items-center justify-center overflow-auto">
              <div className="bg-white border-2 border-border rounded shadow-lg p-4">
                <div className="text-center text-muted-foreground">
                  <Grid3x3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Canvas Preview</p>
                  <p className="text-xs mt-1">{elements.length} elements</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Properties Panel */}
        {showProperties && (
          <Card className="flex flex-col w-1/4 min-w-0">
            <Tabs defaultValue="properties" className="flex flex-col flex-1">
              <TabsList className="w-full justify-start border-b border-border rounded-none">
                <TabsTrigger value="properties" className="rounded-none">
                  Properties
                </TabsTrigger>
                <TabsTrigger value="optimization" className="rounded-none">
                  Optimize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="flex-1 overflow-auto p-3">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Elements
                    </label>
                    <p className="text-sm mt-1">{elements.length} elements</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Thermal Mode
                    </label>
                    <p className="text-sm mt-1 capitalize">{thermalMode}</p>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => toast.info('Element properties coming soon')}
                    >
                      Edit Selected
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="optimization" className="flex-1 overflow-auto p-3">
                <div className="space-y-2">
                  {optimizationSuggestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No suggestions</p>
                  ) : (
                    optimizationSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="p-2 bg-muted rounded text-xs">
                        <p className="font-semibold">{suggestion.issue}</p>
                        <p className="text-muted-foreground mt-1">
                          {suggestion.suggestion}
                        </p>
                        <p className="text-xs mt-1 capitalize">
                          Severity: {suggestion.severity}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        )}
      </div>
    </div>
  );
}
