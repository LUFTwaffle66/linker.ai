'use client';

import { DollarSign, Clock, Calendar, Star, CheckCircle, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Project } from '@/types/browse';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  onSave?: (project: Project) => void;
  className?: string;
}

export function ProjectCard({ project, onClick, onSave, className }: ProjectCardProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave?.(project);
  };

  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={() => onClick?.(project)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-lg">{project.title}</h3>
          <Heart
            className="w-5 h-5 text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
            onClick={handleSaveClick}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
          <Badge variant="outline">{project.category}</Badge>
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {project.budget}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {project.timeline}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {project.postedDate}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {project.client.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{project.client.name}</span>
              {project.client.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{project.client.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {project.client.spent} spent
            </span>
          </div>

          <span className="text-sm text-muted-foreground">
            {project.proposals} proposals
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
