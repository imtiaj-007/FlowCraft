import { NodeTypes } from "reactflow";
import { MessageNode } from "./message-node";

/**
 * `nodeTypes` Configuration Registry
 * 
 * Central registry mapping node type identifiers to their React components.
 * Used by ReactFlow to dynamically render different node types in the flow builder.
 * 
 * Key Features:
 * - Type-safe mapping of node types to components
 * - Enables hot-swapping of node implementations
 * - Scalable architecture for future node types
 * 
 * @type {NodeTypes} - A record where:
 *   - Keys: Node type strings (must match types used in `createNode`)
 *   - Values: React components implementing the node UI
 * 
 * @example Basic Usage
 * ```tsx
 * <ReactFlow nodeTypes={nodeTypes} />
 * ```
 * 
 * @example Creating a New Node Type
 * 1. Create component (e.g., `question-node.tsx`)
 * 2. Add to registry:
 * ```ts
 * export const nodeTypes = {
 *   ...nodeTypes,
 *   questionNode: QuestionNode
 * }
 * ```
 */
export const nodeTypes: NodeTypes = {
    /**
     * Message Node Configuration
     * 
     * A node for sending text messages in the flow.
     * 
     * @see {@link MessageNode} - Implementation component
     * @see {@link createNode} - Creation utility
     * 
     * Validation Rules:
     * - Requires non-empty `text` property
     * - Allows one incoming edge, multiple outgoing edges
     */
    messageNode: MessageNode,

    // Future Node Templates:
    // questionNode: QuestionNode, // For user input prompts
    // fileNode: FileNode,        // For file upload handling
    // conditionNode: ConditionNode // For branching logic
} as const;

// Create a type that only includes string keys
type NodeTypeKeys = Extract<keyof typeof nodeTypes, string>;

/**
 * Type Guard for Node Types
 * 
 * Utility to validate node types at runtime.
 * 
 * @param type - Potential node type string
 * @returns type is keyof typeof nodeTypes
 * 
 * @example
 * ```ts
 * if (isValidNodeType(type)) {
 *   // Safe to use with nodeTypes[type]
 * }
 * ```
 */
export function isValidNodeType(type: string): type is NodeTypeKeys {
    return type in nodeTypes;
}