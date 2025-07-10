import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlowNode, MessageNodeData } from "@/types/flow";
import { ArrowLeft, MessageSquare } from "lucide-react";


export const SettingsPanel = (
    { selectedNode, onUpdateNode, onBack }: {
        selectedNode: FlowNode | null;
        onUpdateNode: (id: string, data: Partial<MessageNodeData>) => void;
        onBack: () => void;
    }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (selectedNode) {
            setText(selectedNode.data.text || '');
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (selectedNode) {
            onUpdateNode(selectedNode.id, { text });
        }
    };

    if (!selectedNode) return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No node selected</h3>
            <p className="text-sm text-gray-400 max-w-xs">
                Select a node from the canvas to view and edit its settings
            </p>
        </div>
    );

    return (
        <div className="space-y-2 p-2">
            <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                onClick={onBack}
            >
                <ArrowLeft size={16} />
                Go Back
            </Button>
            <h2 className="text-lg font-semibold text-gray-900">Message</h2>
            <p className="text-sm text-gray-500">Edit message content</p>

            <div className="flex-1 p-2">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Text
                        </label>
                        <Textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter message text..."
                            className="w-full h-32 resize-none"
                        />
                    </div>

                    <Button onClick={handleSave} className="w-full">
                        Apply Text
                    </Button>
                </div>
            </div>
        </div>
    );
};