import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
        
    const configId = searchParams.get('configId') 
    const flowId = searchParams.get('flowId');
        console.log('Arun3 -> '+ flowId)

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('flows');

    let flows;
    if (configId) {
      flows = await collection.find({ configId: configId }).toArray();
    } else if (flowId){
      flows = await collection.find({ id: flowId }).toArray();
    } else {
      flows = await collection.find({}).toArray();
    }

        console.log('Flowsun3 -> '+ flows)
    return NextResponse.json(
      { flows },
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

export async function POST(request: NextRequest) {
  try {
    const { configId, flowName, description, id } = await request.json();

    if (!configId || !flowName) {
      return NextResponse.json(
        { error: 'configId and flowName are required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('flows');

    const result = await collection.insertOne({
      configId: configId,
      id: id,
      flowName: flowName,
      description: description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        message: 'Flow created successfully',
        flowId: result.insertedId
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