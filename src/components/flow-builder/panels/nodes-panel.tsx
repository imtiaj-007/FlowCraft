import { File, HelpCircle, MessageSquare } from "lucide-react";
import { createNode } from "@/lib/flow-helpers";
import { useFlowStore } from "@/store/flowStore";
import { FlowNode } from "@/types/flow";


export const NodesPanel: React.FC = () => {
    const { nodes, setNodes } = useFlowStore();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const addTextNode = (event: React.MouseEvent) => {
        event.preventDefault();

        const type = event.currentTarget.getAttribute('data-node-type') || 'messageNode';
        const newNode: FlowNode = createNode(type, { x: 0, y: 0 }, { label: 'Send Message', text: '' });
        setNodes([...nodes, newNode]);       
    };

    return (
        <div className="space-y-4 p-2">
            <div
                className="p-4 bg-teal-50 border border-teal-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-teal-100 transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, 'messageNode')}
                data-node-type="messageNode"
                onClick={addTextNode}
            >
                <div className="flex items-center gap-2 text-teal-700">
                    <MessageSquare size={16} />
                    <span className="font-medium">Message</span>
                </div>
                <p className="text-xs text-teal-600 mt-1">Send a text message</p>
            </div>

            <div
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, 'fileNode')}
                data-node-type="fileNode"
            >
                <div className="flex items-center gap-2 text-blue-700">
                    <File size={16} />
                    <span className="font-medium">File Upload</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">Allow users to upload files</p>
            </div>

            <div
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-purple-100 transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, 'questionNode')}
                data-node-type="questionNode"
            >
                <div className="flex items-center gap-2 text-purple-700">
                    <HelpCircle size={16} />
                    <span className="font-medium">Question</span>
                </div>
                <p className="text-xs text-purple-600 mt-1">Ask a question to the user</p>
            </div>
        </div>
    );
};