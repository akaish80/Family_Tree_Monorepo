import { NextResponse } from "next/server";import { MongoClient, ObjectId } from "mongodb";

const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "familyTree";
const COLLECTION = "configurations";

function withCORS(response: Response) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return response;
}

async function getCollection() {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    const collections = await db.listCollections({ name: COLLECTION }).toArray();
    if (collections.length === 0) {
        await db.createCollection(COLLECTION);
    }
    return db.collection(COLLECTION);
}

export async function GET(request: Request) {
    const url = new URL(request.url);
    const configId = url.searchParams.get("configId") || "default";
    // const config = configurations[configId];
     if (!configId) {
        return NextResponse.json({ success: false, message: "No configId provided" }, { status: 400 });
    }
     const collection = await getCollection();
   let config;
    try {
        config = await collection.findOne({ _id: new ObjectId(configId) });
    } catch (err) {
        return withCORS(NextResponse.json({ success: false, message: "Invalid configId" }, { status: 400 }));
    }
    if (!config) {
        return withCORS(NextResponse.json({ success: false, message: "Configuration not found" }, { status: 404 }));
    }
    const res = NextResponse.json({
        id: config._id.toString(),
        name: config.name,
        startNode: config.startNode,
        nodes: JSON.parse(config.nodes),
        edges: JSON.parse(config.edges),
        updateNode: JSON.parse(config.updatedNode || "{}"),
        dynamicMembers: config.dynamicMembers,
    });
    return withCORS(res);
    // return NextResponse.json();
}

// POST: Update application flow for a configuration
export async function POST(request: Request) {
    const url = new URL(request.url);
    const configId = url.searchParams.get("configId");
    if (!configId) {
        return NextResponse.json({ success: false, message: "No configId provided" }, { status: 400 });
    }
    const body = await request.json();
    const collection = await getCollection();
    const update: { [key: string]: any } = {};
    if (body.nodes) update["nodes"] = JSON.stringify(body.nodes);
    if (body.edges) update["edges"] = JSON.stringify(body.edges);
    if (body.startNode) update["startNode"] = body.startNode;
    if (body.updatedNode) update["updatedNode"] = JSON.stringify(body.updatedNode);
    if (body.dynamicMembers) update["dynamicMembers"] = body.dynamicMembers;
    await collection.updateOne(
        { _id: new ObjectId(configId) },
        { $set: update }
    );
    const res = NextResponse.json({ success: true, message: "Configuration updated" });
    return withCORS(res);
    // return NextResponse.json({ success: true, message: "Configuration updated" });
}


export async function OPTIONS() {
    return withCORS(new Response(null, { status: 200 }));
}