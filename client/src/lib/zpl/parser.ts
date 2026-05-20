/**
 * ZPL Parser - Transforms raw ZPL code into AST and Elements
 * Supports all major ZPL commands and generates structured elements
 */

import { v4 as uuidv4 } from 'uuid';
import {
  ZPLElement,
  TextElement,
  BarcodeElement,
  QRCodeElement,
  LineElement,
  BoxElement,
  ImageElement,
  ZPLASTParsed,
  ZPLCommand,
  LabelConfig,
  Position,
  TextStyle,
} from './types';

export class ZPLParser {
  private commands: ZPLCommand[] = [];
  private elements: ZPLElement[] = [];
  private config: Partial<LabelConfig> = {};
  private variables: Map<string, string> = new Map();
  private currentPosition: Position = { x: 0, y: 0 };
  private currentFont: TextStyle = {
    fontFamily: 'Courier New',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    letterSpacing: 0,
    lineHeight: 1.2,
    textAlign: 'left',
  };

  /**
   * Parse raw ZPL code
   */
  parse(zplCode: string): ZPLASTParsed {
    this.reset();
    this.tokenize(zplCode);
    this.processCommands();

    return {
      commands: this.commands,
      elements: this.elements,
      config: this.config,
      variables: this.variables,
    };
  }

  /**
   * Reset parser state
   */
  private reset(): void {
    this.commands = [];
    this.elements = [];
    this.config = {};
    this.variables.clear();
    this.currentPosition = { x: 0, y: 0 };
    this.currentFont = {
      fontFamily: 'Courier New',
      fontSize: 12,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      letterSpacing: 0,
      lineHeight: 1.2,
      textAlign: 'left',
    };
  }

  /**
   * Tokenize ZPL code into commands
   */
  private tokenize(zplCode: string): void {
    const lines = zplCode.split('\n');
    let buffer = '';

    for (const line of lines) {
      buffer += line;

      // Process complete commands
      while (buffer.includes('^') || buffer.includes('~')) {
        const match = buffer.match(/^([~^][A-Z0-9]+)([^~^]*)/);
        if (!match) break;

        const [fullMatch, command, params] = match;
        this.parseCommand(command, params);
        buffer = buffer.substring(fullMatch.length);
      }
    }
  }

  /**
   * Parse individual command
   */
  private parseCommand(command: string, paramsStr: string): void {
    const params = this.parseParameters(paramsStr);

    this.commands.push({
      command,
      parameters: params,
      raw: command + paramsStr,
    });

    // Route to specific handler
    if (command === '^XA') this.handleStartLabel();
    else if (command === '^XZ') this.handleEndLabel();
    else if (command === '^FO' || command === '^FT') this.handlePosition(params);
    else if (command === '^A0' || command === '^AD' || command === '^CF') this.handleFont(command, params);
    else if (command === '^FD') this.handleTextData(params);
    else if (command === '^FB') this.handleTextBlock(params);
    else if (command === '^BC' || command === '^B3') this.handleBarcode(command, params);
    else if (command === '^BQN') this.handleQRCode(params);
    else if (command === '^GB' || command === '^GC') this.handleGraphics(command, params);
    else if (command === '^GD') this.handleDiagonal(params);
    else if (command === '^XG' || command === '~DG') this.handleImage(command, params);
    else if (command === '^PW') this.handleLabelWidth(params);
    else if (command === '^LL') this.handleLabelHeight(params);
    else if (command === '^PQ') this.handlePrintQuantity(params);
    else if (command === '^PR') this.handlePrintSpeed(params);
    else if (command === '^MD') this.handleDensity(params);
    else if (command === '^CI') this.handleCharacterSet(params);
    else if (command === '^MM') this.handleMeasurementMode(params);
    else if (command === '^LH') this.handleLabelHome(params);
    else if (command === '^LS') this.handleLabelShift(params);
    else if (command === '^FX') this.handleComment(params);
  }

  /**
   * Parse parameters from command string
   */
  private parseParameters(str: string): Record<string, any> {
    const params: Record<string, any> = {};
    const parts = str.split(',');

    for (let i = 0; i < parts.length; i++) {
      const value = parts[i].trim();
      params[`p${i}`] = value;
    }

    return params;
  }

