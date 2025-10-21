'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrowseFiltersProps {
  activeTab: string;
}

export function BrowseFilters({ activeTab }: BrowseFiltersProps) {
  const [budgetRange, setBudgetRange] = useState([5000, 50000]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <Label className="font-medium">Service Category</Label>
          <Select>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ai-chatbots">AI Chatbots</SelectItem>
              <SelectItem value="workflow-automation">Workflow Automation</SelectItem>
              <SelectItem value="machine-learning">Machine Learning</SelectItem>
              <SelectItem value="data-analysis">Data Analysis</SelectItem>
              <SelectItem value="api-integration">API Integration</SelectItem>
              <SelectItem value="process-automation">Process Automation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div>
          <Label className="font-medium">Budget Range</Label>
          <div className="mt-3">
            <Slider
              value={budgetRange}
              onValueChange={setBudgetRange}
              max={100000}
              min={1000}
              step={1000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${(budgetRange[0] as any).toLocaleString()}</span>
              <span>${((budgetRange[1] ?? 0) as any).toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <Label className="font-medium">Location</Label>
          <Select>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote Only</SelectItem>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="sf">San Francisco Bay Area</SelectItem>
              <SelectItem value="ny">New York Area</SelectItem>
              <SelectItem value="austin">Austin Area</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div>
          <Label className="font-medium">Technologies & Skills</Label>
          <div className="mt-3 space-y-2">
            {['Python', 'GPT-4/OpenAI', 'TensorFlow', 'UiPath', 'Machine Learning'].map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox id={skill} />
                <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                  {skill}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {activeTab === 'freelancers' && (
          <>
            {/* Rating Filter */}
            <div>
              <Label className="font-medium">Rating</Label>
              <div className="mt-3 space-y-2">
                {[5, 4, 3].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox id={`rating-${rating}`} />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center space-x-1 text-sm font-normal cursor-pointer"
                    >
                      <span>{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>& up</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div>
              <Label className="font-medium">Verification</Label>
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="available" />
                  <Label htmlFor="available" className="text-sm font-normal cursor-pointer">
                    Available now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="certified" />
                  <Label htmlFor="certified" className="text-sm font-normal cursor-pointer">
                    Certified
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" />
                  <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
                    Verified
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="top-rated" />
                  <Label htmlFor="top-rated" className="text-sm font-normal cursor-pointer">
                    Top Rated
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
