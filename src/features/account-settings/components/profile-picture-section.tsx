'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useUploadProfilePicture, useRemoveProfilePicture } from '../hooks';
import { toast } from 'sonner';
import type { UserProfile } from '../types';

interface ProfilePictureSectionProps {
  profile: UserProfile;
}

export function ProfilePictureSection({ profile }: ProfilePictureSectionProps) {
  const uploadPicture = useUploadProfilePicture();
  const removePicture = useRemoveProfilePicture();

  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast.error('Only JPG, PNG, and GIF files are allowed');
      return;
    }

    uploadPicture.mutate(file, {
      onSuccess: () => {
        toast.success('Profile picture updated successfully!');
      },
      onError: () => {
        toast.error('Failed to upload profile picture');
      },
    });
  };

  const handleRemove = () => {
    removePicture.mutate(undefined, {
      onSuccess: () => {
        toast.success('Profile picture removed successfully!');
      },
      onError: () => {
        toast.error('Failed to remove profile picture');
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Update your profile photo to help clients recognize you</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => document.getElementById('profile-picture-input')?.click()}
                disabled={uploadPicture.isPending}
              >
                <Camera className="w-4 h-4" />
                {uploadPicture.isPending ? 'Uploading...' : 'Upload Photo'}
              </Button>
              <input
                id="profile-picture-input"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleFileSelect}
              />
              {profile.avatar && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={handleRemove}
                  disabled={removePicture.isPending}
                >
                  {removePicture.isPending ? 'Removing...' : 'Remove'}
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
