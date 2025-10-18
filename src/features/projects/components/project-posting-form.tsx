'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload, X, Plus, Calendar, DollarSign, Paperclip, Shield,
  Search, UserPlus, CheckCircle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { projectPostingSchema, type ProjectPostingFormData, type FreelancerOption } from '../types';
import { paths } from '@/config/paths';

const CATEGORIES = [
  'AI Chatbots & Assistants',
  'Workflow Automation',
  'Machine Learning & AI Models',
  'Data Analysis & BI',
  'API Integration',
  'Process Automation (RPA)',
  'Natural Language Processing',
  'Computer Vision',
  'Predictive Analytics',
  'Custom AI Solutions',
  'AI Strategy & Consulting',
  'Model Training & Fine-tuning'
];

const SKILLS = [
  'Python', 'TensorFlow', 'PyTorch', 'GPT-4', 'OpenAI API', 'Machine Learning',
  'Natural Language Processing', 'Computer Vision', 'Data Science', 'API Integration', 'REST APIs',
  'UiPath', 'Automation Anywhere', 'RPA', 'Workflow Automation', 'Process Mining',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'NoSQL',
  'React', 'Node.js', 'FastAPI', 'Flask', 'Django', 'LangChain', 'Vector Databases'
];

const MOCK_FREELANCERS: FreelancerOption[] = [
  {
    id: '1',
    name: 'Alex Chen',
    title: 'Senior AI Engineer & ML Specialist',
    avatar: 'AC',
    rating: 4.9,
    reviewCount: 127,
    skills: ['GPT-4', 'Python', 'TensorFlow', 'NLP'],
    hourlyRate: 95,
    completedProjects: 89
  },
  {
    id: '2',
    name: 'Maria Garcia',
    title: 'RPA & Workflow Automation Expert',
    avatar: 'MG',
    rating: 5.0,
    reviewCount: 94,
    skills: ['UiPath', 'Power Automate', 'Python'],
    hourlyRate: 85,
    completedProjects: 76
  },
  {
    id: '3',
    name: 'David Park',
    title: 'Data Scientist & Analytics Engineer',
    avatar: 'DP',
    rating: 4.8,
    reviewCount: 156,
    skills: ['Machine Learning', 'Python', 'Tableau'],
    hourlyRate: 90,
    completedProjects: 112
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    title: 'AI Chatbot Developer',
    avatar: 'SJ',
    rating: 4.9,
    reviewCount: 83,
    skills: ['OpenAI API', 'LangChain', 'React'],
    hourlyRate: 80,
    completedProjects: 67
  },
  {
    id: '5',
    name: 'Michael Brown',
    title: 'Computer Vision Specialist',
    avatar: 'MB',
    rating: 4.7,
    reviewCount: 71,
    skills: ['PyTorch', 'Computer Vision', 'Python'],
    hourlyRate: 88,
    completedProjects: 54
  }
];

