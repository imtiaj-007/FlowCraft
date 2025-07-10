/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import { Connection, Edge, MarkerType } from "reactflow";
import { FlowNode, MessageNodeData } from '@/types/flow';
import { flowConstants } from '@/constants/flowConstants';


const { NODE_HEIGHT, NODE_WIDTH, VERTICAL_GAP } = flowConstants;

/**
 * Creates a new edge (connection) between two nodes.
 * @param connection - The connection object containing `source` and `target` node IDs.
 * @param color - Optional color for the edge (default: '#14b8a6').
 * @returns A new `Edge` object with a unique ID, arrow marker, and styling.
 */
export const createEdge = (connection: Connection, color: string = '#14b8a6'): Edge => ({
    ...connection,
    id: `edge-${uuidv4()}`,
    source: connection.source || '',
    target: connection.target || '',
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { strokeWidth: 2, stroke: color },
});

/**
 * Creates a new node with a unique ID, type, position, and data.
 * @param type - The type of the node (e.g., 'messageNode').
 * @param position - The `{ x, y }` coordinates of the node.
 * @param data - The node's data payload (e.g., `MessageNodeData`).
 * @returns A new `FlowNode` object.
 */
export const createNode = (
    type: string, position: { x: number; y: number }, data: MessageNodeData): FlowNode => (
    {
        id: `node-${uuidv4()}`,
        type, data, position
    });

/**
 * Checks if a new node at `(x, y)` would overlap with any existing nodes.
 * @param x - The x-coordinate of the new node.
 * @param y - The y-coordinate of the new node.
 * @param existingNodes - Array of existing nodes to check against.
 * @returns `true` if the new node overlaps with any existing node, `false` otherwise.
 * 
 * Note: Overlap is determined by comparing the distance between nodes to `NODE_WIDTH` and `NODE_HEIGHT`.
 */
export const isOverlapping = (x: number, y: number, existingNodes: any[]) => {
    return existingNodes.some(n => {
        const dx = Math.abs(n.position.x - x);
        const dy = Math.abs(n.position.y - y);
        return dx < NODE_WIDTH && dy < NODE_HEIGHT;
    });
};

/**
 * Finds a non-overlapping position for a new node relative to a base position.
 * Uses a "spiral" algorithm to alternate between upward and downward offsets.
 * @param baseX - The starting x-coordinate for the new node.
 * @param baseY - The starting y-coordinate for the new node.
 * @param existingNodes - Array of existing nodes to avoid overlaps with.
 * @returns A non-overlapping `{ x, y }` position.
 * 
 * Algorithm:
 * 1. Start at `(baseX, baseY)`.
 * 2. If the position overlaps, alternate between moving `VERTICAL_GAP` pixels up and down.
 * 3. Repeat until a non-overlapping position is found.
 */
export const findNonOverlappingPosition = (
    baseX: number,
    baseY: number,
    existingNodes: any[]
) => {
    const x = baseX, y = baseY;
    let yOffset = 0;
    let direction = 1; // Start with downward direction
    let iteration = 0;

    while (isOverlapping(x, y + yOffset, existingNodes)) {
        iteration++;
        // Alternate direction based on iteration count:
        // Odd iterations: move down (+direction).
        // Even iterations: move up (-direction).
        direction = iteration % 2 === 1 ? 1 : -1;
        yOffset = Math.ceil(iteration / 2) * VERTICAL_GAP * direction;
    }

    return { x, y: y + yOffset };
};