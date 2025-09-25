"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

interface FamilyTreeNode {
    id: string;
    data: {
        label: string;
        transientData?: string;
    };
    position: {
        x: number;
        y: number;
    };
}

interface FamilyTreeEdge {
    id: string;
    source: string;
    target: string;
}

interface FamilyTreeData {
    nodes: FamilyTreeNode[];
    edges: FamilyTreeEdge[];
    dynamicMembers?: DynamicMember[];
    updatedNode?: any[] | null;
}

interface DynamicMember {
    id: string;
    name: string;
    timestamp: string;
}

export default function HTMLViewer() {
    const searchParams = useSearchParams();
    const configId = searchParams.get("configId");

    const [familyTreeData, setFamilyTreeData] = useState<FamilyTreeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastFetchTime, setLastFetchTime] = useState<string>('');
    const [isPolling, setIsPolling] = useState(false);

    const [htmlOutut, setHtmlOutput] = useState('')
    const [currentViewNode, setCurrentViewNode] = useState(null)
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);


    function parseKeyValuePair(str: string): Record<string, string> {
        return str.split('~')?.reduce((acc: Record<string, string>, pair: string) => {
            const [key, value] = pair.split(':')
            // if (key) {
            acc[key] = value
            // }
            return acc
        }, {})
    }

    const choiceEvaluator = (choices: any): any => {
        return choices.find((choice: any) => {
            const { expression } = choice
            const parsedValue = parseKeyValuePair(expression)
            switch (parsedValue.type) {
                case 'queryParam':
                    const urlParams = new URLSearchParams(window.location.search);
                    const key: string = parsedValue?.key || ''
                    const urlParamValue = urlParams.get(key)
                    return urlParamValue === parsedValue.value

                default:
                    break;
            }

        })

    }

    const handleDecisionNode = (nodeConfig: any) => {
        const choice = nodeConfig.data.choices;
        let defaultChoice
        let choiceResult
        if (choice?.length) {
            let filterChoice = choice

            if (choice.at(-1)?.expression === "DEFAULT") {
                defaultChoice = choice.at(-1).nextNode
                filterChoice = choice.slice(0, -1)
            }
            choiceResult = choiceEvaluator(filterChoice)?.nextNode
            return choiceResult || defaultChoice

        }
        return null
    }

    const decisionMaker = (nodeConfig: any, nextNode: string | null, nodes:any) => {
        let newNode: string | null = nextNode;
            switch (nodeConfig.type) {
                case 'DECISION':
                    setCurrentViewNode(null)
                    const choiceResult = handleDecisionNode(nodeConfig)
                    if (choiceResult === null) {
                        return choiceResult
                    }
                    newNode = choiceResult
                    break;
                case 'VIEW':
                    setCurrentNodeId(nodeConfig.id)
                    setCurrentViewNode(nodeConfig)
                    newNode = null
                    break;
                case 'END':
                    setCurrentViewNode(null)
                    newNode = null
                    break;

            }

            // const nextNewNode = data.nodes.find((node: any) => node.nodeName === nextNode)
            // // setHtmlOutput()
            // if (nextNewNode?.type === 'DATA') {
            //     setHtmlOutput(nextNewNode.data.transientData)
            // }
            if (newNode !== null){
                //   if (!familyTreeData || !currentNodeId) return;
                // const edge = familyTreeData?.edges?.find(e => e.source === newNode);
                const node = nodes.find(e => e.id === newNode);
                decisionMaker(node, node?.nextNode || null, nodes)

            return newNode
        }
    }

    useEffect(() => {
        const parseFamilyTreeData = (data: any): any => {
            debugger;
            const responseNode = data.updateNode || data.updatedNode || data.nodes
            const nodeConfig = responseNode.find((node: any) => node.id === data.startNode)
            let nextNode: string | null = nodeConfig.nextNode

            decisionMaker(nodeConfig, nextNode, responseNode)
            // let nextNode: string = nodeConfig.nextNode
            // switch (nodeConfig.nodeType) {
            //     case 'DECISION':
            //         const choiceResult = handleDecisionNode(nodeConfig)
            //         if (choiceResult === null) {
            //             return choiceResult
            //         }
            //         nextNode = choiceResult
            //         break;
            //     case 'VIEW':
            //         setCurrentViewNode(nodeConfig)
            //         break;

            // }

            // const nextNewNode = data.nodes.find((node: any) => node.nodeName === nextNode)
            // // setHtmlOutput()
            // if (nextNewNode?.type === 'DATA') {
            //     setHtmlOutput(nextNewNode.data.transientData)
            // }
        }

        const fetchFamilyTreeData = async () => {
            try {
                // Fetch data from the family-tree-app API
                let response;
                if (configId) {
                    // Fetch data for specific configId
                    response = await axios.get(`http://localhost:3000/api/family-tree?configId=${configId}`);
                } else {
                    // Fetch default/single tree
                    response = await axios.get('http://localhost:3000/api/family-tree/single-tree');
                }
                setFamilyTreeData(response.data);
                parseFamilyTreeData(response.data);
                setLoading(false);
                setError(null);
                setLastFetchTime(new Date().toLocaleTimeString());
            } catch (err) {
                setError('Failed to fetch family tree data. Make sure the family-tree-app is running on port 3000.');
                setLoading(false);
                // Stop polling if there's an error
                setIsPolling(false);
            }
        };

        // Initial fetch
        fetchFamilyTreeData();

        // Set up polling only if polling is enabled
        let interval: NodeJS.Timeout | null = null;

        if (isPolling) {
            interval = setInterval(() => {
                if (!document.hidden) { // Only poll when tab is active
                    fetchFamilyTreeData();
                }
            }, 5000); // Reduced frequency to 5 seconds
        }

        // Cleanup function
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isPolling]);

    const togglePolling = () => {
        setIsPolling(!isPolling);
    };

    const goToNextNode = () => {
        
        if (!familyTreeData ) return;
        const nextNode = currentViewNode?.id
        const nodes = familyTreeData?.updatedNode || familyTreeData?.nodes
        const edge = familyTreeData?.edges?.find(e => e.source === nextNode);
        const node = nodes?.find(e => e.id === edge?.target);

        if (edge) {
            decisionMaker(node, edge.target, nodes);
            setCurrentNodeId(edge.target);
        }
    }


      const renderViewNodePage = (node: FamilyTreeNode) => (
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
            }}>{node.data.label}</h2>
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
                dangerouslySetInnerHTML={{ __html: node.data.transientData || '' }}
            />
            <button
                onClick={goToNextNode}
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
    const manualRefresh = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/family-tree/single-tree');
            setFamilyTreeData(response.data);
            setLoading(false);
            setError(null);
            setLastFetchTime(new Date().toLocaleTimeString());
        } catch (err) {
            setError('Failed to fetch family tree data. Make sure the family-tree-app is running on port 3000.');
            setLoading(false);
        }
    };

    const renderFamilyTreeHTML = (data: FamilyTreeData) => {
        // Create a simple hierarchical representation
        const nodeMap = new Map();
        data.nodes.forEach(node => {
            nodeMap.set(node.id, { ...node, children: [] });
        });

        // Build hierarchy based on edges
        data.edges.forEach(edge => {
            const parent = nodeMap.get(edge.source);
            const child = nodeMap.get(edge.target);
            if (parent && child) {
                parent.children.push(child);
            }
        });

        // Find root nodes (nodes without incoming edges)
        const childIds = new Set(data.edges.map(edge => edge.target));
        const rootNodes = data.nodes.filter(node => !childIds.has(node.id));

        const renderNode = (node: any, depth: number = 0): React.JSX.Element => (
            <div key={node.id} style={{
                marginLeft: `${depth * 30}px`,
                marginBottom: '15px',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: depth === 0 ? '#e3f2fd' : depth === 1 ? '#f1f8e9' : '#fce4ec',
                borderColor: depth === 0 ? '#1976d2' : depth === 1 ? '#388e3c' : '#c2185b',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: node.children?.length > 0 ? '10px' : '0',
                }}>
                    <span style={{
                        fontSize: '18px',
                        marginRight: '8px',
                    }}>
                        {depth === 0 ? '👴' : depth === 1 ? '👨‍👩‍👧‍👦' : '👶'}
                    </span>
                    <strong style={{
                        fontSize: '16px',
                        color: depth === 0 ? '#1976d2' : depth === 1 ? '#388e3c' : '#c2185b',
                    }}>
                        {node.data.label}
                    </strong>
                </div>
                {/* {node.children && node.children.length > 0 && (
          <div style={{ marginTop: '15px' }}>
            {node.children.map((child: any) => renderNode(child, depth + 1))}
          </div>
        )} */}
            </div>
        );

        return (
            <div>
                {rootNodes.map(node => renderNode(nodeMap.get(node.id)))}
            </div>
        );
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '1400px',
            margin: '0 auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '20px',
                padding: '30px',
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
                        fontSize: '36px',
                        fontWeight: '700',
                        margin: '0 0 10px 0',
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        📊 Family Tree HTML Viewer
                    </h1>
                    <p style={{
                        color: '#666',
                        fontSize: '18px',
                        margin: '0',
                        fontWeight: '400',
                    }}>
                        Beautiful HTML representation of your family tree data
                    </p>

                    {/* Polling Controls */}
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                        flexWrap: 'wrap',
                    }}>
                        <button
                            onClick={togglePolling}
                            style={{
                                padding: '8px 16px',
                                background: isPolling ? '#f44336' : '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            {isPolling ? '⏸️ Stop Auto-refresh' : '▶️ Start Auto-refresh'}
                        </button>

                        <button
                            onClick={manualRefresh}
                            disabled={loading}
                            style={{
                                padding: '8px 16px',
                                background: loading ? '#ccc' : '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                        >
                            {loading ? '⏳ Loading...' : '🔄 Refresh Now'}
                        </button>

                        {lastFetchTime && (
                            <div style={{
                                padding: '6px 12px',
                                backgroundColor: '#e3f2fd',
                                border: '1px solid #90caf9',
                                borderRadius: '15px',
                                fontSize: '12px',
                                color: '#1976d2',
                                fontWeight: '500',
                            }}>
                                Last updated: {lastFetchTime}
                            </div>
                        )}

                        <div style={{
                            padding: '6px 12px',
                            backgroundColor: isPolling ? '#e8f5e8' : '#fff3e0',
                            border: `1px solid ${isPolling ? '#4caf50' : '#ff9800'}`,
                            borderRadius: '15px',
                            fontSize: '12px',
                            color: isPolling ? '#2e7d32' : '#f57c00',
                            fontWeight: '500',
                        }}>
                            {isPolling ? '🟢 Live Updates ON' : '🟡 Live Updates OFF'}
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '30px',
                    borderRadius: '16px',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                }}>
                    {loading && (
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
                            Loading family tree data...
                        </div>
                    )}
                           

                    {error && (
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
                    )}

                    {familyTreeData && !loading && !error && (
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '30px',
                                padding: '15px',
                                backgroundColor: '#e8f5e8',
                                borderRadius: '12px',
                                border: '1px solid #c8e6c9',
                            }}>
                                <span style={{ fontSize: '24px', marginRight: '10px' }}>✅</span>
                                <h2 style={{
                                    color: '#2e7d32',
                                    margin: '0',
                                    fontSize: '24px',
                                    fontWeight: '600',
                                }}>
                                    Family Tree Structure Loaded Successfully
                                </h2>
                            </div>
                            {renderFamilyTreeHTML(familyTreeData)}

                            {/* Display Dynamic Members */}
                            {familyTreeData.dynamicMembers && familyTreeData.dynamicMembers.length > 0 && (
                                <div style={{ marginTop: '30px' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: '20px',
                                        padding: '15px',
                                        backgroundColor: '#e8f5e8',
                                        borderRadius: '12px',
                                        border: '1px solid #4caf50',
                                    }}>
                                        <span style={{ fontSize: '24px', marginRight: '10px' }}>👥</span>
                                        <h3 style={{
                                            color: '#2e7d32',
                                            margin: '0',
                                            fontSize: '20px',
                                            fontWeight: '600',
                                        }}>
                                            Recently Added Family Members ({familyTreeData.dynamicMembers.length})
                                        </h3>
                                    </div>

                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '15px',
                                    }}>
                                        {familyTreeData.dynamicMembers.map((member, index) => (
                                            <div key={member.id} style={{
                                                padding: '15px',
                                                background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
                                                border: '2px solid #4caf50',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                                                transition: 'transform 0.2s ease',
                                            }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '8px',
                                                }}>
                                                    <span style={{ fontSize: '20px', marginRight: '8px' }}>
                                                        ✨
                                                    </span>
                                                    <strong style={{
                                                        fontSize: '16px',
                                                        color: '#2e7d32',
                                                    }}>
                                                        {member.name}
                                                    </strong>
                                                </div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#666',
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                }}>
                                                    Added: {new Date(member.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                        🔍 View Raw JSON Data
                                    </summary>
                                    <pre style={{
                                        backgroundColor: '#f8f9fa',
                                        padding: '20px',
                                        margin: '0',
                                        overflow: 'auto',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
                                        color: '#495057',
                                    }}>
                                        {JSON.stringify(familyTreeData, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        </div>
                    )}
                </div>
                <div>Parsed Restult
                    <p style={{ margin: '0', fontSize: '12px', color: '#8e8e8e' }}>{htmlOutut}</p></div>

                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    color: '#6c757d',
                    padding: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '12px',
                }}>
                    <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                        🔗 This HTML viewer fetches data from the React Flow family tree app running on port 3000.
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                        Make sure to start both applications with: <code style={{
                            backgroundColor: '#f1f3f4',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'Monaco, monospace',
                            fontSize: '13px',
                        }}>npm run dev</code>
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#8e8e8e' }}>
                        {isPolling
                            ? '⚡ Auto-refresh every 5 seconds when tab is active'
                            : '⏸️ Auto-refresh is paused - use manual refresh to update data'
                        }
                    </p>
                </div>
                {currentViewNode?.type === 'VIEW' && renderViewNodePage(currentViewNode)}

            </div>

            <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
