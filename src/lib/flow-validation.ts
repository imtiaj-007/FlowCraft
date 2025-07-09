import { Edge } from "reactflow";

/**
 * Validates if the target node already has an incoming edge.
 * @param edges - The current edges in the flow.
 * @param targetNodeId - The ID of the target node.
 * @returns `true` if the target node has no incoming edges, `false` otherwise.
 */
export const validateTargetNode = (edges: Edge[], targetNodeId: string): boolean => {
    return !edges.some((edge) => edge.target === targetNodeId);
};