import { useState, useEffect, useCallback } from "react";
import { useNodesState, useEdgesState, Node, Edge, addEdge, OnConnect } from "reactflow";
import axios from "axios";

export interface FlowStateReturn {
    // State
    configData: any;
    error: string | null;
    nodes: Node[];
    edges: Edge[];
    selectedNode: Node | null;
    editModalOpen: boolean;
    editTitle: string;
    editHtml: string;
    editType: string | null;
    editConditions: { nextNodeLabel: string; expression: string }[];
    notification: string | null;
    nextNodePosition: { x: number; y: number };

    // Setters
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void;
    setSelectedNode: (node: Node | null) => void;
    setEditModalOpen: (open: boolean) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: { nextNodeLabel: string; expression: string }[]) => void;
    setNotification: (notification: string | null) => void;
    setNextNodePosition: (position: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;

    // Handlers
    onNodesChange: (changes: any[]) => void;
    onEdgesChange: (changes: any[]) => void;
    onConnect: OnConnect;
    onNodesChangeFiltered: (changes: any[]) => void;

    // Actions
    handleNodeSaved: (nodeData: { id: string; name: string }) => void;
    handleSave: () => Promise<void>;
    handleCancel: () => Promise<void>;
    handlePreview: () => void;
}

export const useFlowState = (configId: string): FlowStateReturn => {
    const [configData, setConfigData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editTitle, setEditTitle] = useState("");
    const [editHtml, setEditHtml] = useState("");
    const [editType, setEditType] = useState<string | null>(null);
    const [editConditions, setEditConditions] = useState<{ nextNodeLabel: string; expression: string }[]>([]);
    const [notification, setNotification] = useState<string | null>(null);
    const [nextNodePosition, setNextNodePosition] = useState({ x: 200, y: 600 });

    // Fetch configuration data
    useEffect(() => {
        axios
            .get(`/api/family-tree?configId=${configId}`)
            .then(res => {
                if (res.data && res.data.success === false && res.data.message === "Configuration not found") {
                    setError("Configuration not found.");
                    setConfigData(null);
                } else {
                    setConfigData(res.data);
                    setError(null);
                    setNodes(res.data.nodes || []);
                    setEdges(res.data.edges || []);
                }
            })
            .catch(() => {
                setError("Unable to fetch configuration. Please try again.");
                setConfigData(null);
            });
    }, [configId, setNodes, setEdges]);

    // Initial default nodes if empty
    useEffect(() => {
        if (nodes.length === 0 && !error) {
            setNodes([
                {
                    id: "start",
                    type: "START",
                    position: { x: 100, y: 50 },
                    data: { label: "START" },
                },
                {
                    id: "end",
                    type: "END",
                    position: { x: 500, y: 350 },
                    data: { label: "End" },
                },
            ]);
        }
    }, [nodes, error, setNodes]);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

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

    // Save app flow
    const handleSave = async () => {
        let startNode = ''
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
        await axios.post(`/api/family-tree?configId=${configId}`, {
            action: "save",
            startNode,
            nodes,
            edges,
            updatedNode
        });
    };

    // Cancel changes (reload from server)
    const handleCancel = async () => {
        const res = await axios.get(`/api/family-tree?configId=${configId}`);
        setNodes(res.data.nodes || []);
        setEdges(res.data.edges || []);
    };

    const handlePreview = () => {
        window.open(`https://localhost:3001/html-viewer?configId=${configId}`, '_blank');
    };

    return {
        // State
        configData,
        error,
        nodes,
        edges,
        selectedNode,
        editModalOpen,
        editTitle,
        editHtml,
        editType,
        editConditions,
        notification,
        nextNodePosition,

        // Setters
        setNodes,
        setEdges,
        setSelectedNode,
        setEditModalOpen,
        setEditTitle,
        setEditHtml,
        setEditType,
        setEditConditions,
        setNotification,
        setNextNodePosition,

        // Handlers
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodesChangeFiltered,

        // Actions
        handleNodeSaved,
        handleSave,
        handleCancel,
        handlePreview,
    };
};