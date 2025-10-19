import React from 'react';

interface LoadingSpinnerProps {
    message: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
    return (
        <div style={{
            textAlign: 'center',
            fontSize: '20px',
            color: '#667eea',
            padding: '40px',
        }}>
            <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #667eea',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '15px',
            }}></div>
            <br />
            {message}
        </div>
    );
};