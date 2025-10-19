import React from 'react';

export const NoContentMessage: React.FC = () => {
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
            <div style={{
                fontSize: '48px',
                marginBottom: '20px',
            }}>📄</div>
            <h2 style={{
                color: '#666',
                fontWeight: 600,
                fontSize: '1.5rem',
                marginBottom: '16px',
            }}>No Content to Render</h2>
            <p style={{
                color: '#999',
                fontSize: '1rem',
                lineHeight: '1.6',
            }}>
                The flow configuration exists but doesn't contain any renderable content. 
                Please check your flow setup in the editor.
            </p>
        </div>
    );
};