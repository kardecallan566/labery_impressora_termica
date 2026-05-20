/**
 * Thermal Optimization System
 * Analyzes and improves label quality for thermal printers
 */

import {
  ZPLElement,
  TextElement,
  BarcodeElement,
  QRCodeElement,
  ThermalOptimizationSuggestion,
  ThermalOptimizationResult,
} from './types';

export class ThermalOptimizer {
  /**
   * Analyze elements for thermal printing issues
   */
  static analyze(elements: ZPLElement[]): ThermalOptimizationResult {
    const suggestions: ThermalOptimizationSuggestion[] = [];
    const optimizedElements = new Map<string, ZPLElement>();

    for (const element of elements) {
      const elementSuggestions = this.analyzeElement(element);
      suggestions.push(...elementSuggestions);

      // Auto-generate optimized version if needed
      if (elementSuggestions.some((s) => s.severity === 'high')) {
        const optimized = this.optimizeElement(element);
        optimizedElements.set(element.id, optimized);
      }
    }

    return {
      suggestions,
      optimizedElements,
    };
  }

  /**
   * Analyze individual element
   */
  private static analyzeElement(element: ZPLElement): ThermalOptimizationSuggestion[] {
    const suggestions: ThermalOptimizationSuggestion[] = [];

    if (element.type === 'text') {
      suggestions.push(...this.analyzeText(element as TextElement));
    } else if (element.type === 'barcode') {
      suggestions.push(...this.analyzeBarcode(element as BarcodeElement));
    } else if (element.type === 'qrcode') {
      suggestions.push(...this.analyzeQRCode(element as QRCodeElement));
    }

    return suggestions;
  }

  /**
   * Analyze text element
   */
  private static analyzeText(element: TextElement): ThermalOptimizationSuggestion[] {
    const suggestions: ThermalOptimizationSuggestion[] = [];

    // Check for small font size
    if (element.style.fontSize < 10) {
      suggestions.push({
        elementId: element.id,
        issue: 'Text size too small',
        severity: 'high',
        suggestion: 'Increase font size to at least 10pt for better readability',
        autoFix: () => ({
          ...element,
          style: {
            ...element.style,
            fontSize: Math.max(10, element.style.fontSize),
          },
        }),
      });
    }

    // Check for thin strokes
    if (element.stroke && element.stroke.width < 1) {
      suggestions.push({
        elementId: element.id,
        issue: 'Text stroke too thin',
        severity: 'medium',
        suggestion: 'Increase stroke width for better visibility',
        autoFix: () => ({
          ...element,
          stroke: {
            ...element.stroke!,
            width: 1,
          },
        }),
      });
    }

    // Suggest bold for better print quality
    if (element.style.fontWeight === 'normal' && element.style.fontSize < 14) {
      suggestions.push({
        elementId: element.id,
        issue: 'Text could be bolder',
        severity: 'low',
        suggestion: 'Consider making text bold for improved thermal print quality',
        autoFix: () => ({
          ...element,
          style: {
            ...element.style,
            fontWeight: 'bold',
          },
        }),
      });
    }

    return suggestions;
  }

  /**
   * Analyze barcode element
   */
  private static analyzeBarcode(element: BarcodeElement): ThermalOptimizationSuggestion[] {
    const suggestions: ThermalOptimizationSuggestion[] = [];

    // Check for small barcode
    if (element.height < 20) {
      suggestions.push({
        elementId: element.id,
        issue: 'Barcode height too small',
        severity: 'high',
        suggestion: 'Increase barcode height to at least 20mm for reliable scanning',
        autoFix: () => ({
          ...element,
          height: Math.max(20, element.height),
          size: { ...element.size, height: Math.max(20, element.height) },
        }),
      });
    }

    // Check for thin bars
    if (element.barWidth < 2) {
      suggestions.push({
        elementId: element.id,
        issue: 'Barcode bars too thin',
        severity: 'high',
        suggestion: 'Increase bar width to at least 2 dots for proper scanning',
        autoFix: () => ({
          ...element,
          barWidth: Math.max(2, element.barWidth),
        }),
      });
    }

    // Check for missing label
    if (!element.showLabel) {
      suggestions.push({
        elementId: element.id,
        issue: 'Barcode label hidden',
        severity: 'low',
        suggestion: 'Show barcode label for better usability',
        autoFix: () => ({
          ...element,
          showLabel: true,
        }),
      });
    }

    return suggestions;
  }

  /**
   * Analyze QR code element
   */
  private static analyzeQRCode(element: QRCodeElement): ThermalOptimizationSuggestion[] {
    const suggestions: ThermalOptimizationSuggestion[] = [];

    // Check for small QR code
    if (element.size.width < 30 || element.size.height < 30) {
      suggestions.push({
        elementId: element.id,
        issue: 'QR code too small',
        severity: 'high',
        suggestion: 'Increase QR code size to at least 30x30mm for reliable scanning',
        autoFix: () => ({
          ...element,
          size: {
            width: Math.max(30, element.size.width),
            height: Math.max(30, element.size.height),
          },
        }),
      });
    }

    // Suggest higher error correction
    if (element.errorCorrection === 'L') {
      suggestions.push({
        elementId: element.id,
        issue: 'Low error correction',
        severity: 'medium',
        suggestion: 'Use higher error correction (M or H) for thermal printing',
        autoFix: () => ({
          ...element,
          errorCorrection: 'M' as const,
        }),
      });
    }

    return suggestions;
  }

