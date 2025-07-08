# Chatbot Flow Builder

A modern drag-and-drop chatbot flow builder built with:
- Next.js 15
- TypeScript
- ShadCN UI components
- Tailwind CSS
- Lucide icons
- React Flow

## Features
- Visual flow builder with drag-and-drop nodes
- Custom node types for different chatbot interactions
- Real-time flow validation
- Responsive UI with dark/light mode support
- State management with Zustand

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI components
- **Flow Builder**: React Flow
- **Icons**: Lucide
- **State Management**: Zustand
- **Form Validation**: Custom validation library

## Getting Started

First, install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure
Key directories:
- `src/app`: Next.js app router pages
- `src/components/flow-builder`: Flow builder components
  - `nodes/`: Custom node components
  - `panels/`: Side panels for nodes and settings
- `src/hooks`: Custom hooks for state and validation
- `src/lib`: Utility functions and validation logic
- `src/types`: TypeScript type definitions

## Development
To add a new node type:
1. Create a new component in `src/components/flow-builder/nodes/`
2. Add the node type to `node-types.ts`
3. Register it in the nodes panel

## Deployment
The easiest way to deploy is via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.