import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || 'default_secret'
    ) as { id: string };

    // Connect to database
    await connectToDatabase();

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ user: null });
    }

    // Return user
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
} 