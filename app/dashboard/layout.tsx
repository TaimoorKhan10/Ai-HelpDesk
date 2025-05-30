'use client';

import { Fragment, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tickets', href: '/dashboard/tickets', icon: TicketIcon },
  { name: 'Chats', href: '/dashboard/chats', icon: ChatBubbleLeftRightIcon },
  { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: DocumentTextIcon },
];

const adminNavigation = [
  { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="text-xl font-bold text-primary-600">AI Helpdesk</h1>
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          group flex items-center px-2 py-2 text-base font-medium rounded-md
                          ${pathname === item.href
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                      >
                        <item.icon
                          className={`
                            mr-4 h-6 w-6 flex-shrink-0
                            ${pathname === item.href
                              ? 'text-primary-600'
                              : 'text-gray-400 group-hover:text-gray-500'}
                          `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                    
                    {user?.role === 'admin' && (
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <h3 className="px-3 text-sm font-medium text-gray-500">Admin</h3>
                        <div className="mt-2">
                          {adminNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`
                                group flex items-center px-2 py-2 text-base font-medium rounded-md
                                ${pathname === item.href
                                  ? 'bg-primary-100 text-primary-900'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                              `}
                            >
                              <item.icon
                                className={`
                                  mr-4 h-6 w-6 flex-shrink-0
                                  ${pathname === item.href
                                    ? 'text-primary-600'
                                    : 'text-gray-400 group-hover:text-gray-500'}
                                `}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </nav>
                </div>
                <div className="border-t border-gray-200 p-4">
                  <button
                    type="button"
                    className="text-gray-600 hover:text-gray-900 w-full text-left py-2"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5">
          <div className="flex flex-shrink-0 items-center px-4">
            <h1 className="text-xl font-bold text-primary-600">AI Helpdesk</h1>
          </div>
          <div className="mt-5 flex flex-1 flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${pathname === item.href
                      ? 'bg-primary-100 text-primary-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${pathname === item.href
                        ? 'text-primary-600'
                        : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
              
              {user?.role === 'admin' && (
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <h3 className="px-3 text-xs font-medium uppercase tracking-wider text-gray-500">Admin</h3>
                  <div className="mt-2">
                    {adminNavigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          group flex items-center px-2 py-2 text-sm font-medium rounded-md
                          ${pathname === item.href
                            ? 'bg-primary-100 text-primary-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                      >
                        <item.icon
                          className={`
                            mr-3 h-5 w-5 flex-shrink-0
                            ${pathname === item.href
                              ? 'text-primary-600'
                              : 'text-gray-400 group-hover:text-gray-500'}
                          `}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900 w-full text-left py-2 text-sm"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1"></div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 mr-2">
                    {user?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 