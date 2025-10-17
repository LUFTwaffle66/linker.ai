'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import {
  Sparkles, User, Award, Briefcase, DollarSign, CheckCircle2,
  ChevronLeft, ChevronRight, Upload, MapPin, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { paths } from '@/config/paths';

interface FreelancerOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function FreelancerOnboarding({ onComplete, onSkip }: FreelancerOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form state
  const [profileImage, setProfileImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioDescription, setPortfolioDescription] = useState('');
  const [portfolioTags, setPortfolioTags] = useState<string[]>([]);

  const aiSkills = [
    'Python', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
    'OpenAI API', 'GPT-4', 'ChatGPT', 'Claude API',
    'Natural Language Processing', 'Computer Vision', 'Machine Learning',
    'Deep Learning', 'Neural Networks', 'LangChain',
    'UiPath', 'Automation Anywhere', 'Blue Prism', 'Power Automate',
    'API Integration', 'Data Analysis', 'SQL', 'MongoDB',
    'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
    'React', 'Node.js', 'FastAPI', 'Django', 'Flask'
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 15) {
        setSelectedSkills([...selectedSkills, skill]);
      } else {
        toast.error('You can select up to 15 skills');
      }
    }
  };

  const togglePortfolioTag = (tag: string) => {
    if (portfolioTags.includes(tag)) {
      setPortfolioTags(portfolioTags.filter(t => t !== tag));
    } else {
      if (portfolioTags.length < 6) {
        setPortfolioTags([...portfolioTags, tag]);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    toast.success('Profile created successfully! Welcome to LinkerAI');
    if (onComplete) {
      onComplete();
    } else {
      router.push(paths.app.dashboard.getHref());
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      router.push(paths.app.dashboard.getHref());
    }
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h1 className="text-primary">Welcome to LinkerAI</h1>
          </div>
          <p className="text-muted-foreground">
            Let's set up your AI Expert profile in just a few steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[
            { num: 1, label: 'Profile', icon: User },
            { num: 2, label: 'Expertise', icon: Award },
            { num: 3, label: 'Skills', icon: Sparkles },
            { num: 4, label: 'Portfolio', icon: Briefcase },
            { num: 5, label: 'Rate', icon: DollarSign }
          ].map((step, index) => (
            <div key={step.num} className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                ${currentStep > step.num ? 'bg-primary text-primary-foreground' :
                  currentStep === step.num ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                  'bg-muted text-muted-foreground'}
              `}>
                {currentStep > step.num ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs hidden sm:block ${
                currentStep >= step.num ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
              {index < 4 && (
                <div className={`hidden lg:block absolute w-20 h-0.5 -mt-5 ml-32 ${
                  currentStep > step.num ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            {/* Step 1: Basic Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Create Your Profile</h2>
                  <p className="text-muted-foreground">
                    Tell us about yourself and help clients find you
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Senior AI Engineer, ML Specialist, Automation Expert"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, Country"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Professional Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Your Expertise</h2>
                  <p className="text-muted-foreground">
                    Share your experience and what you do best
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Describe your AI/automation expertise, experience, and what makes you unique..."
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {bio.length}/1000 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="experience"
                        type="number"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        placeholder="5"
                        className="pl-10"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Pro Tips
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Highlight your AI/automation specializations</li>
                      <li>• Mention key projects and their impact</li>
                      <li>• Include relevant certifications</li>
                      <li>• Show your passion for AI technology</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Skills */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Your AI Skills</h2>
                  <p className="text-muted-foreground">
                    Select up to 15 skills that match your expertise
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2">
                    {selectedSkills.length} of 15 skills selected
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

                <div>
                  <h4 className="mb-3">Available Skills</h4>
                  <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1">
                    {aiSkills.map(skill => (
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

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Choose skills that best represent your expertise. These will help clients find you for relevant projects.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Portfolio */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Showcase Your Work</h2>
                  <p className="text-muted-foreground">
                    Add a portfolio item to demonstrate your expertise (optional)
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="mb-2">Upload Project Image</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      PNG, JPG up to 10MB
                    </p>
                    <Button variant="outline">Choose File</Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioTitle">Project Title</Label>
                    <Input
                      id="portfolioTitle"
                      value={portfolioTitle}
                      onChange={(e) => setPortfolioTitle(e.target.value)}
                      placeholder="e.g., AI Chatbot for Customer Support"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioDescription">Project Description</Label>
                    <Textarea
                      id="portfolioDescription"
                      value={portfolioDescription}
                      onChange={(e) => setPortfolioDescription(e.target.value)}
                      placeholder="Describe the project, technologies used, and results achieved..."
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2">
                      {['Python', 'TensorFlow', 'OpenAI API', 'React', 'Docker', 'AWS'].map(tag => (
                        <Badge
                          key={tag}
                          variant={portfolioTags.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => togglePortfolioTag(tag)}
                        >
                          {portfolioTags.includes(tag) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You can skip this step and add portfolio items later from your profile settings.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Rate */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Set Your Rate</h2>
                  <p className="text-muted-foreground">
                    Define your hourly rate to help clients understand your pricing
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (USD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="75"
                        className="pl-10"
                        min="5"
                        max="500"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Service fee will be deducted from your earnings
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border border-primary/20">
                    <h4 className="mb-4">Rate Guidelines</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Entry Level</p>
                        <p className="text-2xl font-semibold text-primary mb-1">$25-50</p>
                        <p className="text-muted-foreground">0-2 years experience</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Intermediate</p>
                        <p className="text-2xl font-semibold text-primary mb-1">$50-100</p>
                        <p className="text-muted-foreground">2-5 years experience</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Expert</p>
                        <p className="text-2xl font-semibold text-primary mb-1">$100+</p>
                        <p className="text-muted-foreground">5+ years experience</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <h4 className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      Pricing Tips
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Research market rates for your skill level</li>
                      <li>• Consider your experience and certifications</li>
                      <li>• Factor in the complexity of AI/ML projects</li>
                      <li>• You can adjust your rate anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip for now
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="gap-2">
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Complete Setup
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
