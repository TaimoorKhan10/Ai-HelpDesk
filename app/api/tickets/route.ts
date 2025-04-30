import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
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

    // Get request body
    const { title, description, category, priority } = await request.json();

    // Validate input
    if (!title || !description || !category) {
      return NextResponse.json(
        { message: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      status: 'open',
      user: decoded.id,
      messages: [
        {
          content: description,
          sender: decoded.id,
          isAI: false,
        }
      ]
    });

    // Return the created ticket
    return NextResponse.json({
      ticket: {
        _id: ticket._id,
        title: ticket.title,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        createdAt: ticket.createdAt,
      }
    });
  } catch (error: any) {
    console.error('Create ticket error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to create ticket' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

    // Parse URL and get search params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    
    // Build query
    const query: any = {};
    
    // For regular users, only show their tickets
    if (decoded.role !== 'admin') {
      query.user = decoded.id;
    }
    
    // Add filters if provided
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    // Find tickets
    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean();

    return NextResponse.json({ tickets });
  } catch (error: any) {
    console.error('Get tickets error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
} 