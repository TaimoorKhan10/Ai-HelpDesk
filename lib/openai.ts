import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  content: string;
  relevantKnowledge?: string;
}

export async function getAIResponse(
  query: string,
  conversationHistory: { role: 'user' | 'assistant' | 'system'; content: string }[],
  knowledgeBase?: string[]
): Promise<AIResponse> {
  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful support assistant. Provide clear, concise, and accurate responses to customer inquiries.',
      },
      ...conversationHistory,
      { role: 'user', content: query },
    ];

    // Add knowledge base context if available
    if (knowledgeBase && knowledgeBase.length > 0) {
      messages.splice(1, 0, {
        role: 'system',
        content: `Here is some relevant information that might help you respond:\n${knowledgeBase.join('\n\n')}`,
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      content: response.choices[0].message.content || 'I could not generate a response.',
      relevantKnowledge: knowledgeBase ? knowledgeBase.join('\n\n') : undefined,
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    return {
      content: 'Sorry, I encountered an error while processing your request. Please try again later.',
    };
  }
} 