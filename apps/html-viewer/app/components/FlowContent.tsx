import React, { useState, useEffect } from 'react';
import { FlowData } from './types';
import { useDecisionMaker } from './useDecisionMaker';
import { ViewNodePage } from './ViewNodePage';
import { CanvasNodePage } from './CanvasNodePage';
import { NoContentMessage } from './NoContentMessage';

interface FlowContentProps {
    flowData: FlowData;
    configId: string;
    flowId: string;
}

export const FlowContent: React.FC<FlowContentProps> = ({ flowData, configId, flowId }) => {
    const [currentViewNode, setCurrentViewNode] = useState<any>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const [htmlOutput, setHtmlOutput] = useState('');
    const [loadingCanvas, setLoadingCanvas] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { decisionMaker } = useDecisionMaker({
        configId,
        flowId,
        setCurrentNodeId,
        setCurrentViewNode,
        setHtmlOutput,
        setLoadingCanvas,
        setError,
    });

    const parseFamilyTreeData = (data: FlowData) => {
        console.log('parseFamilyTreeData called with data:', data);
        
        if (!data.updatedNode || data.updatedNode.length === 0) {
            setError('No flow nodes found to render');
            return;
        }

        const responseNode = data.updatedNode;
        console.log('responseNode array:', responseNode);
        console.log('Looking for startNode with id:', data.startNode);
        
        const startNodeConfig = responseNode.find((node: any) => node.id === data.startNode);
        
        if (!startNodeConfig) {
            console.error('Start node not found. Available nodes:', responseNode.map((n: any) => ({ id: n.id, type: n.type })));
            setError('Start node not found in flow configuration');
            return;
        }

        console.log('Starting flow with node:', startNodeConfig);
        console.log('startNodeConfig type:', typeof startNodeConfig);
        console.log('startNodeConfig properties:', Object.keys(startNodeConfig));
        
        let nextNode: string | null = startNodeConfig.nextNode;
        decisionMaker({inputdata: startNodeConfig, nextNode, nodes: responseNode, edges: data.edges || []});
    };

    const goToNextNode = (_flowData: FlowData) => {
        if (!_flowData || !currentViewNode) return;

        const edge = _flowData.edges?.find(e => e.source === currentViewNode.id);
        const nodes = _flowData.updatedNode || _flowData.nodes;

        if (edge) {
            const nextNode = nodes?.find(n => n.id === edge.target);
            if (nextNode) {
                decisionMaker({inputdata: nextNode, nextNode: null, nodes, edges: _flowData.edges || []});
                setCurrentNodeId(edge.target);
            }
        }
    };

    useEffect(() => {
        if (flowData) {
            console.log('About to call parseFamilyTreeData with:', flowData);
            parseFamilyTreeData(flowData);
        }
    }, [flowData]);

    if (currentViewNode) {
        if (currentViewNode.type === 'CANVAS') {
            return (
                <CanvasNodePage
                    node={currentViewNode}
                    htmlOutput={htmlOutput}
                    flowData={flowData}
                    configId={configId}
                    flowId={flowId}
                    onNext={goToNextNode}
                />
            );
        } else {
            return (
                <ViewNodePage
                    node={currentViewNode}
                    htmlOutput={htmlOutput}
                    flowData={flowData}
                    onNext={goToNextNode}
                />
            );
        }
    }

    if (htmlOutput) {
        return (
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '40px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                maxWidth: '700px',
                margin: '40px auto',
                textAlign: 'center',
            }}>
                <div
                    style={{
                        fontSize: '1.1rem',
                        color: '#333',
                        textAlign: 'left',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        padding: '24px',
                        minHeight: '120px',
                    }}
                    dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
            </div>
        );
    }

    return <NoContentMessage />;
};