export function ProjectPostingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [freelancerSearch, setFreelancerSearch] = useState('');
  const [selectedFreelancers, setSelectedFreelancers] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const form = useForm<ProjectPostingFormData>({
    resolver: zodResolver(projectPostingSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      skills: [],
      budgetType: 'fixed',
      budgetAmount: '',
      timeline: '',
      location: 'remote',
      attachments: [],
      invitedFreelancers: [],
    },
  });

  const budgetType = form.watch('budgetType');
  const skills = form.watch('skills');

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    form.setValue('skills', newSkills);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = [...attachments, ...files];
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  const removeFile = (index: number) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    form.setValue('attachments', newAttachments);
  };

  const filteredFreelancers = MOCK_FREELANCERS.filter(freelancer =>
    freelancerSearch === '' ||
    freelancer.name.toLowerCase().includes(freelancerSearch.toLowerCase()) ||
    freelancer.title.toLowerCase().includes(freelancerSearch.toLowerCase()) ||
    freelancer.skills.some(skill => skill.toLowerCase().includes(freelancerSearch.toLowerCase()))
  );

  const toggleFreelancerInvite = (freelancerId: string) => {
    setSelectedFreelancers(prev =>
      prev.includes(freelancerId)
        ? prev.filter(id => id !== freelancerId)
        : [...prev, freelancerId]
    );
  };

  const onSubmit = (data: ProjectPostingFormData) => {
    const finalData = {
      ...data,
      invitedFreelancers: selectedFreelancers
    };
    console.log('Project posted:', finalData);
    // TODO: Submit to API
    setShowSuccessDialog(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    router.push(paths.public.browse.getHref({ tab: 'projects' }));
  };

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl mb-2">Post a New AI Automation Project</h1>
          <p className="text-muted-foreground">Tell us about your automation needs and find the perfect AI expert</p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="grid grid-cols-4 gap-2 mt-4 text-xs sm:text-sm">
              <span className={currentStep >= 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Project Details
              </span>
              <span className={currentStep >= 2 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Budget & Timeline
              </span>
              <span className={currentStep >= 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Invite Experts
              </span>
              <span className={currentStep >= 4 ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                Review & Submit
              </span>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., AI Chatbot for customer support automation"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Write a clear, descriptive title for your AI automation project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your AI automation needs in detail. Include current processes, desired outcomes, data sources, integration requirements, expected volume/scale, and any technical constraints..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {field.value.length} / 5000 characters. Minimum 100 characters required.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Required Skills & Technologies *</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap gap-2">
                              {SKILLS.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant={skills.includes(skill) ? 'default' : 'outline'}
                                  className="cursor-pointer hover:bg-primary/90"
                                  onClick={() => toggleSkill(skill)}
                                >
                                  {skill}
                                  {skills.includes(skill) && <X className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Select all skills and technologies required for this project
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label>Project Attachments (Optional)</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload requirements docs, diagrams, data samples, or specifications
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Choose Files
                        </Button>
                      </div>

                      {attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                              <div className="flex items-center gap-2">
                                <Paperclip className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFile(index)}
                                className="h-6 w-6"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setCurrentStep(2)}>
                    Continue to Budget & Timeline
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Budget & Timeline */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Budget & Timeline</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="budgetType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Type *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="fixed" id="fixed" />
                                <Label htmlFor="fixed" className="cursor-pointer font-normal">
                                  Fixed Price Project
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="hourly" id="hourly" />
                                <Label htmlFor="hourly" className="cursor-pointer font-normal">
                                  Time & Materials
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {budgetType === 'fixed' ? 'Project Budget' : 'Hourly Rate Budget'} *
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                type="number"
                                placeholder={budgetType === 'fixed' ? '25000' : '75'}
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormDescription>
                            {budgetType === 'fixed'
                              ? 'Total project budget for the complete automation solution'
                              : "Maximum hourly rate you're willing to pay"
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Timeline *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="less-than-1-week">Less than 1 week</SelectItem>
                              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                              <SelectItem value="1-month">1 month</SelectItem>
                              <SelectItem value="2-3-months">2-3 months</SelectItem>
                              <SelectItem value="3-6-months">3-6 months</SelectItem>
                              <SelectItem value="more-than-6-months">More than 6 months</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location Preference</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="remote" id="remote" />
                                <Label htmlFor="remote" className="cursor-pointer font-normal">
                                  Remote (Worldwide)
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="local" id="local" />
                                <Label htmlFor="local" className="cursor-pointer font-normal">
                                  Local Experts Only
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="us-only" id="us-only" />
                                <Label htmlFor="us-only" className="cursor-pointer font-normal">
                                  US-based Only
                                </Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Payment Structure Info */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium mb-1">Secure Payment Structure</h4>
                            <p className="text-sm text-muted-foreground">
                              LinkerAI uses a 50/50 payment model: You'll pay 50% upfront when you hire an AI expert, and the remaining 50% upon successful completion and validation of the work.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div className="bg-background/80 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">Upfront Payment</p>
                                <p className="font-medium text-primary">50% on hire</p>
                              </div>
                              <div className="bg-background/80 rounded-lg p-3">
                                <p className="text-xs text-muted-foreground mb-1">Final Payment</p>
                                <p className="font-medium text-primary">50% on completion</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    Back to Project Details
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(3)}>
                    Continue to Invite Experts
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Invite AI Experts */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Invite AI Experts (Optional)</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Search and invite specific AI experts to submit proposals for your project
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search Bar */}
                    <div>
                      <Label htmlFor="freelancer-search">Search AI Experts</Label>
                      <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="freelancer-search"
                          placeholder="Search by name, skills, or expertise..."
                          value={freelancerSearch}
                          onChange={(e) => setFreelancerSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Find experts by their name, skills (e.g., GPT-4, TensorFlow), or specialization
                      </p>
                    </div>

                    {/* Selected Count */}
                    {selectedFreelancers.length > 0 && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-primary">
                          <UserPlus className="w-4 h-4 inline mr-1" />
                          {selectedFreelancers.length} expert{selectedFreelancers.length !== 1 ? 's' : ''} will be invited to submit proposals
                        </p>
                      </div>
                    )}

                    {/* Freelancer Results */}
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {filteredFreelancers.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No AI experts found matching your search</p>
                        </div>
                      ) : (
                        filteredFreelancers.map((freelancer) => (
                          <Card
                            key={freelancer.id}
                            className={`cursor-pointer transition-all ${
                              selectedFreelancers.includes(freelancer.id)
                                ? 'border-primary bg-primary/5'
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => toggleFreelancerInvite(freelancer.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarFallback>{freelancer.avatar}</AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate">{freelancer.name}</h4>
                                      <p className="text-sm text-muted-foreground truncate">{freelancer.title}</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{freelancer.rating}</span>
                                      <span className="text-xs text-muted-foreground">({freelancer.reviewCount})</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {freelancer.skills.slice(0, 3).map((skill) => (
                                      <Badge key={skill} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {freelancer.skills.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{freelancer.skills.length - 3}
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                    <span className="font-medium text-primary">${freelancer.hourlyRate}/hr</span>
                                    <span>{freelancer.completedProjects} projects</span>
                                  </div>
                                </div>

                                <div className="flex-shrink-0">
                                  {selectedFreelancers.includes(freelancer.id) ? (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 border-2 border-muted-foreground rounded-full" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>

                    {/* Info Box */}
                    <Card className="bg-blue-500/10 border-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <UserPlus className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium mb-1">How Invitations Work</h4>
                            <p className="text-sm text-muted-foreground">
                              Invited experts will receive a notification and can view your project details. They can choose to submit a proposal if interested. You can still receive proposals from other experts not on this list.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                    Back to Budget & Timeline
                  </Button>
                  <Button type="button" onClick={() => setCurrentStep(4)}>
                    {selectedFreelancers.length > 0 ? 'Continue to Review' : 'Skip & Continue to Review'}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Project</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2">Project Title</h3>
                      <p className="text-muted-foreground">{form.getValues('title') || 'Not specified'}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Category</h3>
                      <Badge variant="secondary">{form.getValues('category') || 'Not selected'}</Badge>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">{form.getValues('description') || 'No description provided'}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Required Skills & Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {form.getValues('skills').length > 0 ? (
                          form.getValues('skills').map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No skills selected</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Budget</h3>
                      <p className="text-muted-foreground">
                        {form.getValues('budgetType') === 'fixed' ? 'Fixed Price: ' : 'Hourly Rate: '}
                        {form.getValues('budgetAmount') ? `$${form.getValues('budgetAmount')}` : 'Not specified'}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Timeline</h3>
                      <p className="text-muted-foreground">{form.getValues('timeline') || 'Not specified'}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Location Preference</h3>
                      <p className="text-muted-foreground capitalize">{form.getValues('location').replace('-', ' ')}</p>
                    </div>

                    {selectedFreelancers.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Invited AI Experts</h3>
                        <div className="space-y-2">
                          {selectedFreelancers.map((freelancerId) => {
                            const freelancer = MOCK_FREELANCERS.find(f => f.id === freelancerId);
                            return freelancer ? (
                              <div key={freelancerId} className="flex items-center gap-3 p-2 bg-muted rounded">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>{freelancer.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{freelancer.name}</p>
                                  <p className="text-xs text-muted-foreground">{freelancer.title}</p>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {attachments.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-2">Attachments</h3>
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Paperclip className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Ready to Post</h4>
                        <p className="text-sm text-muted-foreground">
                          Once you submit, your project will be visible to qualified AI experts.
                          {selectedFreelancers.length > 0 && ` ${selectedFreelancers.length} invited expert${selectedFreelancers.length !== 1 ? 's' : ''} will be notified immediately.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(3)}>
                    Back to Invite Experts
                  </Button>
                  <Button type="submit" size="lg">
                    Post Project
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Project Posted Successfully!</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Your project is now live and visible to qualified AI experts.
              {selectedFreelancers.length > 0 && ` ${selectedFreelancers.length} expert${selectedFreelancers.length !== 1 ? 's have' : ' has'} been invited to submit proposals.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <Button
              size="lg"
              className="w-full"
              onClick={handleSuccessClose}
            >
              View My Projects
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => setShowSuccessDialog(false)}
            >
              Post Another Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
