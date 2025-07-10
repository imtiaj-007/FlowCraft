import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '@/store/flowStore';
import { MessageSquare, Grip, AlertCircle, Plus } from 'lucide-react';
import { MessageNodeData } from '@/types/flow';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * `MessageNode` Component
 * 
 * A custom node for the flow builder that represents a "Send Message" action.
 * 
 * Key Features:
 * - Visual representation of message content with empty state handling
 * - Connection handles (source/target) with tooltips
 * - Hover-triggered "Add Node" button
 * - Validation for empty message content
 * 
 * Accessibility:
 * - Keyboard-navigable handles (via reactflow)
 * - ARIA labels for interactive elements
 * - Color contrast compliant with WCAG standards
 * 
 * @param {Object} props - Component props
 * @param {MessageNodeData} props.data - Node content and metadata
 * @param {boolean} props.selected - Visual indicator when node is selected
 * @param {string} props.id - Unique node identifier
 * 
 * @returns {React.ReactElement} - Rendered message node component
 * 
 * @see [ReactFlow Node Documentation](https://reactflow.dev/docs/api/nodes/custom-nodes/)
 */
export const MessageNode = (
    { data, selected, id }: { data: MessageNodeData; selected: boolean; id: string }
) => {
    const [hover, setHover] = useState(false);
    const { nodes, addMessageNode } = useFlowStore();
    const isEmpty = !data.text?.trim();

    /**
     * Handles adding a connected message node
     * @param {React.MouseEvent} e - Mouse event
     * @throws {Error} If current node cannot be found in store
     */
    const addNewNode = (e: React.MouseEvent) => {
        e.stopPropagation();
        const currentNode = nodes.find(node => node.id === id);
        if (!currentNode) throw new Error(`Node ${id} not found in store`);
        addMessageNode(currentNode);
    };

    return (
        <div
            className={`relative bg-white rounded-lg border-2 transition-all duration-200 z-10 
                ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
                ${isEmpty ? 'border-red-400 bg-red-100' : ''}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            data-testid="message-node"
            aria-label={`Message node: ${data.text || 'Empty message'}`}
        >
            {/* Connection Handles */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Handle
                            type="target"
                            position={Position.Left}
                            style={{ width: '10px', height: '10px', left: -6, backgroundColor: '#FFA500' }}
                            isConnectableEnd
                            aria-label="Incoming connection handle"
                        />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="text-xs">
                        Connect edges to this handle
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Handle
                            type="source"
                            position={Position.Right}
                            style={{ width: '10px', height: '10px', right: -6, backgroundColor: '#3b82f6' }}
                            aria-label="Outgoing connection handle"
                        />
                    </TooltipTrigger>
                    <TooltipContent side="top" align="center" className="text-xs">
                        Drag from this handle to connect nodes
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            {/* Node Header */}
            <div className="flex items-center gap-2 p-2 bg-teal-500 text-white rounded-t-md">
                <MessageSquare size={12} aria-hidden="true" />
                <span className="font-medium text-xs">Send Message</span>
                <Grip size={12} className="ml-auto opacity-70" aria-label="Drag handle" />
            </div>

            {/* Node Content */}
            <div className="p-2 w-[200px]">
                {data.text ? (
                    <div 
                        className="text-xs text-gray-600 break-words whitespace-pre-wrap"
                        aria-label={`Message content: ${data.text}`}
                    >
                        {data.text}
                    </div>
                ) : (
                    <div 
                        className="text-xs text-red-500 italic"
                        aria-label="Empty message content warning"
                    >
                        Enter message text
                    </div>
                )}
            </div>

            {/* Empty State Indicator */}
            {isEmpty && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div 
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                                aria-label="Error: Empty content"
                            >
                                <AlertCircle size={12} className="text-white" />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center" className="text-xs bg-red-500 fill-red-500 text-white">
                            Message content cannot be empty
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}

            {/* Add Node Button */}
            {hover && (
                <div 
                    className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20"
                    aria-label="Add connected node"
                >
                    <button
                        onClick={addNewNode}
                        className="w-5 h-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                        aria-label="Add new message node"
                    >
                        <Plus size={12} />
                    </button>
                </div>
            )}
        </div>
    );
};