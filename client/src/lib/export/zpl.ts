/**
 * ZPL Code Generation - Convert elements back to ZPL
 */

import {
  ZPLElement,
  TextElement,
  BarcodeElement,
  QRCodeElement,
  LineElement,
  BoxElement,
  ImageElement,
  LabelConfig,
} from '@/lib/zpl/types';

/**
 * Convert pixels to ZPL dots (assuming 203 DPI)
 */
function pixelsToDots(pixels: number): number {
  return Math.round(pixels * (203 / 96));
}

/**
 * Generate ZPL code from elements
 */
export function generateZPLCode(elements: ZPLElement[], labelConfig: LabelConfig): string {
  let zpl = '^XA\n';

  // Add configuration commands
  zpl += generateConfigCommands(labelConfig);

  // Add elements
  for (const element of elements) {
    if (!element.visible) continue;
    zpl += generateElementZPL(element, labelConfig);
  }

  zpl += '^XZ\n';
  return zpl;
}

/**
 * Generate configuration commands
 */
function generateConfigCommands(labelConfig: LabelConfig): string {
  let zpl = '';

  // Label width
  const widthDots = pixelsToDots(labelConfig.width);
  zpl += `^PW${widthDots}\n`;

  // Label height
  const heightDots = pixelsToDots(labelConfig.height);
  zpl += `^LL${heightDots}\n`;

  // Print speed
  const speedMap: Record<string, string> = {
    slow: '1',
    normal: '3',
    fast: '5',
  };
  zpl += `^PR${speedMap[labelConfig.printSpeed]}\n`;

  // Density
  zpl += `^MD${labelConfig.density}\n`;

  // Print mode
  if (labelConfig.printMode === 'thermal') {
    zpl += `^MT\n`;
  }

  return zpl;
}

/**
 * Generate ZPL for individual element
 */
function generateElementZPL(element: ZPLElement, labelConfig: LabelConfig): string {
  const x = pixelsToDots(element.position.x);
  const y = pixelsToDots(element.position.y);

  let zpl = '';

  // Position
  zpl += `^FO${x},${y}\n`;

  // Render based on type
  switch (element.type) {
    case 'text':
      zpl += generateTextZPL(element as TextElement);
      break;
    case 'barcode':
      zpl += generateBarcodeZPL(element as BarcodeElement);
      break;
    case 'qrcode':
      zpl += generateQRCodeZPL(element as QRCodeElement);
      break;
    case 'line':
      zpl += generateLineZPL(element as LineElement);
      break;
    case 'box':
      zpl += generateBoxZPL(element as BoxElement);
      break;
    case 'image':
      zpl += generateImageZPL(element as ImageElement);
      break;
  }

  zpl += '^FS\n';
  return zpl;
}

/**
 * Generate ZPL for text element
 */
function generateTextZPL(element: TextElement): string {
  let zpl = '';

  // Font
  const fontSize = pixelsToDots(element.style.fontSize);
  if (element.style.fontWeight === 'bold') {
    zpl += `^AD0,${fontSize}\n`;
  } else {
    zpl += `^A0,${fontSize}\n`;
  }

  // Text data
  zpl += `^FD${element.content}\n`;

  return zpl;
}

/**
 * Generate ZPL for barcode element
 */
function generateBarcodeZPL(element: BarcodeElement): string {
  let zpl = '';

  const height = pixelsToDots(element.height);
  const barWidth = element.barWidth;

  // Barcode type mapping
  const typeMap: Record<string, string> = {
    code128: 'BC',
    code39: 'B3',
    code93: 'B4',
    ean13: 'BE',
    ean8: 'B8',
    upca: 'BU',
    upce: 'B0',
    codabar: 'BA',
    itf14: 'BI',
  };

  const barcodeCmd = typeMap[element.barcodeType] || 'BC';

  // Barcode command
  zpl += `^${barcodeCmd}${barWidth},Y,${height},N,N\n`;

  // Data
  zpl += `^FD${element.data}\n`;

  return zpl;
}

/**
 * Generate ZPL for QR code element
 */
function generateQRCodeZPL(element: QRCodeElement): string {
  let zpl = '';

  const size = pixelsToDots(element.size.width);

  // Error correction mapping
  const ecMap: Record<string, string> = {
    L: 'L',
    M: 'M',
    Q: 'Q',
    H: 'H',
  };

  // QR code command
  zpl += `^BQN,2,${size}\n`;
  zpl += `^FD${ecMap[element.errorCorrection]}${element.data}\n`;

  return zpl;
}

/**
 * Generate ZPL for line element
 */
function generateLineZPL(element: LineElement): string {
  const x1 = pixelsToDots(element.x1);
  const y1 = pixelsToDots(element.y1);
  const x2 = pixelsToDots(element.x2);
  const y2 = pixelsToDots(element.y2);
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);
  const thickness = element.strokeWidth;

  // Use diagonal line command
  let zpl = `^GD${width},${height},${thickness},B\n`;

  return zpl;
}

/**
 * Generate ZPL for box element
 */
function generateBoxZPL(element: BoxElement): string {
  const width = pixelsToDots(element.size.width);
  const height = pixelsToDots(element.size.height);
  const thickness = element.strokeWidth;

  // Box command
  let zpl = `^GB${width},${height},${thickness}\n`;

  return zpl;
}

/**
 * Generate ZPL for image element
 */
function generateImageZPL(element: ImageElement): string {
  let zpl = '';

  // Image reference
  const imageName = element.src.split('/').pop() || 'image';

  // Scale
  const scaleX = Math.round(element.transform.scaleX);
  const scaleY = Math.round(element.transform.scaleY);

  // Image command
  zpl += `^XG${imageName},${scaleX},${scaleY}\n`;

  return zpl;
}

/**
 * Generate ZPL with variables for template
 */
export function generateZPLTemplate(
  elements: ZPLElement[],
  labelConfig: LabelConfig,
  variables: Map<string, string>
): string {
  let zpl = generateZPLCode(elements, labelConfig);

  // Replace variables with placeholders
  for (const [name, placeholder] of variables) {
    zpl = zpl.replace(new RegExp(placeholder, 'g'), `{{${name}}}`);
  }

  return zpl;
}

/**
 * Validate generated ZPL
 */
export function validateGeneratedZPL(zpl: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!zpl.includes('^XA')) {
    errors.push('Missing ^XA (start label)');
  }
  if (!zpl.includes('^XZ')) {
    errors.push('Missing ^XZ (end label)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
