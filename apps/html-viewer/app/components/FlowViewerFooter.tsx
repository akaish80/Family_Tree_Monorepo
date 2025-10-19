import React from 'react';

export const FlowViewerFooter: React.FC = () => {
    return (
        <div style={{
            marginTop: '30px',
            textAlign: 'center',
            color: '#6c757d',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
        }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                🔗 This viewer renders flow configurations from MongoDB via the family-tree-app API.
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                URL Pattern: <code style={{
                    backgroundColor: '#f1f3f4',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontFamily: 'Monaco, monospace',
                    fontSize: '13px',
                }}>/html-viewer/[configId]/[flowId]</code>
            </p>
            <p style={{ margin: '0', fontSize: '12px', color: '#8e8e8e' }}>
                Configure your flows in the editor, then view them here with the generated URL.
            </p>
        </div>
    );
};