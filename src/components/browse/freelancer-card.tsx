'use client';

import { Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { type Expert } from '@/types/browse';
import { cn } from '@/lib/utils';

interface FreelancerCardProps {
  freelancer: Expert;
  onClick?: (freelancer: Expert) => void;
  className?: string;
}

export function FreelancerCard({ freelancer, onClick, className }: FreelancerCardProps) {
  return (
    <Card
      className={cn(
        'hover:shadow-md transition-shadow cursor-pointer',
        className
      )}
      onClick={() => onClick?.(freelancer)}
    >
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-start gap-4 flex-1">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarFallback>{freelancer.avatar}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-medium text-lg">{freelancer.name}</h3>
                {freelancer.verified && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>

              <p className="text-muted-foreground mb-2">{freelancer.title}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{freelancer.rating}</span>
                  <span>({freelancer.reviews} reviews)</span>
                </div>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {freelancer.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  {freelancer.completedProjects} projects
                </span>
              </div>

              <p className="text-muted-foreground mb-3 text-sm line-clamp-2">
                {freelancer.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {freelancer.skills.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {freelancer.skills.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{freelancer.skills.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:min-w-[140px]">
            <div className="text-center sm:text-right">
              <p className="font-medium text-lg text-primary">{freelancer.hourlyRate}</p>
              <p className="text-sm text-muted-foreground">per hour</p>
            </div>

            <div className="flex items-center gap-2">
              {freelancer.topRated && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs whitespace-nowrap">
                  Top Rated
                </Badge>
              )}
              <Badge
                className={cn(
                  'text-xs',
                  freelancer.available
                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {freelancer.available ? 'Available' : 'Busy'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
