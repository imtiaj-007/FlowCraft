import React, { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { Handle, Position, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { MessageSquare, Plus, Grip, AlertCircle } from 'lucide-react';
import { FlowNode, MessageNodeData } from '@/types/flow';


// Custom Message Node Component
export const MessageNode = (
    { data, selected, id }: { data: MessageNodeData; selected: boolean; id: string }
) => {
    const [isHovered, setIsHovered] = useState(false);
    const { setNodes, setEdges, getNodes } = useReactFlow();

    const handleAddNode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const newNodeId = `node-${uuid()}`; // Generate a unique ID for the new node
        const currentNodes = getNodes();
        const currentNode = currentNodes.find(n => n.id === id);

        if (currentNode) {
            const newNode: FlowNode = {
                id: newNodeId,
                type: 'messageNode',
                position: {
                    x: currentNode.position.x + 300,
                    y: currentNode.position.y
                },
                data: { label: 'Send Message', text: '' }
            };

            setNodes(nodes => [...nodes, newNode]);
            setEdges(edges => [...edges, {
                id: `edge-${id}-${newNodeId}`,
                source: id,
                target: newNodeId,
                type: 'smoothstep',
                animated: true
            }]);
        }
    }, [id, setNodes, setEdges, getNodes]);

    const isEmpty = !data.text.trim();

    return (
        <div
            className={`relative bg-white rounded-lg border-2 transition-all duration-200 ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                } ${isEmpty ? 'border-red-200 bg-red-50' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Target Handle */}
            <Handle
                type="target"
                position={Position.Top}
                className="w-4 h-4 !bg-blue-500 !border-2 !border-white shadow-md"
            />

            {/* Node Header */}
            <div className="flex items-center gap-2 p-3 bg-teal-500 text-white rounded-t-lg">
                <MessageSquare size={16} />
                <span className="font-medium text-sm">Send Message</span>
                <Grip size={12} className="ml-auto opacity-70" />
            </div>

            {/* Node Content */}
            <div className="p-4 min-w-[200px]">
                <div className="text-sm text-gray-600 break-words">
                    {data.text || (
                        <span className="text-red-400 italic">Enter message text</span>
                    )}
                </div>
            </div>

            {/* Source Handle */}
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-4 h-4 !bg-blue-500 !border-2 !border-white shadow-md"
            />

            {/* Add Node Button Container */}
            <div
                className={`absolute -right-12 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <button
                    onClick={handleAddNode}
                    className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl"
                >
                    <Plus size={14} />
                </button>
            </div>

            {/* Empty State Indicator */}
            {isEmpty && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle size={10} className="text-white" />
                </div>
            )}
        </div>
    );
};