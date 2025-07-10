import FlowBuilder from "@/components/flow-builder/flow-builder";
import { ErrorBoundary } from "react-error-boundary";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Error Fallback Component
 * 
 * Displays a user-friendly error screen when the FlowBuilder crashes.
 * 
 * Key Features:
 * - Clear error message with technical details (for debugging).
 * - Recovery option via `resetErrorBoundary`.
 * - Responsive design with accessible color contrast.
 * 
 * @param {Object} props - Error boundary props
 * @param {Error} props.error - The caught error object
 * @param {Function} props.resetErrorBoundary - Resets the error state
 * @returns {React.ReactElement} - Error UI with recovery option
 * 
 * @see [React Error Boundary Docs](https://github.com/bvaughn/react-error-boundary)
 */
const ErrorFallback = ({ 
    error, 
    resetErrorBoundary 
}: { 
    error: Error; 
    resetErrorBoundary: () => void 
}): React.ReactElement => (
    <div 
        role="alert" 
        className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 p-8"
        aria-live="assertive"
    >
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Error</h1>
            <p className="text-gray-600 mb-6">
                The flow builder encountered an unexpected error. Please try again.
            </p>
            <pre className="text-xs text-red-500 bg-red-100 p-2 rounded mb-6 overflow-auto">
                Error: {error.message}
            </pre>
            <Button
                onClick={resetErrorBoundary}
                className="bg-red-500 hover:bg-red-600 text-white"
                aria-label="Retry loading the flow builder"
            >
                Try Again
            </Button>
        </div>
    </div>
);

/**
 * Home Page (Root Page)
 * 
 * The application's entry point with critical safeguards:
 * 
 * 1. **Error Boundary**: Prevents UI crashes by catching render errors.
 * 2. **Full-Screen Layout**: Optimized for flow builder workspace.
 * 3. **Error Recovery**: Auto-reloads on reset to ensure clean state.
 * 
 * Security Note:
 * - Errors are logged to console but not transmitted externally.
 * 
 * @returns {React.ReactElement} - Root layout with protected FlowBuilder
 * 
 * @example
 * // Minimal implementation:
 * <Home /> // Renders FlowBuilder with error protection
 */
export default function Home(): React.ReactElement {
    return (
        <main 
            className="h-screen w-screen overflow-hidden"
            data-testid="home-page-container"
        >
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={(error, info) => {
                    console.error("FlowBuilder Crash:", error, info.componentStack);
                    // TODO: Integrate with error monitoring (e.g., Sentry)
                }}
                onReset={() => {
                    window.location.reload(); // Full state reset
                }}
            >
                <FlowBuilder />
            </ErrorBoundary>
        </main>
    );
}