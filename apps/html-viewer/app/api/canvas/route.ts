import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('configId');
    const flowId = searchParams.get('flowId');

    if (!configId || !flowId) {
      return NextResponse.json(
        { error: 'configId and flowId are required' },
        { status: 400 }
      );
    }

    // Forward the request to the family-tree-app API
    const familyTreeApiUrl = `http://localhost:3000/api/family-tree/canvas/${configId}/${flowId}`;
    console.log('Fetching canvas data from:', familyTreeApiUrl);

    const response = await fetch(familyTreeApiUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from family-tree API:', response.status, errorText);
      
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Canvas not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to fetch canvas data from family-tree-app' },
        { status: response.status }
      );
    }

    const canvasData = await response.json();
    console.log('Canvas data fetched successfully:', canvasData);

    return NextResponse.json(canvasData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Error in canvas proxy:', error);
    return NextResponse.json(
      { error: 'Failed to fetch canvas data' },
      { status: 500 }
    );
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