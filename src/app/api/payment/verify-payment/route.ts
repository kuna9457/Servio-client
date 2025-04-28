import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from the request headers
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the backend server
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${backendUrl}/payments/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Unexpected content type from backend:', contentType);
      const text = await response.text();
      console.error('Response text:', text);
      return NextResponse.json(
        { success: false, error: 'Backend server returned non-JSON response' },
        { status: 500 }
      );
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response with the same status code
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Error in verify-payment API route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 