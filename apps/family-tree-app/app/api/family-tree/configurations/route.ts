import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('configurations');

    if (configId) {
      // Get specific csonfiguration
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
    } else {
      // Get all configurations
      const configs = await collection.find({}).sort({ createdAt: -1 }).toArray();

      return NextResponse.json(
        configs,
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

export async function POST(request: NextRequest) {
  try {
    const { id, name, description } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Configuration name is required' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      );
    }

    const newConfig = {
      id: Date.now().toString(),
      name,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await client.connect();
    const db = client.db('familyTree');
    const collection = db.collection('configurations');

    await collection.insertOne(newConfig);

    return NextResponse.json(
      { 
        message: 'Configuration created successfully',
        configuration: newConfig
      },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error) {
    console.error('Error creating configuration:', error);
    return NextResponse.json(
      { error: 'Failed to create configuration' },
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