import React from 'react';
import { FlowData } from './types';

interface ViewNodePageProps {
    node: any;
    htmlOutput: string;
    flowData: FlowData;
    onNext: (flowData: FlowData) => void;
}

export const ViewNodePage: React.FC<ViewNodePageProps> = ({ node, htmlOutput, flowData, onNext }) => {
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
            <h2 style={{
                color: '#764ba2',
                fontWeight: 700,
                fontSize: '2rem',
                marginBottom: '24px',
            }}>{node.data?.label || node.nodeName}</h2>
            <div
                style={{
                    fontSize: '1.1rem',
                    color: '#333',
                    marginBottom: '32px',
                    textAlign: 'left',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '24px',
                    minHeight: '120px',
                }}
                dangerouslySetInnerHTML={{ __html: node.data?.transientData || htmlOutput || 'No content available' }}
            />
            <button
                onClick={() => onNext(flowData)}
                style={{
                    padding: '12px 32px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(118,75,162,0.08)',
                    marginTop: '16px',
                }}
            >
                Next
            </button>
        </div>
    );
};