# Labery ZPL Editor - Arquitetura Completa

## Visão Geral
Aplicação desktop profissional para renderização, edição visual e impressão de etiquetas térmicas ZPL. Funciona 100% offline com suporte completo a comandos ZPL, otimização térmica e exportação multi-formato.

## Stack Tecnológico

### Frontend
- **React 19** + TypeScript: Interface moderna e type-safe
- **TailwindCSS 4**: Estilização utilitária
- **React-Konva**: Canvas interativo para edição visual
- **Zustand**: Gerenciamento de estado global
- **shadcn/ui**: Componentes UI profissionais

### Desktop
- **Electron 42**: Aplicação desktop cross-platform
- **Electron-Builder**: Build e distribuição

### Exportação & Impressão
- **jsPDF**: Geração de PDFs
- **canvas**: Renderização de imagens
- **qrcode**: Geração de QR codes
- **barcode**: Geração de códigos de barras

### Validação
- **Zod**: Schema validation
- **UUID**: Identificadores únicos

## Estrutura de Pastas

```
labery-zpl-editor/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Página principal
│   │   │   ├── Editor.tsx            # Editor visual
│   │   │   └── NotFound.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── Editor/
│   │   │   │   ├── Canvas.tsx        # Renderizador Konva
│   │   │   │   ├── Toolbar.tsx       # Barra de ferramentas
│   │   │   │   ├── PropertiesPanel.tsx
│   │   │   │   ├── ElementTree.tsx   # Árvore de elementos
│   │   │   │   └── CodeEditor.tsx    # Editor ZPL
│   │   │   ├── Preview/
│   │   │   │   ├── PreviewPanel.tsx
│   │   │   │   └── RulerGuide.tsx
│   │   │   └── Dialogs/
│   │   │       ├── ExportDialog.tsx
│   │   │       ├── PrintDialog.tsx
│   │   │       └── TemplateDialog.tsx
│   │   ├── hooks/
│   │   │   ├── useZPLParser.ts
│   │   │   ├── useCanvasEditor.ts
│   │   │   ├── useKeyboardShortcuts.ts
│   │   │   └── useThermalOptimization.ts
│   │   ├── lib/
│   │   │   ├── zpl/
│   │   │   │   ├── parser.ts         # Parser ZPL
│   │   │   │   ├── types.ts          # Tipos ZPL
│   │   │   │   ├── renderer.ts       # Renderizador
│   │   │   │   ├── commands/
│   │   │   │   │   ├── text.ts
│   │   │   │   │   ├── barcode.ts
│   │   │   │   │   ├── qrcode.ts
│   │   │   │   │   ├── graphics.ts
│   │   │   │   │   └── image.ts
│   │   │   │   └── optimization.ts   # Otimização térmica
│   │   │   ├── export/
│   │   │   │   ├── pdf.ts
│   │   │   │   ├── png.ts
│   │   │   │   ├── svg.ts
│   │   │   │   └── zpl.ts
│   │   │   ├── print/
│   │   │   │   ├── printer.ts
│   │   │   │   └── drivers.ts
│   │   │   ├── templates.ts
│   │   │   └── utils.ts
│   │   ├── store/
│   │   │   ├── editorStore.ts        # Estado global
│   │   │   ├── preferencesStore.ts
│   │   │   └── templateStore.ts
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   └── public/
├── electron/
│   ├── main.ts                       # Processo principal Electron
│   ├── preload.ts                    # Preload script
│   └── ipc.ts                        # IPC handlers
├── shared/
│   └── types.ts                      # Tipos compartilhados
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron-builder.json
└── ARCHITECTURE.md
```

## Módulos Principais

### 1. Parser ZPL (`lib/zpl/parser.ts`)
Transforma ZPL bruto em AST (Abstract Syntax Tree) estruturado.

