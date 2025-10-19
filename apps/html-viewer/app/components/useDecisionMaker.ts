import { useCallback } from 'react';
import { DecisionMakerParams } from './types';
import { CanvasDataService } from './CanvasDataService';

interface UseDecisionMakerProps {
    configId: string;
    flowId: string;
    setCurrentNodeId: (id: string) => void;
    setCurrentViewNode: (node: any) => void;
    setHtmlOutput: (html: string) => void;
    setLoadingCanvas: (loading: boolean) => void;
    setError: (error: string) => void;
}

export const useDecisionMaker = ({
    configId,
    flowId,
    setCurrentNodeId,
    setCurrentViewNode,
    setHtmlOutput,
    setLoadingCanvas,
    setError,
}: UseDecisionMakerProps) => {
    
    // Decision handling logic
    const handleDecisionNode = (nodeConfig: any) => {
        if (!nodeConfig.data?.choices || nodeConfig.data.choices.length === 0) {
            return null;
        }

        // For demo purposes, we'll just take the first choice
        // In a real application, you'd implement logic to evaluate expressions
        const firstChoice = nodeConfig.data.choices[0];
        return firstChoice.nextNodeLabel || null;
    };

    const decisionMaker = useCallback(({inputdata, nextNode, nodes, edges}: DecisionMakerParams): string | null => {
        console.log('decisionMaker called with:');
        console.log('- inputdata:', inputdata);
        console.log('- inputdata type:', typeof inputdata);
        console.log('- nextNode:', nextNode);
        console.log('- nodes length:', nodes?.length);
        
        // Add null check for inputdata
        if (!inputdata) {
            console.error('decisionMaker called with undefined inputdata');
            return null;
        }

        console.log('- inputdata.type:', inputdata.type);
        console.log('- inputdata.id:', inputdata.id);

        let newNode: string | null = nextNode;
        
        switch (inputdata?.type) {
            case 'DECISION':
                setCurrentViewNode(null);
                const choiceResult = handleDecisionNode(inputdata);
                if (choiceResult === null) {
                    return choiceResult;
                }
                newNode = choiceResult;
                break;
            case 'VIEW':
                setCurrentNodeId(inputdata.id);
                setCurrentViewNode(inputdata);
                setHtmlOutput(inputdata.data?.transientData || '');
                newNode = null;
                break;
            case 'CANVAS':
                setCurrentNodeId(inputdata.id);
                setCurrentViewNode(inputdata);
                // Clear any previous HTML output from VIEW nodes
                setHtmlOutput('');
                // Fetch canvas data and render it
                const canvasConfigId = inputdata.data?.configId || configId;
                const canvasFlowId = inputdata.data?.flowId || flowId;
                
                console.log('Processing CANVAS node:', {
                    canvasConfigId,
                    canvasFlowId,
                    nodeData: inputdata.data
                });
                
                setLoadingCanvas(true);
                
                // Fetch canvas data asynchronously
                CanvasDataService.fetchCanvasData(canvasConfigId, canvasFlowId)
                    .then((fetchedCanvasData) => {
                        if (fetchedCanvasData) {
                            // Canvas data will be handled by CanvasRenderer component
                            // Just set a placeholder for now
                            setHtmlOutput('canvas-data-loaded');
                        } else {
                            // No canvas data found
                            const fallbackHtml = `
                                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                                    <h2 style="color: #764ba2; margin-bottom: 20px;">🎨 ${inputdata.data?.canvasName || 'Canvas'}</h2>
                                    <p style="color: #666; font-style: italic;">This canvas hasn't been designed yet.</p>
                                    <p style="color: #999; font-size: 14px;">Canvas ID: ${inputdata.data?.canvasId || 'N/A'}</p>
                                </div>
                            `;
                            setHtmlOutput(fallbackHtml);
                        }
                    })
                    .catch((error) => {
                        console.error('Error processing canvas:', error);
                        const errorHtml = `
                            <div style="background: #f8d7da; padding: 20px; border-radius: 8px; text-align: center;">
                                <h2 style="color: #721c24; margin-bottom: 20px;">⚠️ Canvas Error</h2>
                                <p style="color: #721c24;">Failed to load canvas data.</p>
                            </div>
                        `;
                        setHtmlOutput(errorHtml);
                        setError('Failed to load canvas data');
                    })
                    .finally(() => {
                        setLoadingCanvas(false);
                    });
                
                newNode = null;
                break;
            case 'END':
                setCurrentViewNode(null);
                setHtmlOutput('Flow completed successfully!');
                newNode = null;
                break;
            case 'START':
                // Find the next node connected to START
                const edge = edges?.find(e => e.source === inputdata.id);
                if (edge) {
                    const nextNodeInFlow = nodes.find(n => n.id === edge.target);
                    if (nextNodeInFlow) {
                        decisionMaker({inputdata: nextNodeInFlow, nextNode: null, nodes, edges});
                    }
                }
                return null;
        }

        if (newNode !== null) {
            const node = nodes.find(e => e.id === newNode);
            if (node) {
                decisionMaker({inputdata: node, nextNode: node?.nextNode || null, nodes, edges});
            } else {
                console.error(`Node with id '${newNode}' not found in nodes array`);
            }
        }

        return newNode;
    }, [configId, flowId, setCurrentNodeId, setCurrentViewNode, setHtmlOutput, setLoadingCanvas, setError]);

    return { decisionMaker };
};