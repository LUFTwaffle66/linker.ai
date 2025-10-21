'use client';

import { useState } from 'react';
import {
  Globe, DollarSign, Clock, User, FileText, CheckCircle, Star, MapPin
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Project } from '@/types/browse';
import { AuthRequiredDialog } from './auth-required-dialog';

interface ProjectDetailSheetProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitProposal?: (project: Project) => void;
  isAuthenticated?: boolean;
}

export function ProjectDetailSheet({
  project,
  open,
  onOpenChange,
  onSubmitProposal,
  isAuthenticated = false
}: ProjectDetailSheetProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  if (!project) return null;

  const handleSubmitProposal = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    onSubmitProposal?.(project);
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <SheetTitle className="text-2xl mb-2">{project.title}</SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-sm">
                  <span>Posted {project.postedDate}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {project.location || 'Worldwide'}
                  </span>
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 py-6">
            <div className="space-y-6">
              {/* Summary */}
              <div>
                <h3 className="font-medium mb-3">Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {project.fullDescription || project.description}
                </p>
              </div>

              <Separator />

              {/* Deliverables */}
              {project.deliverables && (
                <>
                  <div>
                    <h3 className="font-medium mb-3">Deliverables</h3>
                    <ul className="space-y-2">
                      {project.deliverables.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                </>
              )}

              {/* Project Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.budget}</p>
                  <p className="text-xs text-muted-foreground mt-1">Fixed price</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Duration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.timeline}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Experience Level</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.experienceLevel || 'Intermediate'}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Project Type</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.projectType || 'One-time project'}</p>
                </div>
              </div>

              <Separator />

              {/* Skills and Expertise */}
              <div>
                <h3 className="font-medium mb-3">Skills and Expertise</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Mandatory skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} className="bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {project.skills.length > 2 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Nice-to-have skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.skills.slice(2).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* About the client */}
              <div>
                <h3 className="font-medium mb-3">About the client</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {project.client.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{project.client.name}</p>
                        {project.client.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{project.client.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Payment verified</p>
                      <div className="flex items-center gap-1 text-green-500 mt-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Yes</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total spent</p>
                      <p className="font-medium mt-1">{project.client.spent}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-muted-foreground mb-1">Location</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity */}
              <div>
                <h3 className="font-medium mb-3">Activity on this job</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Proposals</span>
                    <span className="font-medium">{project.proposals}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Last viewed by client</span>
                    <span className="font-medium">5 minutes ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Interviewing</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Invites sent</span>
                    <span className="font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t bg-background">
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmitProposal}
            >
              Submit Proposal
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Send a proposal for {project.connects || 7} Connects
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>

      {/* Auth Required Dialog */}
      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="proposal"
      />
    </>
  );
}
