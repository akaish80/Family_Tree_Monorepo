import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configid: string }> }
) {
  try {
    const { configid } = await params;
    // console.log('Arun1 -> '+ configid);
    const configId = configid;
    
    await client.connect();
    const db = client.db('familyTreeApp');
    const collection = db.collection('flows');

    // Get all flows for this configuration
    const flows = await collection.find({ configId: configId }).toArray();
    
    // If no flows exist, return empty array
    const flowList = flows.map(flow => ({
      id: flow.id,
      flowName: flow.flowName,
      description: flow.description,
      createdAt: flow.createdAt,
      updatedAt: flow.updatedAt
    }));

    return NextResponse.json(
      { 
        flows: flowList,
        configId: configId,
        count: flowList.length
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error fetching flows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flows' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } finally {
    await client.close();
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ configid: string }> }
) {
  try {
    const { configid } = await params;
    const configId = configid;
    const { flowId, flowName, description } = await request.json();
    
    await client.connect();
    const db = client.db('familyTreeApp');
    const collection = db.collection('flows');

    // Check if flow already exists
    const existingFlow = await collection.findOne({ 
      id: flowId,
      configId: configId 
    });

    if (existingFlow) {
      return NextResponse.json(
        { error: 'Flow already exists' },
        { 
          status: 409,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    // Create new flow with default START and END nodes
    const defaultNodes = [
      {
        id: "start",
        type: "START",
        position: { x: 250, y: 50 },
        data: { label: "START" }
      },
      {
        id: "end",
        type: "END",
        position: { x: 250, y: 400 },
        data: { label: "END" }
      }
    ];

    const result = await collection.insertOne({
      id: flowId,
      configId: configId,
      flowName: flowName || 'New Flow',
      description: description || '',
      nodes: defaultNodes,
      edges: [],
      startNode: 'start',
      updatedNode: defaultNodes.map(node => ({
        id: node.id,
        nodeName: node.data.label,
        nextNode: null,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Flow created successfully',
        id: result.insertedId,
        flowId: flowId,
        configId: configId
      },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error creating flow:', error);
    return NextResponse.json(
      { error: 'Failed to create flow' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } finally {
    await client.close();
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}