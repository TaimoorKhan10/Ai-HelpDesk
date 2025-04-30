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

    // Base query depending on user role
    const baseQuery = decoded.role === 'admin' 
      ? {} // Admin can see all tickets
      : { user: decoded.id }; // Users can only see their tickets

    // Get ticket stats
    const [
      total,
      open,
      inProgress,
      resolved,
      urgent
    ] = await Promise.all([
      Ticket.countDocuments(baseQuery),
      Ticket.countDocuments({ ...baseQuery, status: 'open' }),
      Ticket.countDocuments({ ...baseQuery, status: 'in-progress' }),
      Ticket.countDocuments({ ...baseQuery, status: 'resolved' }),
      Ticket.countDocuments({ ...baseQuery, priority: 'urgent' })
    ]);

    return NextResponse.json({
      total,
      open,
      inProgress,
      resolved,
      urgent
    });
  } catch (error: any) {
    console.error('Ticket stats error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch ticket statistics' },
      { status: 500 }
    );
  }
} 