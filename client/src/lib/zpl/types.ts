/**
 * ZPL Types and Interfaces
 * Define all types used throughout the ZPL parser and renderer
 */

export type DPI = 203 | 300 | 600;
export type MediaType = 'label' | 'receipt' | 'tag';
export type PrintSpeed = 'slow' | 'normal' | 'fast';
export type ThermalMode = 'normal' | 'weak' | 'strong';

// ============================================================================
// ELEMENT TYPES
// ============================================================================

export type ZPLElementType =
  | 'text'
  | 'barcode'
  | 'qrcode'
  | 'datamatrix'
  | 'pdf417'
  | 'line'
  | 'box'
  | 'circle'
  | 'image'
  | 'group';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Transform {
  rotation: number;
  scaleX: number;
  scaleY: number;
}

// ============================================================================
// BASE ELEMENT
// ============================================================================

export interface BaseElement {
  id: string;
  type: ZPLElementType;
  position: Position;
  size: Size;
  transform: Transform;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
}

// ============================================================================
// TEXT ELEMENT
// ============================================================================

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  letterSpacing: number;
  lineHeight: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  style: TextStyle;
  color: string;
  backgroundColor?: string;
  stroke?: {
    color: string;
    width: number;
  };
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

// ============================================================================
// BARCODE ELEMENTS
// ============================================================================

export type BarcodeType =
  | 'code128'
  | 'code39'
  | 'code93'
  | 'ean13'
  | 'ean8'
  | 'upca'
  | 'upce'
  | 'codabar'
  | 'itf14';

export interface BarcodeElement extends BaseElement {
  type: 'barcode';
  barcodeType: BarcodeType;
  data: string;
  height: number;
  width: number;
  barWidth: number;
  showLabel: boolean;
  labelPosition: 'top' | 'bottom';
  labelFont: string;
  labelSize: number;
  color: string;
  backgroundColor?: string;
}

// ============================================================================
// QR CODE ELEMENT
// ============================================================================

export interface QRCodeElement extends BaseElement {
  type: 'qrcode';
  data: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  version?: number;
  color: string;
  backgroundColor?: string;
}

// ============================================================================
// DATAMATRIX ELEMENT
// ============================================================================

export interface DataMatrixElement extends BaseElement {
  type: 'datamatrix';
  data: string;
  size: number;
  color: string;
  backgroundColor?: string;
}

// ============================================================================
// PDF417 ELEMENT
// ============================================================================

export interface PDF417Element extends BaseElement {
  type: 'pdf417';
  data: string;
  columns: number;
  rows: number;
  color: string;
  backgroundColor?: string;
}

// ============================================================================
// LINE ELEMENT
// ============================================================================

export interface LineElement extends BaseElement {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  strokeColor: string;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
}

// ============================================================================
// BOX ELEMENT
// ============================================================================

export interface BoxElement extends BaseElement {
  type: 'box';
  strokeWidth: number;
  strokeColor: string;
  fillColor?: string;
  borderRadius: number;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
}

// ============================================================================
// CIRCLE ELEMENT
// ============================================================================

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
  strokeWidth: number;
  strokeColor: string;
  fillColor?: string;
  strokeStyle: 'solid' | 'dashed' | 'dotted';
}

// ============================================================================
// IMAGE ELEMENT
// ============================================================================

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  format: 'grf' | 'z64' | 'png' | 'jpeg' | 'bmp';
  compression: 'none' | 'base64' | 'z64';
  monochrome: boolean;
  threshold: number;
}

// ============================================================================
// GROUP ELEMENT
// ============================================================================

export interface GroupElement extends BaseElement {
  type: 'group';
  children: ZPLElement[];
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type ZPLElement =
  | TextElement
  | BarcodeElement
  | QRCodeElement
  | DataMatrixElement
  | PDF417Element
  | LineElement
  | BoxElement
  | CircleElement
  | ImageElement
  | GroupElement;

// ============================================================================
// LABEL CONFIGURATION
// ============================================================================

export interface LabelConfig {
  width: number; // mm
  height: number; // mm
  dpi: DPI;
  mediaType: MediaType;
  printSpeed: PrintSpeed;
  density: number; // 0-30
  darkness: number; // 0-30
  printDirection: 'normal' | 'rotated';
  labelOffset: number; // mm
  printMode: 'thermal' | 'direct';
}

// ============================================================================
// PRINTER CONFIGURATION
// ============================================================================

export type PrinterBrand = 'zebra' | 'elgin' | 'argox' | 'tsc' | 'datamax';

export interface PrinterConfig {
  brand: PrinterBrand;
  model: string;
  dpi: DPI;
  maxWidth: number; // mm
  maxHeight: number; // mm
  nativeResolution: DPI;
}

// ============================================================================
// THERMAL OPTIMIZATION
// ============================================================================

export interface ThermalOptimizationSuggestion {
  elementId: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  autoFix?: () => ZPLElement;
}

export interface ThermalOptimizationResult {
  suggestions: ThermalOptimizationSuggestion[];
  optimizedElements: Map<string, ZPLElement>;
}

// ============================================================================
// TEMPLATE
// ============================================================================

export interface Template {
  id: string;
  name: string;
  description: string;
  zplCode: string;
  elements: ZPLElement[];
  variables: TemplateVariable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariable {
  name: string;
  placeholder: string;
  type: 'text' | 'number' | 'date' | 'barcode' | 'qrcode';
  defaultValue: string;
  required: boolean;
}

// ============================================================================
// EXPORT OPTIONS
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'png' | 'svg' | 'zpl';
  dpi: DPI;
  quality: number; // 0-100
  compression: boolean;
  includeMetadata: boolean;
}

export interface PDFExportOptions extends ExportOptions {
  format: 'pdf';
  pageSize: 'A4' | 'letter' | 'custom';
  pageWidth?: number;
  pageHeight?: number;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// ============================================================================
// PRINT JOB
// ============================================================================

export interface PrintJob {
  id: string;
  labelConfig: LabelConfig;
  printerConfig: PrinterConfig;
  elements: ZPLElement[];
  copies: number;
  startLabel?: number;
  endLabel?: number;
  createdAt: Date;
}

// ============================================================================
// UNDO/REDO
// ============================================================================

export interface HistoryEntry {
  id: string;
  action: 'add' | 'remove' | 'modify' | 'reorder';
  elementId?: string;
  element?: ZPLElement;
  previousValue?: ZPLElement;
  timestamp: Date;
}

// ============================================================================
// AST NODE
// ============================================================================

export interface ZPLCommand {
  command: string;
  parameters: Record<string, any>;
  raw: string;
}

export interface ZPLASTParsed {
  commands: ZPLCommand[];
  elements: ZPLElement[];
  config: Partial<LabelConfig>;
  variables: Map<string, string>;
}
