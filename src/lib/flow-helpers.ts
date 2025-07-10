/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid';
import { Connection, Edge, MarkerType } from "reactflow";
import { FlowNode, MessageNodeData } from '@/types/flow';
import { flowConstants } from '@/constants/flowConstants';


const { NODE_HEIGHT, NODE_WIDTH, VERTICAL_GAP } = flowConstants;

export const createEdge = (connection: Connection, color: string = '#14b8a6'): Edge => ({
    ...connection,
    id: `edge-${uuidv4()}`,
    source: connection.source || '',
    target: connection.target || '',
    markerEnd: { type: MarkerType.ArrowClosed, color },
    style: { strokeWidth: 2, stroke: color },
});

export const createNode = (
    type: string, position: { x: number; y: number }, data: MessageNodeData): FlowNode => (
    {
        id: `node-${uuidv4()}`,
        type, data, position
    });

export const isOverlapping = (x: number, y: number, existingNodes: any[]) => {
    return existingNodes.some(n => {
        const dx = Math.abs(n.position.x - x);
        const dy = Math.abs(n.position.y - y);
        return dx < NODE_WIDTH && dy < NODE_HEIGHT;
    });
};

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
        // Alternate direction based on iteration count
        // Odd iterations go down, even go up
        direction = iteration % 2 === 1 ? 1 : -1;
        yOffset = Math.ceil(iteration / 2) * VERTICAL_GAP * direction;
    }

    return { x, y: y + yOffset };
};