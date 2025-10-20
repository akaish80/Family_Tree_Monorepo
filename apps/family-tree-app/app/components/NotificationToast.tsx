"use client";

import React from 'react';

interface NotificationToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ 
    message, 
    type = 'success', 
    onClose 
}) => {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'rgba(76, 175, 80, 0.95)';
            case 'error':
                return 'rgba(244, 67, 54, 0.95)';
            case 'warning':
                return 'rgba(255, 152, 0, 0.95)';
            case 'info':
                return 'rgba(33, 150, 243, 0.95)';
            default:
                return 'rgba(76, 175, 80, 0.95)';
        }
    };

    return (
        <div 
            style={{
                position: 'absolute',
                top: 20,
                right: 60,
                zIndex: 5,
                background: getBackgroundColor(),
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                backdropFilter: 'blur(10px)',
                fontSize: '14px',
                fontWeight: '600',
                animation: 'slideIn 0.3s ease-out',
                cursor: onClose ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}
            onClick={onClose}
        >
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '16px',
                        cursor: 'pointer',
                        padding: '0',
                        lineHeight: '1',
                    }}
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default NotificationToast;