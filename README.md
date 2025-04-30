# AI-Powered Automated Helpdesk

A cloud-based helpdesk system that uses AI to automatically respond to user queries. The application features a modern UI, MongoDB database for storing conversations and user data, and OpenAI integration for natural language processing.

## Features

- AI-powered automated responses to user queries
- User authentication and account management
- Admin dashboard for monitoring and managing conversations
- Knowledge base management
- Real-time chat interface
- Ticket management system

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, Headless UI
- **Backend**: Next.js API routes
- **Database**: MongoDB
- **AI**: OpenAI API
- **Authentication**: NextAuth.js

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in `.env.local`
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The following environment variables need to be set:

```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_auth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Deployment

This application is designed to be deployed to cloud platforms such as Vercel, AWS, or Azure. 