'use client';

import { Bell, Rocket, Briefcase, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock notifications data
const notifications = [
  {
    id: 1,
    icon: <Rocket className="w-5 h-5" />,
    title: 'New project matching your skills: Build a custom GPT-4 chatbot for customer support.',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Sarah Chen hired you for the position "ML Model Training".',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Congrats! You received an offer from TechCorp for AI Automation Project. Respond by Oct 13, 2025.',
    time: '1 day ago',
  },
];

const unreadNotifications = 3;

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Notifications</span>
            {unreadNotifications > 0 && (
              <Badge variant="secondary" className="ml-2">
                {unreadNotifications} new
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="p-4 cursor-pointer focus:bg-accent">
              <div className="flex gap-3 w-full">
                <div className="flex-shrink-0 text-primary mt-0.5">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm mb-1 leading-relaxed">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-primary cursor-pointer">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
