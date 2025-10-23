'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitDeliverable } from '../hooks/use-deliverables';

const submitWorkSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
});

type SubmitWorkFormData = z.infer<typeof submitWorkSchema>;

interface SubmitWorkDialogProps {
  projectId: string;
  freelancerId: string;
  trigger?: React.ReactNode;
}

export function SubmitWorkDialog({ projectId, freelancerId, trigger }: SubmitWorkDialogProps) {
  const [open, setOpen] = useState(false);
  const submitDeliverableMutation = useSubmitDeliverable();

  const form = useForm<SubmitWorkFormData>({
    resolver: zodResolver(submitWorkSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: SubmitWorkFormData) => {
    try {
      await submitDeliverableMutation.mutateAsync({
        project_id: projectId,
        freelancer_id: freelancerId,
        title: data.title,
        description: data.description,
      });

      // Reset form and close dialog
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting work:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Submit Work
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Work</DialogTitle>
          <DialogDescription>
            Submit your completed work for client review with a detailed description.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deliverable Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Final Design Complete, MVP Implemented"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you've completed, implementation details, testing done, and any instructions for the client..."
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitDeliverableMutation.isPending}>
                {submitDeliverableMutation.isPending ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
