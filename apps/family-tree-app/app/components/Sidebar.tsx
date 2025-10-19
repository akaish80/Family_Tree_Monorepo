"use client";
import React, { useEffect, useState } from 'react';

interface Canvas {
    id: string;
    configId: string;
    flowId: string;
    canvasName: string;
    canvasDescription: string;
    createdAt: string;
    updatedAt: string;
}

interface SidebarProps {
    configId?: string;
    flowId?: string;
}

// Sidebar panel for draggable nodes (always visible)
const Sidebar: React.FC<SidebarProps> = ({ configId, flowId }) => {
    const [canvases, setCanvases] = useState<Canvas[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch canvases when configId changes
    useEffect(() => {
        const fetchCanvases = async () => {
            if (!configId) return;

            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch(`/api/family-tree/canvas?configId=${configId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCanvases(data.canvas || []);
                } else {
                    console.warn('Failed to fetch canvases');
                    setCanvases([]);
                }
            } catch (err) {
                console.error('Error fetching canvases:', err);
                setError('Failed to load canvases');
                setCanvases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCanvases();
    }, [configId]);

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                width: 180,
                background: 'rgba(255,255,255,0.97)',
                borderRight: '1px solid #e0e0e0',
                boxShadow: '2px 0 8px rgba(0,0,0,0.07)',
                zIndex: 10,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            {/* Flow Node Types Section */}
            <div style={{ fontWeight: 'bold', margin: '10px 0 10px 16px', color: '#764ba2', fontSize: 15 }}>
                Flow Nodes
            </div>
            <div
                draggable
                onDragStart={e => {
                    e.dataTransfer.setData('application/reactflow', 'VIEW');
                    e.dataTransfer.effectAllowed = 'move';
                }}
                style={{
                    margin: '0 0 0 16px',
                    padding: '10px 18px',
                    background: '#e3f2fd',
                    border: '2px solid #1976d2',
                    borderRadius: 8,
                    cursor: 'grab',
                    fontWeight: 500,
                    color: '#1565c0',
                    marginBottom: 12,
                    userSelect: 'none',
                    width: 'calc(100% - 32px)',
                    boxSizing: 'border-box',
                    fontSize: '12px',
                }}
            >
                👁️ View
            </div>
            <div
                draggable
                onDragStart={e => {
                    e.dataTransfer.setData('application/reactflow', 'DECISION');
                    e.dataTransfer.effectAllowed = 'move';
                }}
                style={{
                    margin: '0 0 0 16px',
                    padding: '10px 18px',
                    background: '#fff3e0',
                    border: '2px solid #ff9800',
                    borderRadius: 8,
                    cursor: 'grab',
                    fontWeight: 500,
                    color: '#ef6c00',
                    marginBottom: 12,
                    userSelect: 'none',
                    width: 'calc(100% - 32px)',
                    boxSizing: 'border-box',
                    fontSize: '12px',
                }}
            >
                🔀 Decision
            </div>

            {/* Canvas Section */}
            <div style={{ fontWeight: 'bold', margin: '20px 0 10px 16px', color: '#764ba2', fontSize: 15 }}>
                Canvas Pages
            </div>
            
            {loading && (
                <div style={{ margin: '0 16px', color: '#666', fontSize: '12px' }}>
                    Loading canvases...
                </div>
            )}
            
            {error && (
                <div style={{ margin: '0 16px', color: '#d32f2f', fontSize: '12px' }}>
                    {error}
                </div>
            )}
            
            {!loading && !error && canvases.length === 0 && (
                <div style={{ margin: '0 16px', color: '#666', fontSize: '12px', fontStyle: 'italic' }}>
                    No canvases found
                </div>
            )}
            
            {canvases.map((canvas) => (
                <div
                    key={canvas.id}
                    draggable
                    onDragStart={e => {
                        e.dataTransfer.setData('application/reactflow', 'CANVAS');
                        e.dataTransfer.setData('canvas-id', canvas.id);
                        e.dataTransfer.setData('canvas-name', canvas.canvasName);
                        e.dataTransfer.setData('canvas-config-id', canvas.configId);
                        e.dataTransfer.setData('canvas-flow-id', canvas.flowId);
                        e.dataTransfer.effectAllowed = 'move';
                    }}
                    style={{
                        margin: '0 0 0 16px',
                        padding: '8px 12px',
                        background: '#f3e5f5',
                        border: '2px solid #9c27b0',
                        borderRadius: 8,
                        cursor: 'grab',
                        fontWeight: 500,
                        color: '#7b1fa2',
                        marginBottom: 8,
                        userSelect: 'none',
                        width: 'calc(100% - 32px)',
                        boxSizing: 'border-box',
                        fontSize: '11px',
                        lineHeight: '1.2',
                        maxHeight: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                    title={`Canvas: ${canvas.canvasName}\nDescription: ${canvas.canvasDescription || 'No description'}`}
                >
                    🎨 {canvas.canvasName}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;