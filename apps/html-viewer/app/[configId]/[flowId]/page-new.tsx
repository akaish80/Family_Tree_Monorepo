"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useFlowData } from '../../components/useFlowData';
import { FlowViewerHeader } from '../../components/FlowViewerHeader';
import { FlowViewerFooter } from '../../components/FlowViewerFooter';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { FlowContent } from '../../components/FlowContent';
import { FlowInformation } from '../../components/FlowInformation';

export default function FlowViewer() {
    const params = useParams();
    const configId = params?.configId as string;
    const flowId = params?.flowId as string;

    const { flowData, loading, error } = useFlowData(configId, flowId);

    return (
        <div style={{
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <FlowViewerHeader 
                    flowName={flowData?.flowName}
                    configId={configId}
                    flowId={flowId}
                />

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '30px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                }}>
                    {loading && (
                        <LoadingSpinner message="Loading flow configuration..." />
                    )}

                    {error && (
                        <ErrorDisplay error={error} />
                    )}

                    {flowData && !loading && !error && (
                        <div>
                            <FlowContent 
                                flowData={flowData}
                                configId={configId}
                                flowId={flowId}
                            />

                            <FlowInformation flowData={flowData} />
                        </div>
                    )}
                </div>

                <FlowViewerFooter />
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}