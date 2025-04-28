import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { scheduledDate } = await request.json();
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!scheduledDate) {
      return NextResponse.json(
        { success: false, error: 'Scheduled date is required' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/${id}/reschedule`,
      { scheduledDate },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error in reschedule API route:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data?.error || 'Failed to reschedule booking' 
      },
      { status: error.response?.status || 500 }
    );
  }
} 