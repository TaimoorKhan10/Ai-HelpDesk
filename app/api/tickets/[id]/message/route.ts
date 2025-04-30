import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Ticket from '@/models/Ticket';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getAIResponse } from '@/lib/openai';
import KnowledgeBase from '@/models/KnowledgeBase';

export async function POST(
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
    const ticket = await Ticket.findById(params.id);

    if (!ticket) {
      return NextResponse.json(
        { message: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this ticket
    if (decoded.role !== 'admin' && ticket.user.toString() !== decoded.id) {
      return NextResponse.json(
        { message: 'You are not authorized to update this ticket' },
        { status: 403 }
      );
    }

    // Get request body
    const { content } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Message content is required' },
        { status: 400 }
      );
    }

    // Add user message to ticket
    const userMessage = {
      content,
      sender: decoded.id,
      isAI: false,
      createdAt: new Date(),
    };

    ticket.messages.push(userMessage);
    
    // Update ticket status to in-progress if it was open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    await ticket.save();

    // Generate AI response based on the context of the ticket and user's message
    try {
      // Search knowledge base for relevant articles
      const relevantArticles = await KnowledgeBase.find({
        $text: { $search: content }
      }).limit(3);

      // Extract content from relevant articles
      const knowledgeBase = relevantArticles.map(article => 
        `${article.title}:\n${article.content}`
      );

      // Convert previous messages to format expected by OpenAI
      const messageHistory = ticket.messages.map(msg => ({
        role: msg.isAI ? 'assistant' : 'user',
        content: msg.content,
      }));

      // Remove the most recent message (the user message we just added)
      messageHistory.pop();

      // Add ticket context
      const ticketContext = `Ticket Title: ${ticket.title}\nDescription: ${ticket.description}\nCategory: ${ticket.category}\nPriority: ${ticket.priority}\nStatus: ${ticket.status}`;
      
      // Get AI response
      const aiResult = await getAIResponse(
        content,
        [
          { role: 'system', content: `You are a helpful support assistant. You are responding to a support ticket with the following context:\n${ticketContext}` },
          ...messageHistory,
          { role: 'user', content }
        ],
        knowledgeBase
      );

      // Add AI message to ticket
      const aiMessage = {
        content: aiResult.content,
        isAI: true,
        createdAt: new Date(),
      };

      ticket.messages.push(aiMessage);
      await ticket.save();
    } catch (error) {
      console.error('AI response error:', error);
      // We continue even if AI response fails
    }

    // Return updated ticket
    const updatedTicket = await Ticket.findById(params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .populate('messages.sender', 'name');

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error: any) {
    console.error('Add message error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to add message' },
      { status: 500 }
    );
  }
} 