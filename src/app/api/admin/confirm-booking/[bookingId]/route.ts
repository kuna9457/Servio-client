import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;
    const body = await request.json();
    const { agentId } = body;

    // Validate input
    if (!bookingId || !agentId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID and Agent ID are required' },
        { status: 400 }
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful response
    return NextResponse.json({
      success: true,
      data: {
        message: 'Booking confirmed successfully',
        bookingId,
        agentId,
        status: 'confirmed',
        confirmedAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error in confirm-booking route:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 