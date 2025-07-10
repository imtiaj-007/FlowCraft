# Chatbot Flow Builder

A modern drag-and-drop chatbot flow builder built with:
- Next.js 15
- TypeScript
- ShadCN UI components
- Tailwind CSS
- Lucide icons
- React Flow

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://flow-craft-dun.vercel.app/)


## Key Features

- **Drag-and-Drop Interface** - Intuitive node placement and connections
- **Real-Time Validation** - Checks for empty nodes and disconnected flows
- **Type-Safe Architecture** - Full TypeScript support
- **Responsive Design** - Works across desktop, tablet and mobile devices
- **Undo/Redo Support** - (Planned for v2)
- **Export/Import Flows** - (Planned for v2)


## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI components
- **Flow Builder**: React Flow
- **Icons**: Lucide
- **State Management**: Zustand
- **Form Validation**: Custom validation (future improvement: add zod validations)

## Project Structure

```bash
frontend/
├── src/
│   ├── app/                  # Next.js app router
│   ├── components/
│   │   ├── flow-builder/
│   │   │   ├── flow-builder.tsx
│   │   │   ├── flow-canvas.tsx
│   │   │   ├── nodes/
│   │   │   │   ├── message-node.tsx
│   │   │   │   ├── node-types.ts
│   │   │   └── panels/
│   │   │       ├── nodes-panel.tsx
│   │   │       └── settings-panel.tsx
│   │   └── ui/               # ShadCN components
│   ├── constants/
│   │   └── flowConstants.ts
│   ├── lib/
│   │   ├── flow-helpers.ts
│   │   ├── flow-validation.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── flowStore.ts
│   │   └── slices/           # Zustand slices
│   ├── types/
│   │   └── flow.ts
│   └── styles/               # Global styles
├── public/                   # Static assets
├── package.json
└── README.md
```

## Core Components

| Component | Purpose | Key Technologies |
|-----------|---------|------------------|
| [`FlowBuilder`](src/components/flow-builder/flow-builder.tsx) | Root provider | ReactFlow, ErrorBoundary |
| [`FlowCanvas`](src/components/flow-builder/flow-canvas.tsx) | Main workspace | ReactFlow, Zustand |
| [`MessageNode`](src/components/flow-builder/nodes/message-node.tsx) | Message node UI | ReactFlow Handles, Tailwind |
| [`NodesPanel`](src/components/flow-builder/panels/nodes-panel.tsx) | Node library | Drag-and-Drop API |
| [`SettingsPanel`](src/components/flow-builder/panels/settings-panel.tsx) | Property editor | Controlled forms |


## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.


## Key Design Patterns

1. **State Management**  
   Uses Zustand for atomic flow state updates with middleware support

2. **Node Architecture**  
   Component registry pattern enables pluggable node types

3. **Validation System**  
   Decoupled validation rules with error recovery

```typescript
// Example validation rule
const validateFlow = (nodes, edges) => {
  // Check for empty nodes
  return emptyNodes.length ? 'Empty nodes detected' : null;
}
```

## Use Cases

1. **Chatbot Flows**  
   Build conversational logic with message nodes

2. **Workflow Automation**  
   Design approval processes and conditional paths

3. **Educational Tools**  
   Create interactive learning diagrams


## API Reference

| Hook | Description |
|------|-------------|
| `useFlowStore` | Access nodes, edges, and actions |
| `useNodeTypes` | Get registered node components |
| `useFlowValidation` | Run integrity checks |


## Development

To add a new node type:
1. Create a new component in `src/components/flow-builder/nodes/`
2. Add the node type to `node-types.ts`
3. Register it in the nodes panel


## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).


## Roadmap

- [x] Basic node connections
- [x] Real-time validation
- [ ] Version history (undo/redo)
- [ ] Custom node templates
- [ ] Collaborative editing


## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -am 'Add feature xyz'`)
4. Push to branch (`git push origin feature/xyz`)
5. Open pull request


## License

MIT © [SK Imtiaj Uddin] 2025