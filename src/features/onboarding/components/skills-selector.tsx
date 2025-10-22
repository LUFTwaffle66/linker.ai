'use client';

import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface SkillsSelectorProps {
  availableSkills: string[];
  selectedSkills: string[];
  onSkillsChange: (skills: string[]) => void;
  maxSkills?: number;
}

export function SkillsSelector({
  availableSkills,
  selectedSkills,
  onSkillsChange,
  maxSkills = 15,
}: SkillsSelectorProps) {
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < maxSkills) {
        onSkillsChange([...selectedSkills, skill]);
      } else {
        toast.error(`You can select up to ${maxSkills} skills`);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Selected Skills Display */}
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
        <p className="text-sm font-medium mb-2">
          {selectedSkills.length} of {maxSkills} skills selected
        </p>
        {selectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <Badge
                key={skill}
                variant="default"
                className="cursor-pointer"
                onClick={() => toggleSkill(skill)}
              >
                {skill} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Available Skills */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Available Skills</h4>
        <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
          {availableSkills.map(skill => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
              onClick={() => toggleSkill(skill)}
            >
              {selectedSkills.includes(skill) && (
                <CheckCircle2 className="w-3 h-3 mr-1" />
              )}
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
