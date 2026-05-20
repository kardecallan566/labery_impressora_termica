/**
 * Canvas Rendering - Render ZPL elements to canvas
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

interface RenderOptions {
  dpi: 203 | 300 | 600;
  quality: number;
}

/**
 * Convert mm to pixels based on DPI
 */
function mmToPixels(mm: number, dpi: number): number {
  return (mm * dpi) / 25.4;
}

/**
 * Render elements to canvas
 */
export async function renderElementsToCanvas(
  elements: ZPLElement[],
  labelConfig: LabelConfig,
  options: RenderOptions
): Promise<HTMLCanvasElement> {
  // Create canvas
  const width = mmToPixels(labelConfig.width, options.dpi);
  const height = mmToPixels(labelConfig.height, options.dpi);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Set white background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Render each element
  for (const element of elements) {
    if (!element.visible) continue;

    ctx.save();

    // Apply transforms
    const x = mmToPixels(element.position.x, options.dpi);
    const y = mmToPixels(element.position.y, options.dpi);

    ctx.translate(x, y);
    ctx.rotate((element.transform.rotation * Math.PI) / 180);
    ctx.scale(element.transform.scaleX, element.transform.scaleY);
    ctx.globalAlpha = element.opacity;

    // Render based on type
    await renderElement(ctx, element, options);

    ctx.restore();
  }

  return canvas;
}

/**
 * Render individual element
 */
async function renderElement(
  ctx: CanvasRenderingContext2D,
  element: ZPLElement,
  options: RenderOptions
): Promise<void> {
  switch (element.type) {
    case 'text':
      renderText(ctx, element as TextElement, options);
      break;
    case 'barcode':
      await renderBarcode(ctx, element as BarcodeElement, options);
      break;
    case 'qrcode':
      await renderQRCode(ctx, element as QRCodeElement, options);
      break;
    case 'line':
      renderLine(ctx, element as LineElement, options);
      break;
    case 'box':
      renderBox(ctx, element as BoxElement, options);
      break;
    case 'image':
      await renderImage(ctx, element as ImageElement, options);
      break;
  }
}

/**
 * Render text element
 */
function renderText(ctx: CanvasRenderingContext2D, element: TextElement, options: RenderOptions): void {
  const fontSize = mmToPixels(element.style.fontSize, options.dpi);
  const fontWeight = element.style.fontWeight === 'bold' ? 'bold' : 'normal';

  ctx.font = `${fontWeight} ${fontSize}px ${element.style.fontFamily}`;
  ctx.fillStyle = element.color;
  ctx.textAlign = element.style.textAlign as CanvasTextAlign;
  ctx.textBaseline = 'top';

  // Apply stroke if present
  if (element.stroke) {
    ctx.strokeStyle = element.stroke.color;
    ctx.lineWidth = element.stroke.width;
    ctx.strokeText(element.content, 0, 0);
  }

  // Draw text
  ctx.fillText(element.content, 0, 0);
}

/**
 * Render barcode element (placeholder)
 */
async function renderBarcode(
  ctx: CanvasRenderingContext2D,
  element: BarcodeElement,
  options: RenderOptions
): Promise<void> {
  // This would use a barcode library like jsbarcode
  // For now, render a placeholder
  const width = mmToPixels(element.width, options.dpi);
  const height = mmToPixels(element.height, options.dpi);

  ctx.fillStyle = element.color;
  ctx.fillRect(0, 0, width, height);

  // Draw border
  ctx.strokeStyle = element.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Draw text
  if (element.showLabel) {
    ctx.font = `${mmToPixels(element.labelSize, options.dpi)}px ${element.labelFont}`;
    ctx.fillStyle = element.color;
    ctx.textAlign = 'center';
    ctx.fillText(element.data, width / 2, height + 10);
  }
}

/**
 * Render QR code element (placeholder)
 */
async function renderQRCode(
  ctx: CanvasRenderingContext2D,
  element: QRCodeElement,
  options: RenderOptions
): Promise<void> {
  // This would use a QR code library like qrcode
  // For now, render a placeholder
  const width = mmToPixels(element.size.width, options.dpi);
  const height = mmToPixels(element.size.height, options.dpi);

  ctx.fillStyle = element.backgroundColor || '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = element.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Draw placeholder pattern
  const cellSize = width / 10;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillStyle = element.color;
        ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
      }
    }
  }
}

/**
 * Render line element
 */
function renderLine(ctx: CanvasRenderingContext2D, element: LineElement, options: RenderOptions): void {
  const x1 = mmToPixels(element.x1, options.dpi);
  const y1 = mmToPixels(element.y1, options.dpi);
  const x2 = mmToPixels(element.x2, options.dpi);
  const y2 = mmToPixels(element.y2, options.dpi);

  ctx.strokeStyle = element.strokeColor;
  ctx.lineWidth = element.strokeWidth;

  if (element.strokeStyle === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else if (element.strokeStyle === 'dotted') {
    ctx.setLineDash([2, 2]);
  }

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.setLineDash([]);
}

/**
 * Render box element
 */
function renderBox(ctx: CanvasRenderingContext2D, element: BoxElement, options: RenderOptions): void {
  const width = mmToPixels(element.size.width, options.dpi);
  const height = mmToPixels(element.size.height, options.dpi);

  // Fill if color specified
  if (element.fillColor) {
    ctx.fillStyle = element.fillColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Draw border
  ctx.strokeStyle = element.strokeColor;
  ctx.lineWidth = element.strokeWidth;

  if (element.strokeStyle === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else if (element.strokeStyle === 'dotted') {
    ctx.setLineDash([2, 2]);
  }

  if (element.borderRadius > 0) {
    const radius = element.borderRadius;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.stroke();
  } else {
    ctx.strokeRect(0, 0, width, height);
  }

  ctx.setLineDash([]);
}

/**
 * Render image element
 */
async function renderImage(
  ctx: CanvasRenderingContext2D,
  element: ImageElement,
  options: RenderOptions
): Promise<void> {
  try {
    const width = mmToPixels(element.size.width, options.dpi);
    const height = mmToPixels(element.size.height, options.dpi);

    // Load image
    const img = new Image();
    img.src = element.src;

    await new Promise((resolve, reject) => {
      img.onload = () => {
        // Apply monochrome if needed
        if (element.monochrome) {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const tempCtx = canvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(img, 0, 0);
            const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
              const gray =
                data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
              const value = gray > element.threshold ? 255 : 0;
              data[i] = value;
              data[i + 1] = value;
              data[i + 2] = value;
            }

            tempCtx.putImageData(imageData, 0, 0);
            ctx.drawImage(canvas, 0, 0, width, height);
          }
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        resolve(null);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    });
  } catch (error) {
    console.error('Failed to render image:', error);
  }
}
