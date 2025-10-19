export interface FamilyTreeNode {
    id: string;
    data: {
        label: string;
        transientData?: string;
    };
    position: {
        x: number;
        y: number;
    };
    type?: string;
}

export interface FamilyTreeEdge {
    id: string;
    source: string;
    target: string;
}

export interface FlowData {
    id: string;
    configId: string;
    flowName: string;
    description: string;
    nodes: FamilyTreeNode[];
    edges: FamilyTreeEdge[];
    startNode: string;
    updatedNode: any[];
    createdAt: string;
    updatedAt: string;
}

export interface DynamicMember {
    id: string;
    name: string;
    timestamp: string;
}

export interface DecisionMakerParams {
    inputdata: any;
    nextNode: string | null;
    nodes: any[];
    edges: any[];
}