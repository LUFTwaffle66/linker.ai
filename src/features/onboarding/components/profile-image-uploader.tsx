'use client';

import { User, Upload } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ProfileImageUploaderProps {
  imageUrl?: string;
  onImageChange?: (url: string) => void;
}

export function ProfileImageUploader({ imageUrl, onImageChange }: ProfileImageUploaderProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={imageUrl} />
        <AvatarFallback className="bg-primary/10 text-primary">
          <User className="w-10 h-10" />
        </AvatarFallback>
      </Avatar>
      <Button variant="outline" size="sm" className="gap-2">
        <Upload className="w-4 h-4" />
        Upload Photo
      </Button>
    </div>
  );
}
