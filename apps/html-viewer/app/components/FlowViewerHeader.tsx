import React from 'react';

interface FlowViewerHeaderProps {
    flowName?: string;
    configId: string;
    flowId: string;
}

export const FlowViewerHeader: React.FC<FlowViewerHeaderProps> = ({ flowName, configId, flowId }) => {
    return (
        <div style={{
            textAlign: 'center',
            marginBottom: '40px',
        }}>
            <h1 style={{
                color: '#333',
                fontSize: '36px',
                fontWeight: '700',
                margin: '0 0 10px 0',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
            }}>
                🌊 Flow Viewer
            </h1>
            <p style={{
                color: '#666',
                fontSize: '18px',
                margin: '0 0 10px 0',
                fontWeight: '400',
            }}>
                {flowName || 'Loading flow configuration...'}
            </p>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                fontSize: '14px',
                color: '#888',
            }}>
                <span>📋 Config: {configId}</span>
                <span>🔄 Flow: {flowId}</span>
            </div>
        </div>
    );
};