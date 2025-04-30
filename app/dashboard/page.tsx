'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TicketIcon, 
  ChatBubbleLeftRightIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

type TicketStats = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  urgent: number;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [ticketStats, setTicketStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    urgent: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsRes = await fetch('/api/tickets/stats');
        const recentRes = await fetch('/api/tickets/recent');
        
        if (statsRes.ok && recentRes.ok) {
          const statsData = await statsRes.json();
          const recentData = await recentRes.json();
          
          setTicketStats(statsData);
          setRecentTickets(recentData.tickets);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-700">
        Welcome back, {user?.name || 'User'}
      </p>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TicketIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? '...' : ticketStats.total}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/tickets"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Open Tickets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? '...' : ticketStats.open}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/tickets?status=open"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? '...' : ticketStats.inProgress}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/tickets?status=in-progress"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {isLoading ? '...' : ticketStats.resolved}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/tickets?status=resolved"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View all
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <h2 className="mt-8 text-lg font-medium text-gray-900">Recent Tickets</h2>
      <div className="mt-2 bg-white shadow overflow-hidden rounded-md">
        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Loading recent tickets...</div>
        ) : recentTickets.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {recentTickets.map((ticket: any) => (
              <li key={ticket._id}>
                <Link href={`/dashboard/tickets/${ticket._id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">{ticket.title}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                            ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {ticket.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {ticket.category}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6 text-center text-gray-500">No recent tickets found.</div>
        )}
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <div className="flex items-center">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="p-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Ticket</h3>
              <p className="mt-1 text-sm text-gray-500">
                Submit a new support ticket for any issues you're experiencing.
              </p>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <Link
                href="/dashboard/tickets/new"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Create Ticket
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="p-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Knowledge Base</h3>
              <p className="mt-1 text-sm text-gray-500">
                Browse our knowledge base for answers to common questions.
              </p>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <Link
                href="/dashboard/knowledge"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Browse Articles
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div className="p-5">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Live Chat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start a real-time conversation with our AI assistant.
              </p>
            </div>
            <div className="px-5 py-3 bg-gray-50">
              <Link
                href="/dashboard/chats/new"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Start Chat
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 