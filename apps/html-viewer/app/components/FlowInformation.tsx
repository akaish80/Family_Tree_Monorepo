import React from 'react';
import { FlowData } from './types';

interface FlowInformationProps {
    flowData: FlowData;
}

export const FlowInformation: React.FC<FlowInformationProps> = ({ flowData }) => {
    return (
        <div style={{ marginTop: '40px' }}>
            <details style={{
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: '12px',
                overflow: 'hidden',
            }}>
                <summary style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#495057',
                    borderBottom: '1px solid #dee2e6',
                }}>
                    🔍 View Flow Configuration
                </summary>
                <div style={{ padding: '20px' }}>
                    <h4>Flow Details:</h4>
                    <ul style={{ textAlign: 'left', color: '#666' }}>
                        <li><strong>Flow Name:</strong> {flowData.flowName}</li>
                        <li><strong>Description:</strong> {flowData.description || 'No description'}</li>
                        <li><strong>Nodes:</strong> {flowData.nodes?.length || 0}</li>
                        <li><strong>Edges:</strong> {flowData.edges?.length || 0}</li>
                        <li><strong>Start Node:</strong> {flowData.startNode}</li>
                        <li><strong>Created:</strong> {new Date(flowData.createdAt).toLocaleString()}</li>
                        <li><strong>Updated:</strong> {new Date(flowData.updatedAt).toLocaleString()}</li>
                    </ul>
                    <details style={{ marginTop: '20px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: '600' }}>Raw JSON Data</summary>
                        <pre style={{
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            marginTop: '10px',
                            overflow: 'auto',
                            fontSize: '12px',
                            lineHeight: '1.4',
                            color: '#495057',
                            borderRadius: '8px',
                        }}>
                            {JSON.stringify(flowData, null, 2)}
                        </pre>
                    </details>
                </div>
            </details>
        </div>
    );
};