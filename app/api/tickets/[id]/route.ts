import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'default_secret'
    ) as { id: string; role: string };

    // Connect to database
    await connectToDatabase();

    // Find ticket
    const ticket = await Ticket.findById(params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .populate('messages.sender', 'name');

    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this ticket
    if (decoded.role !== 'admin' && ticket.user._id.toString() !== decoded.id) {
      return NextResponse.json(
        { message: 'You are not authorized to view this ticket' },
        { status: 403 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error: any) {
    console.error('Get ticket error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch ticket' },
      { status: 500 }
    );
  }
} 