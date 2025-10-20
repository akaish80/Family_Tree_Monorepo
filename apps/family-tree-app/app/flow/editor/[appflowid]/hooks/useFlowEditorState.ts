import { useState, useEffect, useCallback } from "react";
import { useNodesState, useEdgesState, Node, Edge, addEdge, OnConnect, Position } from "reactflow";

interface AppFlowData {
    id: string;
    configId: string;
    flowName: string;
    description: string;
    nodes?: Node[];
    edges?: Edge[];
    createdAt: string;
    updatedAt: string;
}

// Default nodes for empty flow
const defaultNodes: Node[] = [
    {
        id: "start",
        type: "START",
        position: { x: 250, y: 50 },
        data: { label: "START" },
        style: {
            background: '#e1f5fe',
            border: '2px solid #01579b',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 180,
        },
        deletable: false,
        connectable: true,
        sourcePosition: Position.Bottom,
    },
    {
        id: "end",
        type: "END",
        position: { x: 250, y: 400 },
        data: { label: "END" },
        style: {
            background: '#ffebee',
            border: '2px solid #d32f2f',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '10px',
            width: 180,
        },
        deletable: false,
        connectable: true,
        targetPosition: Position.Top,
    },
];

export interface FlowEditorState {
    // Data state
    appFlowData: AppFlowData | null;
    configData: any;
    error: string | null;
    loading: boolean;
    notification: string | null;

    // Flow state
    nodes: Node[];
    edges: Edge[];
    selectedNode: Node | null;
    nextNodePosition: { x: number; y: number };

    // Modal state
    editModalOpen: boolean;
    editTitle: string;
    editHtml: string;
    editType: string | null;
    editConditions: { nextNodeLabel: string; expression: string }[];

    // Setters
    setAppFlowData: (data: AppFlowData | null) => void;
    setConfigData: (data: any) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
    setNotification: (notification: string | null) => void;
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
    setSelectedNode: (node: Node | null) => void;
    setNextNodePosition: (position: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
    setEditModalOpen: (open: boolean) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: { nextNodeLabel: string; expression: string }[]) => void;

    // Handlers
    onNodesChange: (changes: any[]) => void;
    onEdgesChange: (changes: any[]) => void;
    onConnect: OnConnect;
    onNodesChangeFiltered: (changes: any[]) => void;

    // Actions
    handleSave: () => Promise<void>;
    handleCancel: () => Promise<void>;
    handlePreview: () => void;
    handleNodeSaved: (nodeData: { id: string; name: string }) => void;
    isValidConnection: (connection: any) => boolean;
}

