/**
 * SVG Export - Render ZPL elements to SVG
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
 * Convert mm to SVG units (assuming 96 DPI)
 */
function mmToSVG(mm: number): number {
  return (mm * 96) / 25.4;
}

/**
 * Render elements to SVG string
 */
export function renderElementsToSVG(elements: ZPLElement[], labelConfig: LabelConfig): string {
  const width = mmToSVG(labelConfig.width);
  const height = mmToSVG(labelConfig.height);

  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <defs>\n`;
  svg += `    <style type="text/css">\n`;
  svg += `      text { font-family: Arial, sans-serif; }\n`;
  svg += `    </style>\n`;
  svg += `  </defs>\n`;

  // White background
  svg += `  <rect width="${width}" height="${height}" fill="white"/>\n`;

  // Render elements
  for (const element of elements) {
    if (!element.visible) continue;
    svg += renderElement(element, labelConfig);
  }

  svg += `</svg>`;
  return svg;
}

/**
 * Render individual element to SVG
 */
function renderElement(element: ZPLElement, labelConfig: LabelConfig): string {
  const x = mmToSVG(element.position.x);
  const y = mmToSVG(element.position.y);

  let svg = `  <g transform="translate(${x}, ${y})`;

  if (element.transform.rotation !== 0) {
    svg += ` rotate(${element.transform.rotation})`;
  }

  if (element.transform.scaleX !== 1 || element.transform.scaleY !== 1) {
    svg += ` scale(${element.transform.scaleX}, ${element.transform.scaleY})`;
  }

  svg += `" opacity="${element.opacity}">\n`;

  // Render based on type
  switch (element.type) {
    case 'text':
      svg += renderTextSVG(element as TextElement);
      break;
    case 'barcode':
      svg += renderBarcodeSVG(element as BarcodeElement);
      break;
    case 'qrcode':
      svg += renderQRCodeSVG(element as QRCodeElement);
      break;
    case 'line':
      svg += renderLineSVG(element as LineElement);
      break;
    case 'box':
      svg += renderBoxSVG(element as BoxElement);
      break;
    case 'image':
      svg += renderImageSVG(element as ImageElement);
      break;
  }

  svg += `  </g>\n`;
  return svg;
}

/**
 * Render text element to SVG
 */
function renderTextSVG(element: TextElement): string {
  const fontSize = mmToSVG(element.style.fontSize);
  const fontWeight = element.style.fontWeight === 'bold' ? 'bold' : 'normal';

  let svg = `    <text x="0" y="0" font-size="${fontSize}" font-weight="${fontWeight}" fill="${element.color}"`;

  if (element.style.textAlign === 'center') {
    svg += ` text-anchor="middle"`;
  } else if (element.style.textAlign === 'right') {
    svg += ` text-anchor="end"`;
  }

  svg += `>`;
  svg += escapeXML(element.content);
  svg += `</text>\n`;

  // Add stroke if present
  if (element.stroke) {
    svg += `    <text x="0" y="0" font-size="${fontSize}" font-weight="${fontWeight}" fill="none" stroke="${element.stroke.color}" stroke-width="${element.stroke.width}"`;

    if (element.style.textAlign === 'center') {
      svg += ` text-anchor="middle"`;
    } else if (element.style.textAlign === 'right') {
      svg += ` text-anchor="end"`;
    }

    svg += `>`;
    svg += escapeXML(element.content);
    svg += `</text>\n`;
  }

  return svg;
}

/**
 * Render barcode element to SVG
 */
function renderBarcodeSVG(element: BarcodeElement): string {
  const width = mmToSVG(element.width);
  const height = mmToSVG(element.height);

  let svg = `    <rect x="0" y="0" width="${width}" height="${height}" fill="white" stroke="${element.color}" stroke-width="2"/>\n`;

  // Draw barcode pattern (simplified)
  const barCount = Math.min(element.data.length, 20);
  const barWidth = width / barCount;

  for (let i = 0; i < barCount; i++) {
    const charCode = element.data.charCodeAt(i);
    if (charCode % 2 === 0) {
      svg += `    <rect x="${i * barWidth}" y="0" width="${barWidth}" height="${height}" fill="${element.color}"/>\n`;
    }
  }

  // Add label if shown
  if (element.showLabel) {
    const labelSize = mmToSVG(element.labelSize);
    const labelY = height + 10;
    svg += `    <text x="${width / 2}" y="${labelY}" font-size="${labelSize}" text-anchor="middle" fill="${element.color}">`;
    svg += escapeXML(element.data);
    svg += `</text>\n`;
  }

  return svg;
}

/**
 * Render QR code element to SVG
 */
function renderQRCodeSVG(element: QRCodeElement): string {
  const width = mmToSVG(element.size.width);
  const height = mmToSVG(element.size.height);

  let svg = `    <rect x="0" y="0" width="${width}" height="${height}" fill="${element.backgroundColor || 'white'}" stroke="${element.color}" stroke-width="2"/>\n`;

  // Draw QR pattern (simplified checkerboard)
  const cellSize = width / 10;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((i + j) % 2 === 0) {
        svg += `    <rect x="${i * cellSize}" y="${j * cellSize}" width="${cellSize}" height="${cellSize}" fill="${element.color}"/>\n`;
      }
    }
  }

  return svg;
}

/**
 * Render line element to SVG
 */
function renderLineSVG(element: LineElement): string {
  const x1 = mmToSVG(element.x1);
  const y1 = mmToSVG(element.y1);
  const x2 = mmToSVG(element.x2);
  const y2 = mmToSVG(element.y2);

  let svg = `    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}"`;

  if (element.strokeStyle === 'dashed') {
    svg += ` stroke-dasharray="5,5"`;
  } else if (element.strokeStyle === 'dotted') {
    svg += ` stroke-dasharray="2,2"`;
  }

  svg += `/>\n`;
  return svg;
}

/**
 * Render box element to SVG
 */
function renderBoxSVG(element: BoxElement): string {
  const width = mmToSVG(element.size.width);
  const height = mmToSVG(element.size.height);
  const radius = element.borderRadius > 0 ? mmToSVG(element.borderRadius) : 0;

  let svg = `    <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}"`;

  if (element.fillColor) {
    svg += ` fill="${element.fillColor}"`;
  } else {
    svg += ` fill="none"`;
  }

  svg += ` stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}"`;

  if (element.strokeStyle === 'dashed') {
    svg += ` stroke-dasharray="5,5"`;
  } else if (element.strokeStyle === 'dotted') {
    svg += ` stroke-dasharray="2,2"`;
  }

  svg += `/>\n`;
  return svg;
}

/**
 * Render image element to SVG
 */
function renderImageSVG(element: ImageElement): string {
  const width = mmToSVG(element.size.width);
  const height = mmToSVG(element.size.height);

  let svg = `    <image x="0" y="0" width="${width}" height="${height}" href="${element.src}"`;

  if (element.monochrome) {
    svg += ` style="filter: grayscale(100%)"`;
  }

  svg += `/>\n`;
  return svg;
}

/**
 * Escape XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
