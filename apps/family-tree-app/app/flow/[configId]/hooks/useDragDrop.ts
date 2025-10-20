import { useCallback } from 'react';
import { Node } from 'reactflow';

interface UseDragDropProps {
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setSelectedNode: (node: Node | null) => void;
    setEditModalOpen: (open: boolean) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: { nextNodeLabel: string; expression: string }[]) => void;
}

export const useDragDrop = ({
    setNodes,
    setSelectedNode,
    setEditModalOpen,
    setEditTitle,
    setEditHtml,
    setEditType,
    setEditConditions,
}: UseDragDropProps) => {
    
    // Drag and drop handlers for React Flow
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Drop handler
    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow");
            if (!type) return;

            const reactFlowBounds = (event.target as HTMLElement).closest('.react-flow')?.getBoundingClientRect();
            const position = reactFlowBounds
                ? {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                }
                : { x: 250, y: 250 };

            let newNode: Node;
            let nodeId = `node_${+new Date()}`;

            if (type === "view") {
                newNode = {
                    id: nodeId,
                    type: "VIEW",
                    position,
                    data: { label: "View Node", transientData: "" },
                };
                setEditTitle("View Node");
                setEditHtml("");
                setEditType("view");
            } else if (type === "DECISION") {
                newNode = {
                    id: nodeId,
                    type: "DECISION",
                    position,
                    data: { label: "Decision Node", choices: [{ nextNodeLabel: "", expression: "" }] },
                };
                setEditTitle("Decision Node");
                setEditConditions([{ nextNodeLabel: "", expression: "" }]);
                setEditType("DECISION");
            } else {
                return;
            }

            setNodes(nds => nds.concat(newNode));
            setSelectedNode(newNode);
            setEditModalOpen(true);
        },
        [setNodes, setSelectedNode, setEditModalOpen, setEditTitle, setEditHtml, setEditType, setEditConditions]
    );

    return {
        onDragOver,
        onDrop,
    };
};