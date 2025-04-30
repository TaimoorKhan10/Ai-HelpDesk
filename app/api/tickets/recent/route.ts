import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
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

    // Find tickets
    const query = decoded.role === 'admin' 
      ? {} // Admin can see all tickets
      : { user: decoded.id }; // Users can only see their tickets

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Recent tickets error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch recent tickets' },
      { status: 500 }
    );
  }
} 