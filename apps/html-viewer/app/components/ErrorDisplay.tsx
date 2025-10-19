import React from 'react';

interface ErrorDisplayProps {
    error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    return (
        <div style={{
            color: '#dc3545',
            textAlign: 'center',
            fontSize: '16px',
            backgroundColor: '#f8d7da',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #f5c6cb',
        }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>⚠️</div>
            {error}
        </div>
    );
};