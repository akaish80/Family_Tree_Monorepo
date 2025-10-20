import { useCallback } from 'react';
import { Node, Position } from 'reactflow';

interface DragDropHandlersProps {
    setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
    setSelectedNode: (node: Node | null) => void;
    setEditTitle: (title: string) => void;
    setEditHtml: (html: string) => void;
    setEditType: (type: string | null) => void;
    setEditConditions: (conditions: { nextNodeLabel: string; expression: string }[]) => void;
    setEditModalOpen: (open: boolean) => void;
}

export interface DragDropHandlersReturn {
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
}

export const useDragDropHandlers = ({
    setNodes,
    setSelectedNode,
    setEditTitle,
    setEditHtml,
    setEditType,
    setEditConditions,
    setEditModalOpen,
}: DragDropHandlersProps): DragDropHandlersReturn => {
    
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

            // Get the ReactFlow bounds for position calculation
            const reactFlowElement = (event.target as HTMLElement).closest('.react-flow');
            const reactFlowBounds = reactFlowElement?.getBoundingClientRect();
            
            const position = reactFlowBounds
                ? {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                }
                : { x: 250, y: 250 };

            let newNode: Node;
            let nodeId = `node_${+new Date()}`;

            if (type === "VIEW") {
                newNode = {
                    id: nodeId,
                    type: "VIEW",
                    position,
                    data: { label: "View Node", transientData: "" },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                setEditTitle("View Node");
                setEditHtml("");
                setEditType("VIEW");
            } else if (type === "DECISION") {
                newNode = {
                    id: nodeId,
                    type: "DECISION",
                    position,
                    data: { label: "Decision Node", choices: [{ nextNodeLabel: "", expression: "" }] },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                setEditTitle("Decision Node");
                setEditConditions([{ nextNodeLabel: "", expression: "" }]);
                setEditType("DECISION");
            } else if (type === "CANVAS") {
                // Get canvas data from drag event
                const canvasId = event.dataTransfer.getData("canvas-id");
                const canvasName = event.dataTransfer.getData("canvas-name");
                const canvasConfigId = event.dataTransfer.getData("canvas-config-id");
                const canvasFlowId = event.dataTransfer.getData("canvas-flow-id");

                newNode = {
                    id: nodeId,
                    type: "CANVAS",
                    position,
                    data: { 
                        label: canvasName || "Canvas Node",
                        canvasId: canvasId,
                        canvasName: canvasName,
                        configId: canvasConfigId,
                        flowId: canvasFlowId,
                    },
                    connectable: true,
                    sourcePosition: Position.Bottom,
                    targetPosition: Position.Top,
                };
                
                // Canvas nodes don't need editing modal, just add them directly
                setNodes(nds => nds.concat(newNode));
                setSelectedNode(newNode);
                return; // Early return to skip modal opening
            } else {
                return;
            }

            setNodes(nds => nds.concat(newNode));
            setSelectedNode(newNode);
            setEditModalOpen(true);
        },
        [setNodes, setSelectedNode, setEditTitle, setEditHtml, setEditType, setEditConditions, setEditModalOpen]
    );

    return {
        onDragOver,
        onDrop,
    };
};