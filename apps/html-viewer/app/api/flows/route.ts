import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const flowId = searchParams.get('flowId');
  const configId = searchParams.get('configId');

  console.log(searchParams)
  if (!flowId) {
    return NextResponse.json(
      { error: 'Flow ID is required' },
      { status: 400 }
    );
  }

  try {
    // Fetch from the family-tree-app API
    const response = await fetch(`http://localhost:3000/api/family-tree/flows?flowId=${flowId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Flow not found' },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const flowData = await response.json();

    // Validate that the flow belongs to the specified config if provided
    // if (flowId && flowData.id !== flowId) {
    //   return NextResponse.json(
    //     { error: 'Flow does not belong to the specified configuration' },
    //     { status: 403 }
    //   );
    // }

    return NextResponse.json(flowData);
  } catch (error) {
    console.error('Error fetching flow data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flow data from family-tree-app' },
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