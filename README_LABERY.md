# Labery ZPL Editor

**Professional Desktop Application for ZPL Label Rendering, Visual Editing, and Thermal Printing**

A complete offline alternative to Labelary Viewer with advanced visual editing, thermal printer optimization, and multi-format export capabilities.

## 🎯 Features

### Core Functionality
- ✅ **Complete ZPL Support**: Parse and render all major ZPL commands
- ✅ **Visual Editor**: Drag, resize, rotate, and edit label elements
- ✅ **Real-time Preview**: Instant preview of changes
- ✅ **Multi-format Export**: PDF, PNG, SVG, and ZPL
- ✅ **100% Offline**: No internet required, no cloud dependencies
- ✅ **Professional UI**: Modern interface with dark mode support

### Advanced Features
- 🔧 **Thermal Optimization**: Automatic detection and correction of thermal printing issues
- 📐 **Precision Tools**: Grid, ruler, snap-to-grid, zoom controls
- 🎨 **Element Editing**: Full control over text, barcodes, QR codes, images, shapes
- 📋 **Templates**: Save and reuse label templates with dynamic variables
- 🖨️ **Printer Support**: Compatible with Zebra, Elgin, Argox, TSC, Datamax
- ⌨️ **Keyboard Shortcuts**: Professional workflow with Ctrl+Z, Ctrl+S, etc.
- 🌙 **Dark Mode**: Eye-friendly interface for extended work sessions

### Supported Elements
- Text with advanced typography
- Code128, Code39, EAN, UPC barcodes
- QR Codes with error correction
- DataMatrix and PDF417
- Lines, boxes, circles
- Images (GRF, Z64, PNG, JPEG, BMP)
- Grouped elements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.8+ (for some build dependencies)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/labery-zpl-editor.git
cd labery-zpl-editor

# Install dependencies
pnpm install

# Start development server
pnpm dev

# In another terminal, start Electron (when ready)
pnpm electron-dev
```

### Build for Production

```bash
# Build web version
pnpm build

# Build Electron app
pnpm build:electron

# Distribute
pnpm dist
```

## 📁 Project Structure

```
labery-zpl-editor/
├── client/                      # React frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # UI components
│   │   ├── lib/
│   │   │   ├── zpl/            # ZPL parser, renderer, optimization
│   │   │   ├── export/         # Export utilities (PDF, PNG, SVG, ZPL)
│   │   │   └── templates.ts    # Template management
│   │   ├── store/              # Zustand state management
│   │   ├── hooks/              # Custom React hooks
│   │   └── App.tsx
│   └── index.html
├── electron/                    # Electron main process
│   ├── main.ts                 # Window creation, menu
│   └── preload.ts              # IPC bridge
├── ARCHITECTURE.md             # Detailed architecture docs
├── electron-builder.json       # Build configuration
└── package.json
```

## 🎓 Usage Guide

### Basic Workflow

1. **Import ZPL Code**
   - Paste ZPL code in the code editor
   - Preview updates in real-time

2. **Edit Visually**
   - Click elements to select them
   - Drag to move, handles to resize
   - Properties panel for detailed editing

3. **Optimize**
   - Click the lightning icon to analyze
   - Apply automatic optimizations
   - Check thermal printing suggestions

4. **Export**
   - Choose format (PDF, PNG, SVG, ZPL)
   - Configure export options
   - Download or print

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+S` / `Cmd+S` | Save |
| `Ctrl+E` / `Cmd+E` | Export |
| `Ctrl+P` / `Cmd+P` | Print |
| `Delete` | Delete selected |
| `Escape` | Deselect all |
| `Arrow Keys` | Move selected |
| `Ctrl++` / `Cmd++` | Zoom in |
| `Ctrl+-` / `Cmd+-` | Zoom out |

### Templates

```typescript
// Save a template
const template = saveTemplate(
  'Shipping Label',
  'Standard shipping label template',
  zplCode,
  elements,
  [
    { name: 'recipient_name', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
  ]
);

// Use template with variables
const result = createLabelFromTemplate(templateId, {
  recipient_name: 'John Doe',
  address: '123 Main St',
});
```

## 🔧 Architecture

### ZPL Parser
- Tokenizes raw ZPL code
- Generates Abstract Syntax Tree (AST)
- Converts to visual elements
- Supports all major ZPL commands

### Renderer
- React-Konva for interactive canvas
- Real-time rendering
- Multiple DPI support (203, 300, 600)
- Zoom and pan controls

### State Management
- Zustand for global state
- Undo/redo history
- Persistent preferences
- Element selection and editing

### Export System
- Canvas rendering for raster formats
- SVG generation for scalable output
- PDF with thermal printer optimization
- ZPL code regeneration

### Thermal Optimization
- Automatic issue detection
- Smart suggestions
- One-click fixes
- Printer-specific compensation

## 📊 Supported ZPL Commands

### Basic Commands
- `^XA` - Start label
- `^XZ` - End label
- `^FO` - Field origin (position)
- `^FT` - Field origin (position, alternative)

### Font Commands
- `^A0` - Scalable font
- `^AD` - Scalable font (bold)
- `^CF` - Change font

### Text Commands
- `^FD` - Field data
- `^FB` - Field block
- `^FS` - Field separator

### Barcode Commands
- `^BC` - Code128 barcode
- `^B3` - Code39 barcode
- `^BE` - EAN13 barcode
- `^BU` - UPCA barcode

### Graphics Commands
- `^GB` - Graphic box
- `^GC` - Graphic circle
- `^GD` - Graphic diagonal line

### QR Code
- `^BQN` - QR code

### Image Commands
- `^XG` - Retrieve graphic
- `~DG` - Download graphics

### Configuration Commands
- `^PW` - Print width (label width)
- `^LL` - Label length (label height)
- `^PQ` - Print quantity
- `^PR` - Print speed
- `^MD` - Darkness/density
- `^CI` - Character set
- `^MM` - Measurement mode
- `^LH` - Label home

## 🐛 Troubleshooting

### ZPL Not Parsing
- Ensure code starts with `^XA` and ends with `^XZ`
- Check for unsupported commands (see supported list)
- Validate syntax in code editor

### Poor Print Quality
- Click thermal optimization button
- Check printer settings (DPI, darkness)
- Increase font sizes and barcode heights
- Use bold fonts for better visibility

### Export Issues
- Ensure all elements are visible
- Check file permissions
- Try different export format
- Verify label dimensions

## 📦 Dependencies

### Core
- React 19
- TypeScript
- TailwindCSS 4
- Zustand
- shadcn/ui

### Desktop
- Electron 42
- Electron-builder

### Export
- jsPDF
- canvas
- qrcode
- barcode

### Utilities
- Zod (validation)
- UUID (identifiers)

## 🔐 Security

- 100% offline operation
- No external API calls
- No telemetry or tracking
- Local storage only
- Input validation with Zod

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- 📖 [Documentation](./ARCHITECTURE.md)
- 🐛 [Issue Tracker](https://github.com/yourusername/labery-zpl-editor/issues)
- 💬 [Discussions](https://github.com/yourusername/labery-zpl-editor/discussions)

## 🎯 Roadmap

- [ ] Advanced barcode types (PDF417, DataMatrix)
- [ ] Batch printing support
- [ ] Print queue management
- [ ] Network printer discovery
- [ ] Cloud template sync
- [ ] Collaborative editing
- [ ] Mobile app (React Native)
- [ ] API for integration

## ✨ Credits

Built with ❤️ by the Labery team

---

**Labery ZPL Editor** - Professional thermal label editing, offline and unlimited.
