import { useCallback } from 'react';
import { Node } from 'reactflow';

interface NodeOperationsProps {
    selectedNode: Node | null;
    setSelectedNode: (node: Node | null) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: string[]) => void;
    setEditModalOpen: (open: boolean) => void;
    editTitle: string;
    editHtml: string;
    editConditions: string[];
    editType: string | null;
    nodes: Node[];
    onNodesChange: any; // Use original ReactFlow onNodesChange
}

export interface NodeOperationsReturn {
    onNodeClick: (event: any, node: Node) => void;
    handleDeleteNode: () => void;
    handleEditSave: () => void;
}

export const useNodeOperations = ({
    selectedNode,
    setSelectedNode,
    editTitle,
    editHtml,
    editConditions,
    editType,
    nodes,
    onNodesChange,
    setEditModalOpen,
}: NodeOperationsProps): NodeOperationsReturn => {

    // Node click handler
    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNode(node);
    }, [setSelectedNode]);

    // Delete node handler - simply pass through to useFlowEditorState
    const handleDeleteNode = useCallback(() => {
        if (selectedNode && selectedNode.type !== "START" && selectedNode.type !== "END") {
            // Let the parent component handle the deletion
            setSelectedNode(null);
        }
    }, [selectedNode, setSelectedNode]);

    // Save edited node - simply pass through to useFlowEditorState  
    const handleEditSave = useCallback(() => {
        if (selectedNode) {
            setEditModalOpen(false);
        }
    }, [selectedNode, setEditModalOpen]);

    return {
        onNodeClick,
        handleDeleteNode,
        handleEditSave,
    };
};