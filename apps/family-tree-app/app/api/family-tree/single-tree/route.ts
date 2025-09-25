import { NextResponse } from "next/server";

interface DynamicMember {
    id: string;
    name: string;
    timestamp: string;
}

interface FamilyTreeData {
    startNode: string;
    nodes: any[];
    edges: any[];
    dynamicMembers: DynamicMember[];
    updatedNode?: any[] | null;
}

// In-memory storage for demo (in production, use a database)
let familyTreeData: FamilyTreeData = {
    startNode: "1",
    nodes: [
        {
            id: "1",
            nodeName: "1",
            nextNode: "2",
            type: "START",
            position: { x: 250, y: 25 },
            data: {
                label: "START",
            },
        },
        {
            id: "2",
            nodeName: "2",
            type: "DECISION",
            position: { x: 100, y: 125 },
            data: {
                choices: [
                    {
                        nextNode: "3",
                        expression: 'type:queryParam~key:tenant~value:test',
                    },
                    {
                        nextNode: "4",
                        expression: "DEFAULT",
                    },
                ],
            },
        },
        {
            id: "3",
            nodeName: "3",
            type: "VIEW",
            position: { x: 100, y: 125 },
            data: {
                label: "param-node",
                transientData: "Found in Query Param",
            },
        },
        {
            id: "4",
            nodeName: "4",
            type: "VIEW",
            position: { x: 100, y: 125 },
            data: {
                label: "no-param-node",
                transientData: "Value without queryparam",
            },
        },
        {
            id: "5",
            type: "END",
            position: { x: 500, y: 350 },
            data: {
                label: "End",
            },
            style: {
                background: "#f3e5f5",
                border: "2px solid #7b1fa2",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px",
                width: 140,
            },
        },
    ],
    edges: [
        { id: "e1-2", source: "1", target: "2" },
        { id: "e2-3", source: "2", target: "3" },
        { id: "e2-4", source: "2", target: "4" },
        { id: "e3-5", source: "3", target: "5" },
        { id: "e4-5", source: "4", target: "5" },
    ],
    // Track dynamic members added by users
    dynamicMembers: [],
};

export async function GET() {
    const response = NextResponse.json({
        ...familyTreeData,
        // Include dynamic members in the response
        dynamicMembers: familyTreeData.dynamicMembers,
    });

    // Add CORS headers
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    return response;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Handle saving the entire tree
        if (body.action === "save" && body.nodes && body.edges) {
            familyTreeData.nodes = body.nodes;
            familyTreeData.edges = body.edges;
            familyTreeData.startNode = body.startNode || familyTreeData.startNode;
            familyTreeData.updatedNode = body.updatedNode || null;

            const response = NextResponse.json({
                success: true,
                message: "Family tree updated successfully",
                nodes: familyTreeData.nodes,
                edges: familyTreeData.edges,
            });

            // Add CORS headers
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );
            response.headers.set(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
            );

            return response;
        }


        if (body.action === "add" && body.node) {
            // Add new family member to dynamic members
            const newMember = {
                id: body.node.id,
                name: body.node.name,
                timestamp: new Date().toISOString(),
            };

            // Add to dynamic members array
            familyTreeData.dynamicMembers.push(newMember);

            const response = NextResponse.json({
                success: true,
                message: "Family member added successfully",
                member: newMember,
                totalDynamicMembers: familyTreeData.dynamicMembers.length,
            });

            // Add CORS headers
            response.headers.set("Access-Control-Allow-Origin", "*");
            response.headers.set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );
            response.headers.set(
                "Access-Control-Allow-Headers",
                "Content-Type, Authorization"
            );

            return response;
        }

        return NextResponse.json(
            { success: false, message: "Invalid request" },
            { status: 400 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}