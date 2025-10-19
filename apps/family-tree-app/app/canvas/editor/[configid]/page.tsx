"use client"
import { Editor, Frame, Element, useEditor } from "@craftjs/core"
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Toolbox from "./components/Toolbox";
import PropertyPanel from "./components/PropertyPanel";
import FooterBar from "./components/FooterBar";
import FlowSelector from "./components/FlowSelector";
import { Button, TextComponent, InputField, Container, InnerContainer } from "./components/EditorComponents";

// Canvas component to handle loading canvas data
function CanvasContent({ configId, currentFlow }: { configId: string, currentFlow: string }) {
    const { actions, query } = useEditor();

    useEffect(() => {
        const loadCanvasData = async () => {
            if (!currentFlow) return;

            try {
                const response = await fetch(`/api/family-tree/canvas/${configId}/${currentFlow}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.canvasData) {
                        // Deserialize and load the canvas data
                        actions.deserialize(data.canvasData);
                    } else {
                        // Clear canvas if no data exists
                        actions.clearEvents();
                    }
                }
            } catch (error) {
                console.error('Error loading canvas data:', error);
            }
        };

        loadCanvasData();
    }, [currentFlow, configId, actions]);

    return (
        <Frame>
            <Element canvas is={Container}>
                {/* Drop components here */}
            </Element>
        </Frame>
    );
}

export default function canvasEditor() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const configId = params.configid as string;
    const currentFlowId = searchParams.get('flowId');
    const [flows, setFlows] = useState<string[]>(['default']);
    const [currentFlow, setCurrentFlow] = useState<string>(currentFlowId || 'default');

    useEffect(() => {
        // Fetch available flows for this configuration
        const fetchFlows = async () => {
            try {
                const response = await fetch(`/api/family-tree/flows/${configId}`);
                if (response.ok) {
                    const data = await response.json();
                    setFlows(data.flows || ['default']);
                    
                    // If no flowId in URL and flows exist, set first flow as default
                    if (!currentFlowId && data.flows.length > 0) {
                        setCurrentFlow(data.flows[0]);
                        router.push(`/canvas/editor/${configId}?flowId=${data.flows[0]}`);
                    } else if (!currentFlowId) {
                        // No flows exist, use default
                        setCurrentFlow('default');
                        router.push(`/canvas/editor/${configId}?flowId=default`);
                    }
                }
            } catch (error) {
                console.error('Error fetching flows:', error);
            }
        };
        fetchFlows();
    }, [configId, currentFlowId, router]);

    // Update current flow when URL changes
    useEffect(() => {
        if (currentFlowId) {
            setCurrentFlow(currentFlowId);
        }
    }, [currentFlowId]);

    const handleFlowChange = (newFlow: string) => {
        setCurrentFlow(newFlow);
        router.push(`/canvas/editor/${configId}?flowId=${newFlow}`);
    };

    const handleFlowCreate = (newFlow: string) => {
        setFlows([...flows, newFlow]);
        setCurrentFlow(newFlow);
        router.push(`/canvas/editor/${configId}?flowId=${newFlow}`);
    };

    return (
        <div style={{ display: "flex", height: "100vh", paddingBottom: "60px" }}>
            <Editor resolver={{ Button, TextComponent, InputField, Container, InnerContainer, button: Button, div: TextComponent, input: InputField }}>
                <Toolbox />
                <div style={{ flex: 1, padding: "20px" }}>
                    <FlowSelector 
                        configId={configId}
                        flows={flows}
                        currentFlow={currentFlow}
                        onFlowChange={handleFlowChange}
                        onFlowCreate={handleFlowCreate}
                    />
                    <CanvasContent configId={configId} currentFlow={currentFlow} />
                </div>
                <PropertyPanel />
                <FooterBar configId={configId} flowId={currentFlow} />
            </Editor>
        </div>
    )
}