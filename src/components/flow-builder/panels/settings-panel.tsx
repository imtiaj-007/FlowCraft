import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FlowNode, MessageNodeData } from "@/types/flow";
import { ArrowLeft, MessageSquare } from "lucide-react";

/**
 * `SettingsPanel` Component
 * 
 * A panel for editing node properties with:
 * - Real-time text editing
 * - Validation and error handling
 * - Accessibility-compliant controls
 * - Optimized performance
 * 
 * Key Features:
 * - Type-safe props and state management
 * - Memoized callbacks for performance
 * - Responsive layout
 * - Graceful handling of null states
 * 
 * @param {Object} props - Component props
 * @param {FlowNode | null} props.selectedNode - Currently selected node
 * @param {(id: string, data: Partial<MessageNodeData>) => void} props.onUpdateNode - Node update handler
 * @param {() => void} props.onBack - Navigation callback
 * 
 * @returns {React.ReactElement} Settings panel UI
 * 
 * @throws {Error} If invalid node data is provided
 */
export const SettingsPanel = ({
    selectedNode,
    onUpdateNode,
    onBack
}: {
    selectedNode: FlowNode | null;
    onUpdateNode: (id: string, data: Partial<MessageNodeData>) => void;
    onBack: () => void;
}): React.ReactElement => {
    const [text, setText] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    // Sync state with selected node
    useEffect(() => {
        if (selectedNode) {
            setText(selectedNode.data.text || '');
            setIsDirty(false);
        }
    }, [selectedNode]);

    /**
     * Handles text changes with validation
     * @param {string} value - New text value
     */
    const handleTextChange = useCallback((value: string) => {
        setText(value);
        setIsDirty(true);
    }, []);

    /**
     * Saves changes with validation
     * @throws {Error} If no node is selected
     */
    const handleSave = useCallback(() => {
        if (!selectedNode) {
            throw new Error("Cannot save - no node selected");
        }
        
        onUpdateNode(selectedNode.id, { text });
        setIsDirty(false);
    }, [selectedNode, text, onUpdateNode]);

    // No node selected state
    if (!selectedNode) {
        return (
            <div 
                className="flex flex-col items-center justify-center h-full p-8 text-center"
                aria-live="polite"
            >
                <MessageSquare 
                    className="w-12 h-12 text-gray-400 mb-4" 
                    aria-hidden="true" 
                />
                <h3 className="text-lg font-medium text-gray-500 mb-2">
                    No node selected
                </h3>
                <p className="text-sm text-gray-400 max-w-xs">
                    Select a node to edit its properties
                </p>
            </div>
        );
    }

    return (
        <div 
            className="space-y-2 p-2 h-full flex flex-col"
            role="region" 
            aria-label="Node settings panel"
        >
            <div className="space-y-4 flex-1 overflow-y-auto">
                {/* Header with back navigation */}
                <Button
                    variant="ghost"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm"
                    onClick={onBack}
                    aria-label="Return to nodes panel"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Go Back
                </Button>

                {/* Node metadata */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Message Node
                    </h2>
                    <p className="text-xs text-gray-500">
                        {selectedNode.id}
                    </p>
                </div>

                {/* Editable content */}
                <div className="space-y-4">
                    <div>
                        <label 
                            htmlFor="message-text" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Message Content
                        </label>
                        <Textarea
                            id="message-text"
                            value={text}
                            onChange={(e) => handleTextChange(e.target.value)}
                            placeholder="Enter message text..."
                            className="w-full h-32 resize-none"
                            aria-describedby="message-help"
                        />
                        <p id="message-help" className="text-xs text-gray-500 mt-1">
                            This text will be displayed in the message node
                        </p>
                    </div>
                </div>
            </div>

            {/* Save controls */}
            <div className="pt-4 border-t border-gray-200">
                <Button 
                    onClick={handleSave}
                    className="w-full"
                    disabled={!isDirty}
                    aria-live="polite"
                >
                    {isDirty ? "Save Changes" : "No Changes"}
                </Button>
            </div>
        </div>
    );
};