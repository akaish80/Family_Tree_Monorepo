import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  try {
    const { flowId } = await params;
    console.log('Arun2 -> '+ flowId);

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('flows');

    const flow = await collection.findOne({ id: flowId });

    if (!flow) {
      return NextResponse.json(
        { error: 'Flow not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json(
      flow,
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error fetching flow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flow' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ flowId: string }> }
) {
  try {
    const { flowId } = await params;
    const { 
      configId, 
      flowName, 
      description, 
      nodes, 
      edges, 
      startNode, 
      updatedNode 
    } = await request.json();

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('flows');

    // Update or insert flow data
    const updateData = {
      id: flowId,
      configId: configId,
      flowName: flowName || 'App Flow',
      description: description || '',
      nodes: nodes || [],
      edges: edges || [],
      startNode: startNode || '',
      updatedNode: updatedNode || [],
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.updateOne(
      { id: flowId },
      { 
        $set: updateData,
        $setOnInsert: { createdAt: new Date().toISOString() }
      },
      { upsert: true }
    );

    return NextResponse.json(
      { 
        message: 'Flow saved successfully',
        flowId: flowId,
        upserted: result.upsertedCount > 0
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error saving flow:', error);
    return NextResponse.json(
      { error: 'Failed to save flow' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}