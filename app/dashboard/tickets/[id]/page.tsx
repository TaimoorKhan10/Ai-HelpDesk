'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

type Message = {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  } | null;
  isAI: boolean;
  createdAt: string;
};

type Ticket = {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
  };
  messages: Message[];
  createdAt: string;
  updatedAt: string;
};

export default function TicketDetail({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch ticket details');
        }
        const data = await res.json();
        setTicket(data.ticket);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Could not load ticket details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicket();
  }, [params.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSending(true);

    try {
      const res = await fetch(`/api/tickets/${params.id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      setTicket(data.ticket);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-700">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h3 className="text-lg font-medium text-yellow-800">Ticket Not Found</h3>
        <p className="mt-2 text-sm text-yellow-700">
          The ticket you're looking for could not be found.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
            {ticket.title}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-1.5">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-1.5">Priority:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-1.5">Category:</span>
              <span>{ticket.category}</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-1.5">Created:</span>
              <span>{new Date(ticket.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Ticket Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Submitted by {ticket.user.name} ({ticket.user.email})
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none text-gray-900">
            {ticket.description}
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Conversation</h3>
          </div>
          <div className="px-4 py-3 sm:px-6 space-y-4 max-h-96 overflow-y-auto">
            {ticket.messages.map((msg) => (
              <div key={msg._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {msg.isAI ? 'AI Assistant' : (msg.sender ? msg.sender.name : 'Unknown')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleSendMessage}>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSending}
                  required
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={isSending || !message.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="mr-2 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUpIcon className="mr-2 h-4 w-4" />
                  )}
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 