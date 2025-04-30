'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/quick-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error getting response:', error);
      setResponse('Sorry, I encountered an error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 py-12 md:py-24 lg:px-8">
      <div className="z-10 w-full max-w-5xl flex flex-col items-center justify-center text-center">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI-Powered Help Desk
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Get instant answers to your questions using our advanced AI assistant.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link 
              href="/register" 
              className="rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              Register
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Login <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg mt-8">
          <h2 className="text-2xl font-bold mb-4">Have a quick question?</h2>
          <p className="text-gray-600 mb-6">
            Ask our AI assistant without logging in.
          </p>
          
          <form onSubmit={handleQuickQuestion} className="w-full">
            <div className="flex items-start gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can I help you today?"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                ) : (
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Thinking...' : 'Send'}
              </button>
            </div>
          </form>
          
          {response && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">AI Assistant:</h3>
              <p className="text-gray-800 whitespace-pre-line">{response}</p>
            </div>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
            <p className="text-gray-600">
              Our AI assistant is available around the clock to provide immediate assistance.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Responses</h3>
            <p className="text-gray-600">
              Powered by advanced AI to understand your questions and provide accurate answers.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Human Backup</h3>
            <p className="text-gray-600">
              Complex issues are escalated to human agents for personalized support.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 