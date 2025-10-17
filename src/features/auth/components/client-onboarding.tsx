'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import {
  Sparkles, User, Building2, Target, DollarSign, CheckCircle2,
  ChevronLeft, ChevronRight, Upload, Globe, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { paths } from '@/config/paths';

interface ClientOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

export function ClientOnboarding({ onComplete, onSkip }: ClientOnboardingProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [profileImage, setProfileImage] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [aboutCompany, setAboutCompany] = useState('');
  const [projectGoals, setProjectGoals] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState('');
  const [timeline, setTimeline] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const aiProjectGoals = [
    'Build AI Chatbot',
    'Automate Workflows',
    'Data Analysis & Insights',
    'Machine Learning Models',
    'Process Automation',
    'API Integration',
    'Computer Vision',
    'Natural Language Processing',
    'Predictive Analytics',
    'Custom AI Solutions'
  ];

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education',
    'Manufacturing', 'Retail', 'Real Estate', 'Marketing', 'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const toggleProjectGoal = (goal: string) => {
    if (projectGoals.includes(goal)) {
      setProjectGoals(projectGoals.filter(g => g !== goal));
    } else {
      if (projectGoals.length < 5) {
        setProjectGoals([...projectGoals, goal]);
      } else {
        toast.error('You can select up to 5 project goals');
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
            Let's set up your client profile and find the perfect AI experts
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
            { num: 2, label: 'Company', icon: Building2 },
            { num: 3, label: 'Goals', icon: Target },
            { num: 4, label: 'Budget', icon: DollarSign }
          ].map((step, index) => (
            <div key={step.num} className="flex flex-col items-center flex-1">
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
              {index < 3 && (
                <div className={`hidden lg:block absolute w-32 h-0.5 -mt-5 ml-40 ${
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
                    Tell us about yourself and your organization
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
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

            {/* Step 2: Company Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Company Information</h2>
                  <p className="text-muted-foreground">
                    Help AI experts understand your organization
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter your company name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Company Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourcompany.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <select
                        id="industry"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Select industry</option>
                        {industries.map(ind => (
                          <option key={ind} value={ind}>{ind}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <select
                          id="companySize"
                          value={companySize}
                          onChange={(e) => setCompanySize(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">Select size</option>
                          {companySizes.map(size => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutCompany">About Your Company</Label>
                    <Textarea
                      id="aboutCompany"
                      value={aboutCompany}
                      onChange={(e) => setAboutCompany(e.target.value)}
                      placeholder="Tell us about your company, mission, and what you do..."
                      rows={5}
                      className="resize-none"
                    />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Providing company information helps AI experts understand your needs and submit more relevant proposals.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Project Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">What Are Your AI Goals?</h2>
                  <p className="text-muted-foreground">
                    Select up to 5 types of AI projects you're interested in
                  </p>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2">
                    {projectGoals.length} of 5 goals selected
                  </p>
                  {projectGoals.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {projectGoals.map(goal => (
                        <Badge
                          key={goal}
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => toggleProjectGoal(goal)}
                        >
                          {goal} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {aiProjectGoals.map(goal => (
                    <div
                      key={goal}
                      onClick={() => toggleProjectGoal(goal)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${projectGoals.includes(goal)
                          ? 'border-primary bg-primary/5'
                          : 'border-muted hover:border-primary/50 bg-card'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal}</span>
                        {projectGoals.includes(goal) && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Tell Us More (Optional)</Label>
                  <Textarea
                    id="projectDescription"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your AI automation needs, challenges you're facing, or specific requirements..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-4 rounded-lg border border-primary/20">
                  <h4 className="mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Popular AI Solutions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>• Custom chatbots with GPT-4</div>
                    <div>• Business process automation</div>
                    <div>• Predictive analytics models</div>
                    <div>• Document processing with AI</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Budget & Timeline */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-2">Budget & Timeline</h2>
                  <p className="text-muted-foreground">
                    Help AI experts understand your project scope
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Project Budget Range</Label>
                    <RadioGroup value={budgetRange} onValueChange={setBudgetRange}>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { value: 'small', label: 'Small Project', range: '$500 - $2,000', desc: 'Quick automations or simple AI integrations' },
                          { value: 'medium', label: 'Medium Project', range: '$2,000 - $10,000', desc: 'Custom chatbots or workflow automation' },
                          { value: 'large', label: 'Large Project', range: '$10,000 - $50,000', desc: 'Complex ML models or enterprise solutions' },
                          { value: 'enterprise', label: 'Enterprise Project', range: '$50,000+', desc: 'Large-scale AI transformation projects' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${budgetRange === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50 bg-card'
                              }
                            `}
                            onClick={() => setBudgetRange(option.value)}
                          >
                            <div className="flex items-start gap-3">
                              <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <Label htmlFor={option.value} className="font-medium cursor-pointer">
                                    {option.label}
                                  </Label>
                                  <span className="font-semibold text-primary">{option.range}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{option.desc}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Expected Timeline</Label>
                    <RadioGroup value={timeline} onValueChange={setTimeline}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { value: 'urgent', label: 'Less than 1 month', icon: '⚡' },
                          { value: 'short', label: '1-3 months', icon: '📅' },
                          { value: 'medium', label: '3-6 months', icon: '🗓️' },
                          { value: 'long', label: '6+ months', icon: '📆' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`
                              p-4 rounded-lg border-2 cursor-pointer transition-all
                              ${timeline === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50 bg-card'
                              }
                            `}
                            onClick={() => setTimeline(option.value)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={option.value} id={`timeline-${option.value}`} />
                              <Label htmlFor={`timeline-${option.value}`} className="cursor-pointer flex items-center gap-2 flex-1">
                                <span className="text-xl">{option.icon}</span>
                                <span>{option.label}</span>
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    Budget Tips
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Your budget helps match you with qualified AI experts</li>
                    <li>• Consider both development and maintenance costs</li>
                    <li>• Milestone-based payments protect your investment</li>
                    <li>• You can adjust budgets when posting specific projects</li>
                  </ul>
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
