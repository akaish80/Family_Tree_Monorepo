import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ configId: string }> }
) {
  try {
    const { configId } = await params;

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('configurations');

    const config = await collection.findOne({ id: configId });

    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    return NextResponse.json(
      config,
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
    console.error('Error fetching configuration:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}