'use client';

import { useState } from 'react';
import { Plus, X, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface PortfolioItem {
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
  url?: string;
}

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  onPortfolioChange: (portfolio: PortfolioItem[]) => void;
  availableTags?: string[];
}

const DEFAULT_TAGS = [
  'Python',
  'TensorFlow',
  'OpenAI API',
  'React',
  'Docker',
  'AWS',
  'Node.js',
  'PyTorch',
  'LangChain',
];

export function PortfolioManager({
  portfolio,
  onPortfolioChange,
  availableTags = DEFAULT_TAGS,
}: PortfolioManagerProps) {
  const [currentItem, setCurrentItem] = useState<PortfolioItem>({
    title: '',
    description: '',
    tags: [],
    imageUrl: '',
    url: '',
  });

  const toggleTag = (tag: string) => {
    const currentTags = currentItem.tags;
    if (currentTags.includes(tag)) {
      setCurrentItem({
        ...currentItem,
        tags: currentTags.filter(t => t !== tag),
      });
    } else {
      if (currentTags.length < 6) {
        setCurrentItem({
          ...currentItem,
          tags: [...currentTags, tag],
        });
      } else {
        toast.error('You can select up to 6 tags per project');
      }
    }
  };

  const addPortfolioItem = () => {
    if (!currentItem.title || !currentItem.description) {
      toast.error('Please provide at least a title and description');
      return;
    }

    if (currentItem.tags.length === 0) {
      toast.error('Please select at least one technology tag');
      return;
    }

    onPortfolioChange([...portfolio, currentItem]);

    // Reset current item
    setCurrentItem({
      title: '',
      description: '',
      tags: [],
      imageUrl: '',
      url: '',
    });

    toast.success('Portfolio item added!');
  };

  const removePortfolioItem = (index: number) => {
    onPortfolioChange(portfolio.filter((_, i) => i !== index));
    toast.success('Portfolio item removed');
  };

  return (
    <div className="space-y-6">
      {/* Display added portfolio items */}
      {portfolio.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Added Portfolio Items ({portfolio.length})
          </h3>
          {portfolio.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {item.url && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-xs">{item.url}</span>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removePortfolioItem(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new portfolio item form */}
      <div className="border-2 border-dashed rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            {portfolio.length === 0
              ? 'Add Your First Portfolio Item'
              : 'Add Another Portfolio Item'}
          </h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Title *
            </label>
            <Input
              placeholder="e.g., AI Chatbot for Customer Support"
              value={currentItem.title}
              onChange={e =>
                setCurrentItem({
                  ...currentItem,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Project Description *
            </label>
            <Textarea
              placeholder="Describe the project, technologies used, and results achieved..."
              rows={3}
              className="resize-none"
              value={currentItem.description}
              onChange={e =>
                setCurrentItem({
                  ...currentItem,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Project URL (optional)
            </label>
            <Input
              placeholder="https://your-project-demo.com"
              value={currentItem.url}
              onChange={e =>
                setCurrentItem({
                  ...currentItem,
                  url: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Technologies Used *
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={currentItem.tags.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {currentItem.tags.includes(tag) && (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  )}
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="button"
            onClick={addPortfolioItem}
            className="w-full"
            variant={portfolio.length > 0 ? 'outline' : 'default'}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Portfolio Item
          </Button>
        </div>
      </div>

      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          {portfolio.length === 0
            ? 'You can skip this step and add portfolio items later from your profile settings.'
            : 'You can add more portfolio items later from your profile settings.'}
        </p>
      </div>
    </div>
  );
}