  /**
   * Optimize element for thermal printing
   */
  private static optimizeElement(element: ZPLElement): ZPLElement {
    if (element.type === 'text') {
      return this.optimizeText(element as TextElement);
    } else if (element.type === 'barcode') {
      return this.optimizeBarcode(element as BarcodeElement);
    } else if (element.type === 'qrcode') {
      return this.optimizeQRCode(element as QRCodeElement);
    }

    return element;
  }

  /**
   * Optimize text for thermal printing
   */
  private static optimizeText(element: TextElement): TextElement {
    const optimized = { ...element };

    // Ensure minimum font size
    if (optimized.style.fontSize < 10) {
      optimized.style.fontSize = 10;
    }

    // Make bold for better visibility
    if (optimized.style.fontSize < 14) {
      optimized.style.fontWeight = 'bold';
    }

    // Ensure stroke width
    if (!optimized.stroke) {
      optimized.stroke = {
        color: '#000000',
        width: 1,
      };
    } else if (optimized.stroke.width < 1) {
      optimized.stroke.width = 1;
    }

    return optimized;
  }

  /**
   * Optimize barcode for thermal printing
   */
  private static optimizeBarcode(element: BarcodeElement): BarcodeElement {
    const optimized = { ...element };

    // Ensure minimum height
    if (optimized.height < 20) {
      optimized.height = 20;
      optimized.size = { ...optimized.size, height: 20 };
    }

    // Ensure minimum bar width
    if (optimized.barWidth < 2) {
      optimized.barWidth = 2;
    }

    // Show label
    optimized.showLabel = true;

    return optimized;
  }

  /**
   * Optimize QR code for thermal printing
   */
  private static optimizeQRCode(element: QRCodeElement): QRCodeElement {
    const optimized = { ...element };

    // Ensure minimum size
    if (optimized.size.width < 30 || optimized.size.height < 30) {
      optimized.size = {
        width: Math.max(30, optimized.size.width),
        height: Math.max(30, optimized.size.height),
      };
    }

    // Use higher error correction
    if (optimized.errorCorrection === 'L') {
      optimized.errorCorrection = 'M';
    }

    return optimized;
  }

  /**
   * Apply compensation for weak thermal printers
   */
  static applyWeakPrinterCompensation(elements: ZPLElement[]): ZPLElement[] {
    return elements.map((element) => {
      if (element.type === 'text') {
        const text = element as TextElement;
        return {
          ...text,
          style: {
            ...text.style,
            fontSize: Math.max(text.style.fontSize, 11),
            fontWeight: 'bold',
          },
          opacity: 1,
        };
      } else if (element.type === 'barcode') {
        const barcode = element as BarcodeElement;
        return {
          ...barcode,
          height: Math.max(barcode.height, 25),
          barWidth: Math.max(barcode.barWidth, 3),
        };
      } else if (element.type === 'qrcode') {
        const qr = element as QRCodeElement;
        return {
          ...qr,
          size: {
            width: Math.max(qr.size.width, 40),
            height: Math.max(qr.size.height, 40),
          },
          errorCorrection: 'H' as const,
        };
      }

      return element;
    });
  }

  /**
   * Apply compensation for strong thermal printers
   */
  static applyStrongPrinterCompensation(elements: ZPLElement[]): ZPLElement[] {
    // Strong printers can handle more detail
    return elements.map((element) => {
      if (element.type === 'text') {
        const text = element as TextElement;
        return {
          ...text,
          style: {
            ...text.style,
            fontSize: Math.max(text.style.fontSize, 9),
          },
        };
      }

      return element;
    });
  }

  /**
   * Generate optimization report
   */
  static generateReport(result: ThermalOptimizationResult): string {
    const { suggestions } = result;

    if (suggestions.length === 0) {
      return 'Label is optimized for thermal printing!';
    }

    const highSeverity = suggestions.filter((s) => s.severity === 'high');
    const mediumSeverity = suggestions.filter((s) => s.severity === 'medium');
    const lowSeverity = suggestions.filter((s) => s.severity === 'low');

    let report = 'Thermal Optimization Report\n';
    report += '============================\n\n';

    if (highSeverity.length > 0) {
      report += `⚠️  HIGH PRIORITY (${highSeverity.length}):\n`;
      highSeverity.forEach((s) => {
        report += `  • ${s.issue}: ${s.suggestion}\n`;
      });
      report += '\n';
    }

    if (mediumSeverity.length > 0) {
      report += `⚠️  MEDIUM PRIORITY (${mediumSeverity.length}):\n`;
      mediumSeverity.forEach((s) => {
        report += `  • ${s.issue}: ${s.suggestion}\n`;
      });
      report += '\n';
    }

    if (lowSeverity.length > 0) {
      report += `ℹ️  LOW PRIORITY (${lowSeverity.length}):\n`;
      lowSeverity.forEach((s) => {
        report += `  • ${s.issue}: ${s.suggestion}\n`;
      });
      report += '\n';
    }

    return report;
  }
}

/**
 * Convenience functions
 */
export function optimizeForThermalPrinting(elements: ZPLElement[]): ZPLElement[] {
  const result = ThermalOptimizer.analyze(elements);
  return elements.map((el) => result.optimizedElements.get(el.id) || el);
}

export function getThermalOptimizationSuggestions(
  elements: ZPLElement[]
): ThermalOptimizationSuggestion[] {
  const result = ThermalOptimizer.analyze(elements);
  return result.suggestions;
}
