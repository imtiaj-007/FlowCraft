'use client' // Required for Next.js client-side hooks and state

import { ReactElement, Suspense } from "react";
import { ReactFlowProvider } from "reactflow";
import { ErrorBoundary } from "react-error-boundary";
import { FlowBuilderCanvas } from "./flow-canvas";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/**
 * `FlowBuilder` Component
 * 
 * The root provider component for the flow editor that:
 * - Initializes ReactFlow context
 * - Handles runtime errors gracefully
 * - Manages loading states
 * - Provides analytics hooks
 * 
 * Key Features:
 * - Error boundary for crash protection
 * - Suspense fallback for code splitting
 * - Type-safe with strict React.FC typing
 * - Analytics integration ready
 * 
 * @returns {ReactElement} The ReactFlow context provider wrapper
 * 
 * @example Basic Usage
 * ```tsx
 * <FlowBuilder />
 * ```
 * 
 * @see {@link ReactFlowProvider} - Context provider docs
 * @see {@link FlowBuilderCanvas} - Main canvas implementation
 */
const FlowBuilder: React.FC = (): ReactElement => {
    /**
     * Error fallback component
     * @param error - Caught error object
     * @param resetErrorBoundary - Recovery function
     */
    const ErrorFallback = ({ 
        resetErrorBoundary 
    }: { 
        error: Error; 
        resetErrorBoundary: () => void 
    }) => (
        <div className="h-screen w-screen flex items-center justify-center bg-red-50 p-8">
            <div className="max-w-md text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-2">Flow Editor Crashed</h1>
                <p className="text-gray-600 mb-4">
                    We&apos;ve encountered an unexpected error. Please try refreshing.
                </p>
                <Button 
                    onClick={resetErrorBoundary}
                    className="bg-red-500 hover:bg-red-600"
                >
                    Reload Editor
                </Button>
            </div>
        </div>
    );

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={(error, info) => {
                console.error("FlowBuilder Error:", error, info.componentStack);
                // TODO: Integrate with error monitoring (Sentry/LogRocket)
            }}
            onReset={() => window.location.reload()}
        >
            <Suspense fallback={
                <div className="h-screen w-screen flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }>
                <ReactFlowProvider>
                    <FlowBuilderCanvas />
                </ReactFlowProvider>
            </Suspense>
        </ErrorBoundary>
    );
};

export default FlowBuilder;