**Suporte a comandos:**
- `^XA` / `^XZ`: Início/fim de etiqueta
- `^FO` / `^FT`: Posicionamento
- `^A0` / `^AD` / `^CF`: Fontes
- `^FB` / `^FS`: Blocos de texto
- `^GB` / `^GC` / `^GD`: Gráficos
- `^BC` / `^BQN`: Códigos de barras
- `^FD`: Dados
- `^PQ` / `^PW` / `^LL` / `^LH`: Configurações de impressão
- `~DG` / `^XG`: Imagens
- E mais...

### 2. Renderer Canvas (`lib/zpl/renderer.ts`)
Renderiza AST em canvas usando React-Konva.

**Features:**
- Renderização em tempo real
- Suporte a múltiplas resoluções (203, 300, 600 DPI)
- Zoom infinito
- Grid de alinhamento
- Régua em mm

### 3. Editor Visual (`components/Editor/`)
Interface interativa para edição de elementos.

**Features:**
- Drag & drop
- Resize com handles
- Rotate
- Painel de propriedades
- Árvore de elementos
- Seleção múltipla

### 4. Sistema de Exportação (`lib/export/`)
Exporta para PDF, PNG, SVG e ZPL modificado.

**Features:**
- Preservação de resolução térmica
- Suporte a 203, 300, 600 DPI
- Tamanho real da etiqueta
- Compressão otimizada

### 5. Otimização Térmica (`lib/zpl/optimization.ts`)
Sistema inteligente para melhorar legibilidade em impressoras térmicas.

**Features:**
- Detecção de textos pequenos
- Engrossamento automático de linhas
- Reforço de QR codes
- Compensação térmica
- Sugestões automáticas

### 6. Sistema de Templates (`lib/templates.ts`)
Suporte a templates com variáveis dinâmicas.

**Features:**
- Placeholders: `{{nome}}`, `{{codigo}}`
- Salvamento de templates
- Integração futura com APIs

### 7. Gerenciamento de Impressoras (`lib/print/`)
Compatibilidade com múltiplas marcas.

**Suporte:**
- Zebra
- Elgin
- Argox
- TSC
- Datamax

## Fluxo de Dados

```
ZPL Bruto
    ↓
Parser (AST)
    ↓
Renderer (Canvas)
    ↓
Editor Visual (Konva)
    ↓
Exportação / Impressão
```

## Estado Global (Zustand)

```typescript
interface EditorStore {
  // Documento
  zplCode: string;
  ast: ZPLElement[];
  selectedElements: string[];
  
  // Canvas
  zoom: number;
  panX: number;
  panY: number;
  
  // Configurações
  labelWidth: number;
  labelHeight: number;
  dpi: 203 | 300 | 600;
  
  // Otimização
  thermalMode: 'normal' | 'weak' | 'strong';
  autoOptimize: boolean;
}
```

## Atalhos de Teclado

- `Ctrl+Z` / `Cmd+Z`: Desfazer
- `Ctrl+Y` / `Cmd+Y`: Refazer
- `Ctrl+C` / `Cmd+C`: Copiar
- `Ctrl+V` / `Cmd+V`: Colar
- `Ctrl+S` / `Cmd+S`: Salvar
- `Ctrl+E` / `Cmd+E`: Exportar
- `Ctrl+P` / `Cmd+P`: Imprimir
- `Delete`: Deletar selecionado
- `Arrow Keys`: Mover selecionado
- `+` / `-`: Zoom in/out

## Build & Distribuição

### Desenvolvimento
```bash
pnpm dev
```

### Build Desktop
```bash
pnpm build:electron
```

### Distribuição
- Windows: `.exe` installer
- macOS: `.dmg` package
- Linux: `.AppImage`

## Performance

- Renderização otimizada com React-Konva
- Virtualização de elementos grandes
- Cache de renderização
- Lazy loading de componentes
- Web Workers para parsing pesado

## Segurança

- Validação de entrada com Zod
- Sandbox de execução
- Sem acesso a APIs externas (100% offline)
- Validação de ZPL antes de renderizar

## Próximos Passos

1. Implementar parser ZPL completo
2. Criar renderizador canvas
3. Desenvolver editor visual
4. Adicionar exportação
5. Implementar otimização térmica
6. Criar interface polida
7. Configurar build Electron
8. Publicar no GitHub
