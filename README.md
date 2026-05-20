# 🏷️ Labery - ZPL Thermal Label Editor

**Aplicação Desktop Profissional para Renderização, Edição Visual e Impressão de Etiquetas Térmicas ZPL**

Uma alternativa completa e offline ao Labelary Viewer com edição visual avançada, otimização térmica inteligente e exportação em múltiplos formatos.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-19-61dafb)
![Electron](https://img.shields.io/badge/Electron-42-47848f)

---

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação](#documentação)
- [Atalhos de Teclado](#atalhos-de-teclado)
- [Suporte a Comandos ZPL](#suporte-a-comandos-zpl)
- [Troubleshooting](#troubleshooting)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## ✨ Características

### 🎯 Funcionalidades Principais

- **✅ Parser ZPL Completo**: Suporte a todos os comandos ZPL principais com geração de AST
- **✅ Editor Visual Avançado**: Drag & drop, resize, rotate, edição de propriedades
- **✅ Preview em Tempo Real**: Renderização instantânea de mudanças
- **✅ 100% Offline**: Funciona completamente local, sem dependência de internet
- **✅ Exportação Multi-formato**: PDF, PNG, SVG e ZPL
- **✅ Otimização Térmica**: Detecção automática e correção de problemas de impressão

### 🔧 Recursos Avançados

| Recurso | Descrição |
|---------|-----------|
| **Otimização Térmica** | Análise automática e sugestões de melhoria para qualidade de impressão |
| **Sistema de Templates** | Salve templates com variáveis dinâmicas para reutilização |
| **Múltiplas Resoluções** | Suporte a 203, 300 e 600 DPI |
| **Compatibilidade** | Zebra, Elgin, Argox, TSC, Datamax |
| **Ferramentas de Precisão** | Grid, régua, snap magnético, zoom infinito |
| **Atalhos Profissionais** | Ctrl+Z, Ctrl+S, Ctrl+P e muito mais |
| **Dark Mode** | Interface amigável para longas sessões de trabalho |
| **Undo/Redo Ilimitado** | Histórico completo de alterações |

### 📦 Elementos Suportados

- **Texto**: Com tipografia avançada, stroke, shadow
- **Códigos de Barras**: Code128, Code39, EAN, UPC, Codabar, ITF14
- **QR Codes**: Com controle de correção de erro
- **DataMatrix**: Código 2D compacto
- **PDF417**: Código de barras empilhado
- **Gráficos**: Linhas, caixas, círculos
- **Imagens**: GRF, Z64, PNG, JPEG, BMP

---

## 🛠️ Tecnologias

### Frontend
- **React 19** - UI moderna e reativa
- **TypeScript 5.6** - Type-safe development
- **TailwindCSS 4** - Estilização utilitária
- **Zustand** - Gerenciamento de estado
- **React-Konva** - Canvas interativo (pronto para implementação)
- **shadcn/ui** - Componentes UI profissionais

### Desktop
- **Electron 42** - Aplicação desktop cross-platform
- **Electron-Builder** - Build e distribuição

### Exportação & Processamento
- **jsPDF** - Geração de PDFs
- **canvas** - Renderização de imagens
- **qrcode** - Geração de QR codes
- **barcode** - Geração de códigos de barras

### Validação & Utilidades
- **Zod** - Schema validation
- **UUID** - Identificadores únicos

---

## 🚀 Instalação

### Pré-requisitos

```bash
# Node.js 18+ e pnpm
node --version  # v18.0.0 ou superior
pnpm --version  # 10.4.1 ou superior
```

### Setup Local

```bash
# 1. Clone o repositório
git clone https://github.com/kardecallan566/labery_impressora_termica.git
cd labery_impressora_termica

# 2. Instale as dependências
pnpm install

# 3. Inicie o servidor de desenvolvimento
pnpm dev

# Em outro terminal, inicie o Electron (quando pronto)
pnpm electron-dev
```

### Build para Produção

```bash
# Build web
pnpm build

# Build Electron (Windows, macOS, Linux)
pnpm build:electron

# Distribuir
pnpm dist
```

---

## 📖 Como Usar

### Fluxo Básico

#### 1️⃣ Importar Código ZPL

```
1. Cole o código ZPL no editor de código (esquerda)
2. O preview atualiza automaticamente
3. Os elementos aparecem na árvore de elementos
```

#### 2️⃣ Editar Visualmente

```
1. Clique em um elemento para selecioná-lo
2. Arraste para mover
3. Use as alças para redimensionar
4. Painel de propriedades para edição detalhada
```

#### 3️⃣ Otimizar

```
1. Clique no ícone de raio (⚡) na toolbar
2. Revise as sugestões no painel "Optimize"
3. Aplique correções automáticas
```

#### 4️⃣ Exportar

```
1. Clique em Download (↓) na toolbar
2. Escolha o formato (PDF, PNG, SVG, ZPL)
3. Configure opções de exportação
4. Clique em "Exportar"
```

### Exemplo: Criar Etiqueta de Envio

```zpl
^XA
^PW800
^LL400
^FO50,50
^A0,50
^FDJohn Doe^FS
^FO50,120
^A0,30
^FD123 Main Street^FS
^FO50,200
^BQN,2,10
^FDQA,https://example.com^FS
^XZ
```

1. Cole o código acima no editor
2. Veja a etiqueta renderizada no preview
3. Clique em ⚡ para otimizar
4. Exporte como PDF

---

## 📁 Estrutura do Projeto

```
labery-zpl-editor/
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Editor.tsx          # Página principal do editor
│   │   │   ├── Home.tsx            # Página inicial
│   │   │   └── NotFound.tsx        # 404
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── Editor/             # Componentes do editor
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── Toolbar.tsx
│   │   │   │   ├── PropertiesPanel.tsx
│   │   │   │   ├── ElementTree.tsx
│   │   │   │   └── CodeEditor.tsx
│   │   │   └── Dialogs/
│   │   ├── lib/
│   │   │   ├── zpl/                # Parser e renderizador ZPL
│   │   │   │   ├── parser.ts       # Parser com AST
│   │   │   │   ├── types.ts        # Tipos TypeScript
│   │   │   │   ├── renderer.ts     # Renderizador canvas
│   │   │   │   ├── optimization.ts # Otimização térmica
│   │   │   │   └── commands/       # Handlers de comandos
│   │   │   ├── export/             # Exportação
│   │   │   │   ├── index.ts        # API principal
│   │   │   │   ├── canvas.ts       # Renderização canvas
│   │   │   │   ├── svg.ts          # Geração SVG
│   │   │   │   └── zpl.ts          # Geração ZPL
│   │   │   ├── templates.ts        # Sistema de templates
│   │   │   └── utils.ts            # Utilidades
│   │   ├── store/
│   │   │   ├── editorStore.ts      # Estado global (Zustand)
│   │   │   └── preferencesStore.ts # Preferências
│   │   ├── hooks/
│   │   │   ├── useKeyboardShortcuts.ts
│   │   │   ├── useZPLParser.ts
│   │   │   └── useThermalOptimization.ts
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx    # Tema (light/dark)
│   │   ├── App.tsx                 # Componente raiz
│   │   ├── main.tsx                # Entry point
│   │   └── index.css               # Estilos globais
│   ├── index.html
│   └── public/
├── electron/                        # Processo principal Electron
│   ├── main.ts                     # Criação de janela, menu
│   └── preload.ts                  # Bridge IPC seguro
├── server/                         # Backend (placeholder)
├── shared/                         # Tipos compartilhados
├── ARCHITECTURE.md                 # Documentação técnica detalhada
├── README_LABERY.md                # README adicional
├── electron-builder.json           # Configuração de build
├── vite.config.ts                  # Configuração Vite
├── tsconfig.json                   # Configuração TypeScript
└── package.json                    # Dependências
```

---

## ⌨️ Atalhos de Teclado

| Atalho | Ação | Plataforma |
|--------|------|-----------|
| `Ctrl+Z` / `Cmd+Z` | Desfazer | Windows / macOS |
| `Ctrl+Y` / `Cmd+Y` | Refazer | Windows / macOS |
| `Ctrl+S` / `Cmd+S` | Salvar | Windows / macOS |
| `Ctrl+E` / `Cmd+E` | Exportar | Windows / macOS |
| `Ctrl+P` / `Cmd+P` | Imprimir | Windows / macOS |
| `Delete` / `Backspace` | Deletar selecionado | Todos |
| `Escape` | Desselecionar tudo | Todos |
| `Arrow Keys` | Mover selecionado | Todos |
| `Ctrl++` / `Cmd++` | Zoom in | Windows / macOS |
| `Ctrl+-` / `Cmd+-` | Zoom out | Windows / macOS |
| `Ctrl+0` / `Cmd+0` | Reset zoom | Windows / macOS |

---

## 📋 Suporte a Comandos ZPL

### Comandos Implementados

#### Controle de Etiqueta
| Comando | Descrição |
|---------|-----------|
| `^XA` | Início de etiqueta |
| `^XZ` | Fim de etiqueta |
| `^PW` | Largura da etiqueta (dots) |
| `^LL` | Altura da etiqueta (dots) |
| `^PQ` | Quantidade de impressão |
| `^PR` | Velocidade de impressão |
| `^MD` | Densidade/escuridão |

#### Posicionamento
| Comando | Descrição |
|---------|-----------|
| `^FO` | Origem do campo (X,Y) |
| `^FT` | Origem do campo (alternativa) |
| `^LH` | Home da etiqueta |

#### Texto
| Comando | Descrição |
|---------|-----------|
| `^A0` | Fonte escalável |
| `^AD` | Fonte escalável (bold) |
| `^CF` | Mudar fonte |
| `^FB` | Bloco de texto |
| `^FD` | Dados do campo |
| `^FS` | Separador de campo |

#### Códigos de Barras
| Comando | Descrição |
|---------|-----------|
| `^BC` | Code128 |
| `^B3` | Code39 |
| `^BE` | EAN13 |
| `^BU` | UPCA |
| `^BQN` | QR Code |

#### Gráficos
| Comando | Descrição |
|---------|-----------|
| `^GB` | Caixa gráfica |
| `^GC` | Círculo gráfico |
| `^GD` | Linha diagonal |

#### Imagens
| Comando | Descrição |
|---------|-----------|
| `^XG` | Recuperar gráfico |
| `~DG` | Download de gráfico |

#### Configuração
| Comando | Descrição |
|---------|-----------|
| `^CI` | Conjunto de caracteres |
| `^MM` | Modo de medida |
| `^FX` | Comentário |

---

## 🔍 Otimização Térmica

### Como Funciona

A otimização térmica analisa automaticamente a etiqueta e detecta problemas comuns em impressoras térmicas:

#### Problemas Detectados

1. **Textos Pequenos** (< 10pt)
   - Aumenta automaticamente para 10pt
   - Aplica bold para melhor visibilidade

2. **Linhas Finas** (< 1px)
   - Aumenta espessura mínima
   - Melhora legibilidade

3. **QR Codes Pequenos** (< 30x30mm)
   - Aumenta para tamanho mínimo recomendado
   - Aumenta correção de erro

4. **Códigos de Barras Fracos**
   - Aumenta altura mínima (20mm)
   - Aumenta espessura de barras (2px)

### Modos de Otimização

```typescript
// Normal (padrão)
thermalMode: 'normal'

// Impressoras Fracas (aumenta tudo)
thermalMode: 'weak'

// Impressoras Fortes (permite mais detalhes)
thermalMode: 'strong'
```

---

## 📤 Sistema de Templates

### Criar Template

```typescript
import { saveTemplate } from '@/lib/templates';

const template = saveTemplate(
  'Etiqueta de Envio',
  'Template padrão para etiquetas de envio',
  zplCode,
  elements,
  [
    { 
      name: 'destinatario', 
      type: 'text', 
      required: true,
      defaultValue: ''
    },
    { 
      name: 'endereco', 
      type: 'text', 
      required: true,
      defaultValue: ''
    },
    { 
      name: 'codigo_rastreamento', 
      type: 'barcode', 
      required: true,
      defaultValue: ''
    }
  ]
);
```

### Usar Template

```typescript
import { createLabelFromTemplate } from '@/lib/templates';

const result = createLabelFromTemplate(templateId, {
  destinatario: 'João Silva',
  endereco: '123 Rua Principal, São Paulo',
  codigo_rastreamento: 'BR123456789'
});

if (result.valid) {
  // Usar result.zplCode
} else {
  // Mostrar erros: result.errors
}
```

### Gerenciar Templates

```typescript
import { 
  getAllTemplates, 
  updateTemplate, 
  deleteTemplate,
  searchTemplates 
} from '@/lib/templates';

// Listar todos
const templates = getAllTemplates();

// Buscar
const encontrados = searchTemplates('envio');

// Atualizar
updateTemplate(id, { name: 'Novo Nome' });

// Deletar
deleteTemplate(id);
```

---

## 📊 Exportação

### Opções de Exportação

#### PDF
```typescript
const options: PDFExportOptions = {
  format: 'pdf',
  dpi: 203,
  quality: 95,
  compression: true,
  pageSize: 'custom',
  pageWidth: 100,
  pageHeight: 150,
  margins: { top: 0, right: 0, bottom: 0, left: 0 }
};
```

#### PNG
```typescript
const options: ExportOptions = {
  format: 'png',
  dpi: 300,
  quality: 100,
  compression: true
};
```

#### SVG
```typescript
const options: ExportOptions = {
  format: 'svg',
  dpi: 96,
  quality: 100,
  compression: false
};
```

#### ZPL
```typescript
const options: ExportOptions = {
  format: 'zpl',
  dpi: 203,
  quality: 100,
  compression: false
};
```

---

## 🐛 Troubleshooting

### ZPL Não Está Parseando

**Problema**: Código ZPL não é reconhecido

**Soluções**:
1. Verifique se começa com `^XA` e termina com `^XZ`
2. Valide a sintaxe dos comandos
3. Verifique se há comandos não suportados
4. Consulte a lista de [Comandos Suportados](#suporte-a-comandos-zpl)

### Qualidade de Impressão Ruim

**Problema**: Etiqueta fica desfocada ou ilegível

**Soluções**:
1. Clique no ícone ⚡ para otimizar automaticamente
2. Aumente o tamanho das fontes (mínimo 10pt)
3. Aumente a altura dos códigos de barras (mínimo 20mm)
4. Verifique as configurações de densidade da impressora

### Elementos Não Aparecem

**Problema**: Elementos não são renderizados no preview

**Soluções**:
1. Verifique se `visible: true` no painel de propriedades
2. Confirme se o elemento está dentro dos limites da etiqueta
3. Tente resetar o zoom (Ctrl+0)
4. Recarregue a aplicação

### Exportação Falha

**Problema**: Erro ao exportar para PDF/PNG

**Soluções**:
1. Verifique permissões de arquivo
2. Tente outro formato de exportação
3. Reduza o tamanho da etiqueta
4. Verifique espaço em disco disponível

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. **Fork** o repositório
2. **Crie uma branch** para sua feature (`git checkout -b feature/amazing-feature`)
3. **Commit** suas mudanças (`git commit -m 'Add amazing feature'`)
4. **Push** para a branch (`git push origin feature/amazing-feature`)
5. **Abra um Pull Request**

### Padrões de Código

- Use TypeScript para type safety
- Siga o padrão de formatação (Prettier)
- Adicione testes para novas features
- Atualize a documentação

---

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Suporte

- 📖 [Documentação Técnica](./ARCHITECTURE.md)
- 🐛 [Issues](https://github.com/kardecallan566/labery_impressora_termica/issues)
- 💬 [Discussões](https://github.com/kardecallan566/labery_impressora_termica/discussions)

---

## 🎯 Roadmap

- [ ] Canvas interativo com React-Konva
- [ ] Integração com impressoras reais
- [ ] Suporte a DataMatrix e PDF417
- [ ] Batch printing
- [ ] Fila de impressão
- [ ] Descoberta de impressoras de rede
- [ ] Sincronização de templates na nuvem
- [ ] Edição colaborativa
- [ ] App mobile (React Native)
- [ ] API para integração

---

## ✨ Créditos

Desenvolvido com ❤️ pela equipe Labery

**Labery ZPL Editor** - Edição profissional de etiquetas térmicas, offline e ilimitado.

---

<div align="center">

**[⬆ Voltar ao topo](#-labery---zpl-thermal-label-editor)**

</div>
