import React, { useCallback } from 'react';
import { Node } from 'reactflow';

interface NodeHandlersProps {
    selectedNode: Node | null;
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setEdges: (edges: any[] | ((edges: any[]) => any[])) => void;
    setSelectedNode: (node: Node | null) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: { nextNodeLabel: string; expression: string }[]) => void;
    setEditModalOpen: (open: boolean) => void;
}

export const useNodeHandlers = ({
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    setEditTitle,
    setEditHtml,
    setEditType,
    setEditConditions,
    setEditModalOpen,
}: NodeHandlersProps) => {
    
    // Node click handler
    const onNodeClick = useCallback((_: any, node: Node) => {
        setSelectedNode(node);
    }, [setSelectedNode]);

    // Edit node handler
    const handleEditNode = useCallback(() => {
        if (selectedNode) {
            setEditTitle(selectedNode?.data?.label || "");
            setEditHtml(selectedNode?.data?.transientData || "");
            setEditType(selectedNode?.type ?? null);
            setEditConditions(
                selectedNode?.data?.choices?.map((c: any) => ({
                    nextNodeLabel: c.nextNodeLabel || "",
                    expression: c.expression || "",
                })) || [{ nextNodeLabel: "", expression: "" }]
            );
            setEditModalOpen(true);
        }
    }, [selectedNode, setEditTitle, setEditHtml, setEditType, setEditConditions, setEditModalOpen]);

    // Save edited node
    const handleEditSave = useCallback((editTitle: string, editHtml: string, editConditions: any[], editType: string | null) => {
        if (selectedNode) {
            setNodes(nds =>
                nds.map(n => {
                    if (n.id !== selectedNode.id) return n;
                    if (editType === "VIEW") {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, transientData: editHtml },
                        };
                    }
                    if (editType === "DECISION") {
                        return {
                            ...n,
                            data: { ...n.data, label: editTitle, choices: editConditions },
                        };
                    }
                    return { ...n, data: { ...n.data, label: editTitle } };
                })
            );
            setEditModalOpen(false);
        }
    }, [selectedNode, setNodes, setEditModalOpen]);

    // Delete node
    const handleDeleteNode = useCallback(() => {
        if (selectedNode && selectedNode.type !== "START" && selectedNode.type !== "END") {
            setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
            setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
            setSelectedNode(null);
        }
    }, [selectedNode, setNodes, setEdges, setSelectedNode]);

    return {
        onNodeClick,
        handleEditNode,
        handleEditSave,
        handleDeleteNode,
    };
};