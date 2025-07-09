'use client'
import { ReactElement } from "react";
import { ReactFlowProvider } from "reactflow";
import { FlowBuilderCanvas } from "./flow-canvas";


const FlowBuilder: React.FC = (): ReactElement => {
    return (
        <ReactFlowProvider>
            <FlowBuilderCanvas />
        </ReactFlowProvider>
    );
};

export default FlowBuilder;