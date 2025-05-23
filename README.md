# AI-Powered Automated Helpdesk System

A cloud-based helpdesk system with AI capabilities built on Next.js, MongoDB, and OpenAI integration.

## Features

- **Authentication System**: Secure login/register with role-based access control
- **Ticket Management**: Create, view, update, and close support tickets
- **AI Chat Integration**: Get instant responses using OpenAI's API
- **Knowledge Base**: Access and search through support articles
- **Responsive Design**: Modern UI with Tailwind CSS



### Login Screen
*Secure authentication with email and password*

### Dashboard
*Overview of tickets, knowledge base articles, and system status*

### Ticket Management
*Create, view, and manage support tickets efficiently*

### AI Chat Interface
*Get instant AI-powered responses to customer queries*

### Knowledge Base
*Search and browse through help articles and documentation*

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/TaimoorKhan10/ai-helpdesk.git
   cd ai-helpdesk
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory
   ```
   MONGODB_URI=mongodb://localhost:27017/helpdesk
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-for-next-auth
   OPENAI_API_KEY=your-openai-api-key
   ```

4. Initialize the database with sample data
   ```
   node scripts/init-db.js
   ```

5. Start the development server
   ```
   npm run dev
   ```

6. Access the application at http://localhost:3000

### Default Login Credentials

- **Admin User**:
  - Email: admin@example.com
  - Password: password123

- **Regular User**:
  - Email: user@example.com
  - Password: password123

## Project Structure

```
ai-helpdesk/
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── tickets/      # Ticket management
│   │   └── ai/           # AI integration
│   ├── dashboard/        # Dashboard pages
│   ├── login/            # Login page
│   └── register/         # Registration page
├── components/           # React components
├── lib/                  # Utility libraries
├── models/               # Mongoose models
├── public/               # Static assets
└── scripts/              # Setup and utility scripts
```

## Deployment

This application can be deployed to various cloud platforms:

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### AWS
Configure your AWS credentials and deploy using AWS Amplify or Elastic Beanstalk.

### Azure
Deploy using Azure App Service or Azure Static Web Apps.

## License

[MIT](LICENSE)

## Acknowledgments

- OpenAI for providing the AI capabilities
- Next.js team for the amazing framework
- MongoDB for the flexible database solution 
