import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlowNode, MessageNodeData } from "@/types/flow";
import { ArrowLeft } from "lucide-react";


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

    if (!selectedNode) return null;

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
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};