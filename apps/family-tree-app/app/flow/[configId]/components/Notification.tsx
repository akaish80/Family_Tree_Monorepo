import React from 'react';

interface NotificationProps {
    message: string | null;
    onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 20,
            right: 60,
            zIndex: 5,
            background: 'rgba(76, 175, 80, 0.95)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontWeight: '600',
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {message}
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    aria-label="Close notification"
                >
                    ×
                </button>
            )}
        </div>
    );
};