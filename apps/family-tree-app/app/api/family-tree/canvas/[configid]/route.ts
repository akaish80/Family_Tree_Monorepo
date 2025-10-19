import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ configid: string }> }
) {
  try {
    const { canvasData, configId, flowId, updatedAt, 
           pageElement,
           parentMapping, } = await request.json();
    
    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('canvasConfigs');

    // Update or insert canvas data for the specific config and flow
    const result = await collection.updateOne(
      { configId: configId, flowId: flowId || 'default' },
      {
        $set: {
          configId: configId,
          flowId: flowId || 'default',
          pageElement: pageElement,
          parentMapping: parentMapping,
          canvasData: canvasData,
          updatedAt: updatedAt,
        }
      },
      { upsert: true }
    );

    return NextResponse.json(
      { 
        message: 'Canvas saved successfully',
        id: result.upsertedId || 'updated'
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error saving canvas:', error);
    return NextResponse.json(
      { error: 'Failed to save canvas' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } finally {
    await client.close();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configid: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const flowId = searchParams.get('flowId');
    const { configid } = await params;
    const configId = configid;
    
    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('canvasConfigs');

    const canvasConfig = await collection.findOne({ 
      configId: configId,
      flowId: flowId || 'default'
    });

    if (!canvasConfig) {
      return NextResponse.json(
        { 
          canvasData: null,
          configId: configId,
          flowId: flowId || 'default',
          updatedAt: null
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json(
      { 
        canvasData: canvasConfig.canvasData,
        configId: canvasConfig.configId,
        flowId: canvasConfig.flowId,
        updatedAt: canvasConfig.updatedAt
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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