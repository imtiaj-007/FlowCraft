# Library Utilities

This directory contains utility functions for managing flow/graph UIs (`reactflow`), validation, and general-purpose helpers. Below is the documentation for each file and its functions.

---

## `flow-helpers.ts`
Utilities for creating and managing nodes and edges in a flow.

### `createEdge(connection: Connection, color?: string): Edge`
Creates a new edge (connection) between two nodes.

#### Parameters:
- `connection`: An object with `source` (node ID) and `target` (node ID) properties.
- `color` (optional): The edge color (default: `'#14b8a6'`).

#### Returns:
An `Edge` object with:
- A unique ID (`edge-${uuid}`).
- Arrow marker styling.
- Stroke width and color.

#### Example:
```typescript
const edge = createEdge({ source: 'node-1', target: 'node-2' }, '#ff0000');
```

---

### `createNode(type: string, position: { x: number; y: number }, data: MessageNodeData): FlowNode`
Creates a new node with a unique ID, type, position, and data.

#### Parameters:
- `type`: The node type (e.g., `'messageNode'`).
- `position`: The `{ x, y }` coordinates for the node.
- `data`: The node's data payload (e.g., `MessageNodeData`).

#### Returns:
A `FlowNode` object with:
- A unique ID (`node-${uuid}`).
- The provided `type`, `position`, and `data`.

#### Example:
```typescript
const node = createNode('messageNode', { x: 100, y: 200 }, { label: 'Send Message', text: 'Hello!' });
```

---

### `isOverlapping(x: number, y: number, existingNodes: FlowNode[]): boolean`
Checks if a new node at `(x, y)` would overlap with any existing nodes.

#### Parameters:
- `x`, `y`: The coordinates of the new node.
- `existingNodes`: An array of existing nodes to check against.

#### Returns:
- `true` if the new node overlaps with any existing node (based on `NODE_WIDTH` and `NODE_HEIGHT`).
- `false` otherwise.

#### Example:
```typescript
const overlaps = isOverlapping(100, 200, nodesArray);
```

---

### `findNonOverlappingPosition(baseX: number, baseY: number, existingNodes: FlowNode[]): { x: number; y: number }`
Finds a non-overlapping position for a new node relative to a base position using a "spiral" algorithm.

#### Parameters:
- `baseX`, `baseY`: The starting coordinates for the new node.
- `existingNodes`: An array of existing nodes to avoid overlaps with.

#### Returns:
A non-overlapping `{ x, y }` position.

#### Algorithm:
1. Starts at `(baseX, baseY)`.
2. If the position overlaps, alternates between moving `VERTICAL_GAP` pixels **up** and **down**.
3. Repeats until a non-overlapping position is found.

#### Example:
```typescript
const position = findNonOverlappingPosition(100, 100, nodesArray);
// Returns { x: 100, y: 100 } or an adjusted position.
```

---

### Constants
The following constants (imported from `flowConstants`) are used:
- `NODE_WIDTH`: The width of a node (used for overlap checks).
- `NODE_HEIGHT`: The height of a node (used for overlap checks).
- `VERTICAL_GAP`: The vertical spacing between nodes (used in `findNonOverlappingPosition`).

---

### Usage Notes
1. **Edge Validation**: Use `createEdge` in conjunction with validation logic (e.g., ensuring a target node has no existing incoming edges).
2. **Node Placement**: Use `findNonOverlappingPosition` to dynamically place new nodes without overlaps.
3. **Type Safety**: All functions are typed for use with `reactflow` (`Edge`, `FlowNode`, etc.).

---

## `flow-validation.ts`
Validation rules for flow/graph integrity.

### `validateTargetNode(edges: Edge[], targetNodeId: string): boolean`
Validates if a target node already has an incoming edge.

#### Parameters:
- `edges`: Array of existing edges.
- `targetNodeId`: ID of the target node to validate.

#### Returns:
- `true` if the target node has no incoming edges.
- `false` otherwise.

#### Example:
```typescript
const isValid = validateTargetNode(edgesArray, 'node-2');
if (isValid) {
    // Proceed with edge creation
}
```

#### Use Case:
Prevent multiple edges from connecting to the same target node (e.g., enforce "one source per target" logic).

---

## `utils.ts`
General-purpose utility functions.

### `cn(...inputs: ClassValue[]): string`
Merges Tailwind CSS classes conditionally using `clsx` and `tailwind-merge`.

#### Parameters:
- `inputs`: Class names or conditional class objects.

#### Returns:
A merged class string.

#### Example:
```typescript
const buttonClass = cn('px-4 py-2', isActive && 'bg-blue-500');
// Output: 'px-4 py-2 bg-blue-500' (if `isActive` is true)
```

#### Use Case:
Simplify dynamic class name generation in React components.

---

## Example Workflow
```typescript
import { createEdge, createNode, findNonOverlappingPosition } from './flow-helpers';
import { validateTargetNode } from './flow-validation';
import { cn } from './utils';

// Create nodes and edges
const nodeA = createNode('messageNode', { x: 100, y: 100 }, { label: 'Node A' });
const nodeB = createNode('messageNode', findNonOverlappingPosition(150, 100, [nodeA]), { label: 'Node B' });

// Validate and connect
if (validateTargetNode([], nodeB.id)) {
    const edge = createEdge({ source: nodeA.id, target: nodeB.id });
}

// Style a button dynamically
const buttonClass = cn('btn', isDisabled && 'opacity-50');
```

---

### Key Features of the README:
1. **Function Documentation**: Each function is clearly described with parameters, return values, and examples.
2. **Algorithm Explanation**: The "spiral" logic in `findNonOverlappingPosition` is explained in detail.
3. **Usage Notes**: Practical tips for integrating the helpers into your workflow.
4. **Example Workflow**: A full example demonstrating how to use the functions together.