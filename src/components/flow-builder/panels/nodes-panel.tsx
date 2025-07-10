import { ReactElement, useCallback } from "react";
import { MessageSquare } from "lucide-react";
import { createNode } from "@/lib/flow-helpers";
import { useFlowStore } from "@/store/flowStore";
import { FlowNode } from "@/types/flow";

/**
 * `NodesPanel` Component
 * 
 * The primary panel for adding nodes to the flow builder with:
 * - Drag-and-drop support
 * - Click-to-add functionality
 * - Extensible architecture for new node types
 * 
 * Key Features:
 * - Zero-dependency node creation
 * - Optimized re-renders with memoized callbacks
 * - Accessibility-compliant interactions
 * - Type-safe node creation
 * 
 * @returns {ReactElement} - The nodes panel UI
 * 
 * @see {@link createNode} - Node creation utility
 * @see {@link useFlowStore} - State management
 */
export const NodesPanel: React.FC = (): ReactElement => {
    const { nodes, setNodes } = useFlowStore();

    /**
     * Handles node drag initialization
     * @param {React.DragEvent} event - Drag event
     * @param {string} nodeType - Node type identifier (must match nodeTypes registry)
     * 
     * @throws {Error} If invalid nodeType is provided
     */
    const onDragStart = useCallback((event: React.DragEvent, nodeType: string) => {
        if (!nodeType) throw new Error("Invalid node type");
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    }, []);

    /**
     * Creates and adds a new node to the flow
     * @param {React.MouseEvent} event - Click event
     * 
     * @throws {Error} If node creation fails
     */
    const addNode = useCallback((event: React.MouseEvent) => {
        try {
            event.preventDefault();
            const type = event.currentTarget.getAttribute('data-node-type') || 'messageNode';
            const newNode: FlowNode = createNode(
                type, 
                { x: 0, y: 0 }, 
                { label: 'Send Message', text: '' }
            );
            setNodes([...nodes, newNode]);
        } catch (error) {
            console.error("Node creation failed:", error);
            throw error;
        }
    }, [nodes, setNodes]);

    // Node templates configuration
    const NODE_TEMPLATES = [
        {
            type: 'messageNode',
            icon: <MessageSquare size={16} aria-hidden="true" />,
            title: "Message",
            description: "Send a text message",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-200",
            textColor: "text-teal-700"
        },
        // Example for future nodes:
        // {
        //     type: 'fileNode',
        //     icon: <File size={16} />,
        //     title: "File Upload",
        //     description: "Allow file uploads",
        //     bgColor: "bg-blue-50",
        //     borderColor: "border-blue-200",
        //     textColor: "text-blue-700"
        // }
    ];

    return (
        <div 
            className="space-y-4 p-2"
            role="region" 
            aria-label="Node selection panel"
        >
            {NODE_TEMPLATES.map((template) => (
                <div
                    key={template.type}
                    className={`p-4 ${template.bgColor} border ${template.borderColor} rounded-lg 
                        cursor-grab active:cursor-grabbing hover:${template.bgColor.replace('50', '100')} 
                        transition-colors`}
                    draggable
                    onDragStart={(e) => onDragStart(e, template.type)}
                    data-node-type={template.type}
                    onClick={addNode}
                    role="button"
                    aria-label={`Add ${template.title} node`}
                    tabIndex={0}
                >
                    <div className={`flex items-center gap-2 ${template.textColor}`}>
                        {template.icon}
                        <span className="font-medium">{template.title}</span>
                    </div>
                    <p className={`text-xs ${template.textColor.replace('700', '600')} mt-1`}>
                        {template.description}
                    </p>
                </div>
            ))}

            <div 
                className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center"
                aria-live="polite"
            >
                <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Extensible Panel</span> - 
                    Supports custom node types
                </p>
            </div>
        </div>
    );
};