import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Star, VolumeX, Volume2, AlertTriangle, Trash2, Ban } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { User, Conversation } from '../types';
import { useUpdateConversationSettings, useDeleteConversation } from '../hooks';

interface ChatHeaderProps {
  otherParticipant: User;
  conversation: Conversation;
  onConversationDeleted: () => void;
}

export function ChatHeader({ otherParticipant, conversation, onConversationDeleted }: ChatHeaderProps) {
  const updateSettings = useUpdateConversationSettings();
  const deleteConversation = useDeleteConversation();

  const initials = otherParticipant.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleToggleStar = () => {
    updateSettings.mutate({
      conversationId: conversation.id,
      settings: { isStarred: !conversation.isStarred },
    });
  };

  const handleToggleMute = () => {
    updateSettings.mutate({
      conversationId: conversation.id,
      settings: { isMuted: !conversation.isMuted },
    });
  };

  const handleBlock = () => {
    updateSettings.mutate({
      conversationId: conversation.id,
      settings: { isBlocked: true },
    });
  };

  const handleDelete = () => {
    deleteConversation.mutate(conversation.id, {
      onSuccess: () => {
        onConversationDeleted();
      },
    });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          {otherParticipant.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
          )}
        </div>

        <div>
          <h3 className="font-semibold">{otherParticipant.name}</h3>
          <p className="text-sm text-muted-foreground">
            {otherParticipant.isOnline
              ? 'Online'
              : otherParticipant.lastSeen
              ? `Last seen ${formatDistanceToNow(new Date(otherParticipant.lastSeen), {
                  addSuffix: true,
                })}`
              : 'Offline'}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleToggleStar}>
            <Star
              className={`w-4 h-4 mr-2 ${
                conversation.isStarred ? 'fill-yellow-400 text-yellow-400' : ''
              }`}
            />
            {conversation.isStarred ? 'Unstar' : 'Star'} Conversation
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleMute}>
            {conversation.isMuted ? (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Unmute
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                Mute
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-orange-600">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleBlock} className="text-orange-600">
            <Ban className="w-4 h-4 mr-2" />
            Block User
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
