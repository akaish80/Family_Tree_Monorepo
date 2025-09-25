import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";



const MONGO_URL = "mongodb://127.0.0.1:27017";
const DB_NAME = "familyTree";
const COLLECTION = "configurations";

async function getCollection() {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db(DB_NAME);
    return db.collection(COLLECTION);
}


// Import or share the configurations object from the parent route if needed
// For demo, use a global (in production, use a DB or persistent store)
declare global {
    // eslint-disable-next-line no-var
    var configurations: Record<string, any>;
}

let configurations: Record<string, any> = globalThis.configurations || (globalThis.configurations = {});

export async function GET() {
    const collection = await getCollection();
    const configs = await collection.find({}, { projection: { name: 1 } }).toArray();
    // Return id and name for listing
    const configList = configs.map(cfg => ({
        id: cfg._id.toString(),
        name: cfg.name,
    }));
    return NextResponse.json(configList);

}

export async function POST(request: Request) {
    const body = await request.json();
    const collection = await getCollection();
    const result = await collection.insertOne({
        id: body.id,
        name: body.name,
        startNode: "",
        nodes: JSON.stringify([]),
        edges: JSON.stringify([]),
        dynamicMembers: [],
    });
    return NextResponse.json({ id: result.insertedId.toString(), name: body.name });

}