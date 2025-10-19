import React, { useState, useEffect } from 'react';
import { FlowData } from './types';
import { CanvasDataService } from './CanvasDataService';
import { CanvasRenderer } from './CanvasRenderer';

interface CanvasNodePageProps {
    node: any;
    htmlOutput: string;
    flowData: FlowData;
    configId: string;
    flowId: string;
    onNext: (flowData: FlowData) => void;
}

export const CanvasNodePage: React.FC<CanvasNodePageProps> = ({ 
    node, 
    htmlOutput, 
    flowData, 
    configId, 
    flowId, 
    onNext 
}) => {
    const [canvasData, setCanvasData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCanvasData = async () => {
            if (htmlOutput === 'canvas-data-loaded') {
                setLoading(true);
                setError(null);
                
                try {
                    const canvasConfigId = node.data?.configId || configId;
                    const canvasFlowId = node.data?.flowId || flowId;
                    
                    const data = await CanvasDataService.fetchCanvasData(canvasConfigId, canvasFlowId);
                    setCanvasData(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadCanvasData();
    }, [htmlOutput, node.data, configId, flowId]);

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ 
                    color: '#667eea', 
                    textAlign: 'center',
                    padding: '40px'
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: '32px',
                        height: '32px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #667eea',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '15px',
                    }}></div>
                    <br />
                    Loading canvas content...
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ 
                    background: '#f8d7da', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    color: '#721c24'
                }}>
                    ⚠️ Canvas Error: {error}
                </div>
            );
        }

        if (htmlOutput === 'canvas-data-loaded' && canvasData) {
            return <CanvasRenderer 
                canvasData={canvasData} 
                canvasName={node.data?.canvasName || 'Canvas'} 
                onNext={() => onNext(flowData)}
            />;
        }

        // This fallback should rarely be used since Canvas nodes clear htmlOutput
        if (htmlOutput && htmlOutput !== 'canvas-data-loaded') {
            return (
                <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
            );
        }

        // Default loading state for Canvas nodes
        return (
            <div style={{ 
                color: '#666', 
                textAlign: 'center',
                fontStyle: 'italic',
                padding: '40px'
            }}>
                Preparing canvas...
            </div>
        );
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            maxWidth: '900px',
            margin: '40px auto',
            textAlign: 'left',
        }}>
            <div style={{
                fontSize: '1rem',
                color: '#333',
                marginBottom: '32px',
            }}>
                {renderContent()}
            </div>
            {/* Canvas nodes handle their own navigation through interactive elements */}
            {/* No Next button is displayed for Canvas type nodes */}
            
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};