export const useFlowEditorState = (configId: string, flowId: string): FlowEditorState => {
    // Data state
    const [appFlowData, setAppFlowData] = useState<AppFlowData | null>(null);
    const [configData, setConfigData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState<string | null>(null);

    // Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState(defaultNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [nextNodePosition, setNextNodePosition] = useState({ x: 200, y: 600 });

    // Modal state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editHtml, setEditHtml] = useState("");
    const [editType, setEditType] = useState<string | null>(null);
    const [editConditions, setEditConditions] = useState<{ nextNodeLabel: string; expression: string }[]>([]);

    // Fetch app flow data and configuration
    useEffect(() => {
        const fetchAppFlowData = async () => {
            if (!flowId) {
                setError("Configuration ID and Flow ID are required.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                
                // Fetch app flow data
                const flowResponse = await fetch(`/api/family-tree/flows?id=${flowId}`);
                if (flowResponse.ok) {
                    const flowsData = await flowResponse.json();
                    const currentFlow = flowsData.flows?.find((flow: any) => flow.id === flowId);
                    
                    if (currentFlow) {
                        setAppFlowData(currentFlow);
                        
                        // Load existing nodes and edges if they exist
                        if (currentFlow.nodes && currentFlow.nodes.length > 0) {
                            setNodes(currentFlow.nodes);
                        } else {
                            setNodes(defaultNodes);
                        }
                        
                        if (currentFlow.edges && currentFlow.edges.length > 0) {
                            setEdges(currentFlow.edges);
                        }
                        
                        setError(null);
                    } else {
                        // Flow doesn't exist yet, create with default nodes
                        console.log('Flow not found, starting with default nodes');
                        setAppFlowData({
                            id: flowId,
                            configId: configId,
                            flowName: 'New App Flow',
                            description: '',
                            nodes: defaultNodes,
                            edges: [],
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                        setNodes(defaultNodes);
                        setEdges([]);
                    }
                } else {
                    // API error, still show default nodes
                    console.log('Error fetching flows, starting with default nodes');
                    setAppFlowData({
                        id: flowId,
                        configId: configId,
                        flowName: 'New App Flow',
                        description: '',
                        nodes: defaultNodes,
                        edges: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    });
                    setNodes(defaultNodes);
                    setEdges([]);
                }
            } catch (err) {
                console.error('Error fetching app flow data:', err);
                setError("Unable to fetch app flow data. Please try again.");
                setNodes(defaultNodes);
                setEdges([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAppFlowData();
    }, [configId, flowId, setNodes, setEdges]);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    // Function to validate connections - allow all connections except START as target
    const isValidConnection = useCallback((connection: any) => {
        // Don't allow connections to START node
        if (connection.target === "start") {
            return false;
        }
        // Allow all other connections, including to END node
        return true;
    }, []);

    const onNodesChangeFiltered = useCallback(
        (changes: any[]) => {
            const filtered = changes.filter((change: { type: string; id: string; }) => {
                if (change.type === 'remove') {
                    const node = nodes.find(n => n.id === change.id);
                    if (node && (node.type === 'START' || node.type === 'END')) {
                        return false;
                    }
                }
                return true;
            });
            onNodesChange(filtered);
        },
        [onNodesChange, nodes]
    );

    // Function to handle when a new node is saved
    const handleNodeSaved = useCallback((nodeData: { id: string, name: string }) => {
        const newNode: Node = {
            id: nodeData.id,
            type: 'default',
            position: { x: nextNodePosition.x, y: nextNodePosition.y },
            data: {
                label: nodeData.name,
            },
            style: {
                background: '#e1f7d5',
                border: '2px solid #4caf50',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '10px',
                width: 160,
                boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
                animation: 'pulse 2s',
            },
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setNotification(`✨ Added "${nodeData.name}" to the family tree!`);
        setTimeout(() => setNotification(null), 3000);
        setNextNodePosition(prev => ({
            x: prev.x + 220,
            y: prev.x > 800 ? prev.y + 100 : prev.y,
        }));
        if (nextNodePosition.x > 800) {
            setNextNodePosition(prev => ({ x: 200, y: prev.y }));
        }
    }, [setNodes, nextNodePosition]);

    const handlePreview = useCallback(() => {
        window.open(`http://localhost:3001/${configId}/${flowId}`, '_blank');
    }, [configId, flowId]);

    // Save app flow
    const handleSave = useCallback(async () => {
        try {
            let startNode = '';
            const updatedNode = nodes.map(item => {
                if (item.type === 'START') startNode = item.id;
                const targetNode = edges.filter(edge => edge.source === item.id)?.[0]?.target;
                return {
                    "id": item.id,
                    "nodeName": item.data.label,
                    "nextNode": targetNode,
                    "type": item.type,
                    "position": item.position,
                    "data": item.data
                };
            });

            const saveData = {
                configId,
                flowId,
                flowName: appFlowData?.flowName || 'App Flow',
                description: appFlowData?.description || '',
                startNode,
                nodes,
                edges,
                updatedNode,
                updatedAt: new Date().toISOString()
            };

            const response = await fetch(`/api/family-tree/flows/editor/${flowId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData),
            });

            if (response.ok) {
                setNotification('✨ App flow saved successfully!');
                setTimeout(() => setNotification(null), 3000);
            } else {
                throw new Error('Failed to save app flow');
            }
        } catch (error) {
            console.error('Error saving app flow:', error);
            setNotification('❌ Failed to save app flow');
            setTimeout(() => setNotification(null), 3000);
        }
    }, [configId, flowId, appFlowData, nodes, edges]);

    // Cancel changes (reload from server)
    const handleCancel = useCallback(async () => {
        try {
            const response = await fetch(`/api/family-tree/flows?configId=${configId}`);
            if (response.ok) {
                const flowsData = await response.json();
                const currentFlow = flowsData.flows?.find((flow: any) => flow.id === flowId);
                
                if (currentFlow) {
                    setNodes(currentFlow.nodes || defaultNodes);
                    setEdges(currentFlow.edges || []);
                    setAppFlowData(currentFlow);
                } else {
                    setNodes(defaultNodes);
                    setEdges([]);
                }
            } else {
                setNodes(defaultNodes);
                setEdges([]);
            }
            setNotification('Changes cancelled');
            setTimeout(() => setNotification(null), 2000);
        } catch (error) {
            console.error('Error cancelling changes:', error);
            setNodes(defaultNodes);
            setEdges([]);
        }
    }, [configId, flowId, setNodes, setEdges]);

    return {
        // Data state
        appFlowData,
        configData,
        error,
        loading,
        notification,

        // Flow state
        nodes,
        edges,
        selectedNode,
        nextNodePosition,

        // Modal state
        editModalOpen,
        editTitle,
        editHtml,
        editType,
        editConditions,

        // Setters
        setAppFlowData,
        setConfigData,
        setError,
        setLoading,
        setNotification,
        setNodes,
        setEdges,
        setSelectedNode,
        setNextNodePosition,
        setEditModalOpen,
        setEditTitle,
        setEditHtml,
        setEditType,
        setEditConditions,

        // Handlers
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodesChangeFiltered,

        // Actions
        handleSave,
        handleCancel,
        handlePreview,
        handleNodeSaved,
        isValidConnection,
    };
};