  /**
   * Handlers for each command type
   */

  private handleStartLabel(): void {
    this.elements = [];
    this.currentPosition = { x: 0, y: 0 };
  }

  private handleEndLabel(): void {
    // Label complete
  }

  private handlePosition(params: Record<string, any>): void {
    const x = parseInt(params.p0 || '0', 10);
    const y = parseInt(params.p1 || '0', 10);
    this.currentPosition = { x, y };
  }

  private handleFont(command: string, params: Record<string, any>): void {
    if (command === '^A0') {
      // ^A0,h,w
      const height = parseInt(params.p1 || '12', 10);
      this.currentFont.fontSize = height;
    } else if (command === '^AD') {
      // ^AD,h,w
      const height = parseInt(params.p1 || '12', 10);
      this.currentFont.fontSize = height;
      this.currentFont.fontWeight = 'bold';
    } else if (command === '^CF') {
      // ^CF0,h
      const height = parseInt(params.p1 || '12', 10);
      this.currentFont.fontSize = height;
    }
  }

  private handleTextData(params: Record<string, any>): void {
    const content = params.p0 || '';
    if (!content) return;

    const textElement: TextElement = {
      id: uuidv4(),
      type: 'text',
      position: { ...this.currentPosition },
      size: {
        width: content.length * (this.currentFont.fontSize * 0.6),
        height: this.currentFont.fontSize,
      },
      transform: {
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: this.elements.length,
      content,
      style: { ...this.currentFont },
      color: '#000000',
    };

    this.elements.push(textElement);
  }

  private handleTextBlock(params: Record<string, any>): void {
    // ^FB,w,h,c,l,a
    const width = parseInt(params.p0 || '100', 10);
    const height = parseInt(params.p1 || '100', 10);
    const alignment = params.p4 || 'L';

    this.currentFont.textAlign = alignment === 'C' ? 'center' : alignment === 'R' ? 'right' : 'left';
  }

  private handleBarcode(command: string, params: Record<string, any>): void {
    const barcodeType = command === '^BC' ? 'code128' : 'code39';
    const height = parseInt(params.p1 || '50', 10);
    const data = params.p2 || '';

    if (!data) return;

    const barcodeElement: BarcodeElement = {
      id: uuidv4(),
      type: 'barcode',
      position: { ...this.currentPosition },
      size: {
        width: data.length * 8,
        height,
      },
      transform: {
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: this.elements.length,
      barcodeType: barcodeType as any,
      data,
      height,
      width: data.length * 8,
      barWidth: 2,
      showLabel: true,
      labelPosition: 'bottom',
      labelFont: 'Courier New',
      labelSize: 10,
      color: '#000000',
    };

    this.elements.push(barcodeElement);
  }

  private handleQRCode(params: Record<string, any>): void {
    const size = parseInt(params.p1 || '100', 10);
    const errorCorrection = (params.p2 || 'M') as 'L' | 'M' | 'Q' | 'H';
    const data = params.p3 || '';

    if (!data) return;

    const qrElement: QRCodeElement = {
      id: uuidv4(),
      type: 'qrcode',
      position: { ...this.currentPosition },
      size: {
        width: size,
        height: size,
      },
      transform: {
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: this.elements.length,
      data,
      errorCorrection,
      color: '#000000',
    };

    this.elements.push(qrElement);
  }

  private handleGraphics(command: string, params: Record<string, any>): void {
    const width = parseInt(params.p0 || '10', 10);
    const height = parseInt(params.p1 || '10', 10);
    const thickness = parseInt(params.p2 || '1', 10);

    if (command === '^GB') {
      // Box
      const boxElement: BoxElement = {
        id: uuidv4(),
        type: 'box',
        position: { ...this.currentPosition },
        size: { width, height },
        transform: {
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        },
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: this.elements.length,
        strokeWidth: thickness,
        strokeColor: '#000000',
        borderRadius: 0,
        strokeStyle: 'solid',
      };
      this.elements.push(boxElement);
    }
  }

  private handleDiagonal(params: Record<string, any>): void {
    // ^GD,w,h,t,c
    const width = parseInt(params.p0 || '10', 10);
    const height = parseInt(params.p1 || '10', 10);
    const thickness = parseInt(params.p2 || '1', 10);

    const lineElement: LineElement = {
      id: uuidv4(),
      type: 'line',
      position: { ...this.currentPosition },
      size: { width, height },
      transform: {
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: this.elements.length,
      x1: this.currentPosition.x,
      y1: this.currentPosition.y,
      x2: this.currentPosition.x + width,
      y2: this.currentPosition.y + height,
      strokeWidth: thickness,
      strokeColor: '#000000',
      strokeStyle: 'solid',
    };

    this.elements.push(lineElement);
  }

  private handleImage(command: string, params: Record<string, any>): void {
    const src = params.p0 || '';
    const scaleX = parseInt(params.p1 || '1', 10);
    const scaleY = parseInt(params.p2 || '1', 10);

    if (!src) return;

    const imageElement: ImageElement = {
      id: uuidv4(),
      type: 'image',
      position: { ...this.currentPosition },
      size: {
        width: 100 * scaleX,
        height: 100 * scaleY,
      },
      transform: {
        rotation: 0,
        scaleX,
        scaleY,
      },
      visible: true,
      locked: false,
      opacity: 1,
      zIndex: this.elements.length,
      src,
      format: src.includes('.grf') ? 'grf' : src.includes('.z64') ? 'z64' : 'png',
      compression: 'none',
      monochrome: true,
      threshold: 128,
    };

    this.elements.push(imageElement);
  }

  private handleLabelWidth(params: Record<string, any>): void {
    const width = parseInt(params.p0 || '100', 10);
    this.config.width = width / 8; // Convert to mm (assuming 8 dots per mm at 203 DPI)
  }

  private handleLabelHeight(params: Record<string, any>): void {
    const height = parseInt(params.p0 || '100', 10);
    this.config.height = height / 8;
  }

  private handlePrintQuantity(params: Record<string, any>): void {
    // ^PQ,q,o,r,o
    // Not directly affecting elements
  }

  private handlePrintSpeed(params: Record<string, any>): void {
    const speed = params.p0 || '3';
    const speedMap: Record<string, any> = {
      '1': 'slow',
      '2': 'slow',
      '3': 'normal',
      '4': 'fast',
      '5': 'fast',
    };
    this.config.printSpeed = speedMap[speed] || 'normal';
  }

  private handleDensity(params: Record<string, any>): void {
    const density = parseInt(params.p0 || '15', 10);
    this.config.density = density;
  }

  private handleCharacterSet(params: Record<string, any>): void {
    // Character set configuration
  }

  private handleMeasurementMode(params: Record<string, any>): void {
    const mode = params.p0 || 'D';
    // D = dots, I = inches, M = mm
  }

  private handleLabelHome(params: Record<string, any>): void {
    const x = parseInt(params.p0 || '0', 10);
    const y = parseInt(params.p1 || '0', 10);
    this.currentPosition = { x, y };
  }

  private handleLabelShift(params: Record<string, any>): void {
    // Label shift offset
  }

  private handleComment(params: Record<string, any>): void {
    // Comments are ignored
  }

  /**
   * Get parsed result
   */
  getResult(): ZPLASTParsed {
    return {
      commands: this.commands,
      elements: this.elements,
      config: this.config,
      variables: this.variables,
    };
  }

  /**
   * Validate ZPL code
   */
  static validate(zplCode: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!zplCode.includes('^XA')) {
      errors.push('Missing ^XA (start label)');
    }
    if (!zplCode.includes('^XZ')) {
      errors.push('Missing ^XZ (end label)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

/**
 * Convenience function to parse ZPL
 */
export function parseZPL(zplCode: string): ZPLASTParsed {
  const parser = new ZPLParser();
  return parser.parse(zplCode);
}

/**
 * Convenience function to validate ZPL
 */
export function validateZPL(zplCode: string): { valid: boolean; errors: string[] } {
  return ZPLParser.validate(zplCode);
}
