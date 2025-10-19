"use client";

import React from 'react';
import Link from 'next/link';

export default function FlowViewerIndex() {
    const exampleRoutes = [
        {
            route: '/config-123/flow-456',
            description: 'Example flow viewer with specific config and flow IDs'
        },
        {
            route: '/my-family-config/main-flow',
            description: 'Custom named configuration and flow'
        }
    ];

    return (
        <div style={{
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '40px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px',
                }}>
                    <h1 style={{
                        color: '#333',
                        fontSize: '48px',
                        fontWeight: '700',
                        margin: '0 0 15px 0',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        🌊 Flow Viewer
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '20px',
                        margin: '0 0 30px 0',
                        fontWeight: '400',
                        lineHeight: '1.6',
                    }}>
                        Route-based viewer for your family tree flow configurations
                    </p>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '30px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    marginBottom: '30px',
                }}>
                    <h2 style={{
                        color: '#495057',
                        fontSize: '24px',
                        fontWeight: '600',
                        margin: '0 0 20px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        📋 How to Use
                    </h2>
                    
                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #dee2e6',
                        marginBottom: '20px',
                    }}>
                        <h3 style={{
                            color: '#343a40',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 0 15px 0',
                        }}>
                            URL Pattern:
                        </h3>
                        <code style={{
                            backgroundColor: '#f1f3f4',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            fontFamily: 'Monaco, Consolas, monospace',
                            fontSize: '16px',
                            color: '#d73a49',
                            display: 'block',
                            border: '1px solid #e1e4e8',
                        }}>
                            /html-viewer/[configId]/[flowId]
                        </code>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '12px',
                        border: '1px solid #dee2e6',
                    }}>
                        <h3 style={{
                            color: '#343a40',
                            fontSize: '18px',
                            fontWeight: '600',
                            margin: '0 0 15px 0',
                        }}>
                            Parameters:
                        </h3>
                        <ul style={{
                            color: '#666',
                            lineHeight: '1.8',
                            paddingLeft: '20px',
                        }}>
                            <li><strong>configId:</strong> The configuration ID from your family tree setup</li>
                            <li><strong>flowId:</strong> The specific flow ID you want to render</li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#e8f5e8',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid #4caf50',
                    marginBottom: '30px',
                }}>
                    <h2 style={{
                        color: '#2e7d32',
                        fontSize: '20px',
                        fontWeight: '600',
                        margin: '0 0 15px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        ✨ Example Routes
                    </h2>
                    
                    {exampleRoutes.map((example, index) => (
                        <div key={index} style={{
                            background: 'white',
                            padding: '15px',
                            borderRadius: '8px',
                            border: '1px solid #c8e6c9',
                            marginBottom: index < exampleRoutes.length - 1 ? '10px' : '0',
                        }}>
                            <code style={{
                                color: '#1976d2',
                                fontFamily: 'Monaco, Consolas, monospace',
                                fontSize: '14px',
                                fontWeight: '600',
                            }}>
                                {example.route}
                            </code>
                            <p style={{
                                color: '#666',
                                fontSize: '14px',
                                margin: '8px 0 0 0',
                            }}>
                                {example.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '25px',
                    borderRadius: '16px',
                    border: '1px solid #ff9800',
                    marginBottom: '30px',
                }}>
                    <h2 style={{
                        color: '#ef6c00',
                        fontSize: '20px',
                        fontWeight: '600',
                        margin: '0 0 15px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        🔧 Setup Requirements
                    </h2>
                    
                    <ul style={{
                        color: '#666',
                        lineHeight: '1.8',
                        paddingLeft: '20px',
                    }}>
                        <li>Family Tree App must be running on <strong>localhost:3000</strong></li>
                        <li>MongoDB must contain the flow configuration data</li>
                        <li>Flow must have valid nodes with START and END points</li>
                        <li>Use the flow editor to create and configure your flows</li>
                    </ul>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <Link href="/" style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)',
                    }}>
                        ← Back to Legacy Viewer
                    </Link>
                    
                    <a
                        href="http://localhost:3000"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '12px 24px',
                            backgroundColor: '#667eea',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                        }}
                    >
                        🚀 Open Family Tree Editor
                    </a>
                </div>

                <div style={{
                    marginTop: '40px',
                    textAlign: 'center',
                    color: '#6c757d',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                }}>
                    <p style={{ margin: '0 0 10px 0' }}>
                        📝 Create your flows in the Family Tree Editor, then use the generated URLs to view them here.
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#8e8e8e' }}>
                        This viewer integrates with MongoDB to fetch and render your flow configurations dynamically.
                    </p>
                </div>
            </div>
        </div>
    );
}