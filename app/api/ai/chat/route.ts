import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import KnowledgeBase from '@/models/KnowledgeBase';
import { getAIResponse } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { message, messages } = await request.json();

    if (!message || !messages) {
      return NextResponse.json(
        { message: 'Please provide message and conversation history' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Search knowledge base for relevant articles
    const relevantArticles = await KnowledgeBase.find({
      $text: { $search: message }
    }).limit(3);

    // Extract content from relevant articles
    const knowledgeBase = relevantArticles.map(article => 
      `${article.title}:\n${article.content}`
    );

    // Get AI response with knowledge context and conversation history
    const aiResult = await getAIResponse(
      message,
      messages,
      knowledgeBase
    );

    return NextResponse.json({ response: aiResult.content });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { 
        response: 'I apologize, but I encountered an error while processing your request. Please try again later.' 
      },
      { status: 500 }
    );
  }
} 