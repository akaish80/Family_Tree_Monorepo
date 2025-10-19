import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');
    const flowId = searchParams.get('flowId');
    const canvasName = searchParams.get('canvasName');

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('canvas');

    let query: any = {};
    
    if (configId) {
      query.configId = configId;
    }
    if (flowId) {
      query.flowId = flowId;
    }
    if (canvasName) {
      query.canvasName = { $regex: canvasName, $options: 'i' };
    }

    const canvas = await collection.find(query).toArray();

    return NextResponse.json(
      { canvas },
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
    console.error('Error fetching canvas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch canvas' },
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

export async function POST(request: NextRequest) {
  try {
    const { configId, flowId, canvasName, canvasDescription } = await request.json();
    
    if (!configId || !flowId || !canvasName) {
      return NextResponse.json(
        { error: 'Configuration ID, Flow ID, and Canvas Name are required' },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('canvas');

    // Check if canvas with same name already exists for this config/flow
    const existingCanvas = await collection.findOne({
      configId: configId,
      flowId: flowId,
      canvasName: canvasName
    });

    if (existingCanvas) {
      return NextResponse.json(
        { error: 'Canvas with this name already exists for the selected configuration and flow' },
        { status: 409 }
      );
    }

    const canvasData = {
      id: `${configId}-${flowId}-${canvasName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
      configId: configId,
      flowId: flowId,
      canvasName: canvasName,
      canvasDescription: canvasDescription || '',
      canvasData: null, // Will be populated when editing the canvas
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(canvasData);

    return NextResponse.json(
      { 
        message: 'Canvas created successfully',
        canvasId: result.insertedId,
        canvas: canvasData
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
    console.error('Error creating canvas:', error);
    return NextResponse.json(
      { error: 'Failed to create canvas' },
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
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    }
  );
}