'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, FileText, Download } from 'lucide-react';
import { useProjectDeliverables } from '../hooks/use-deliverables';
import { ReviewWorkDialog } from './review-work-dialog';
import { SubmitWorkDialog } from './submit-work-dialog';
import type { Deliverable } from '../api/deliverables';

interface ProjectDeliverablesTabProps {
  projectId: string;
  isClient: boolean;
  isFreelancer: boolean;
  freelancerId?: string;
}

const getStatusBadge = (status: Deliverable['status']) => {
  switch (status) {
    case 'submitted':
      return <Badge variant="secondary">Pending Review</Badge>;
    case 'approved':
      return <Badge variant="default" className="bg-green-600">Approved</Badge>;
    case 'revision_requested':
      return <Badge variant="destructive">Revisions Requested</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ProjectDeliverablesTab({
  projectId,
  isClient,
  isFreelancer,
  freelancerId,
}: ProjectDeliverablesTabProps) {
  const { data: deliverables, isLoading } = useProjectDeliverables(projectId);
  const [selectedDeliverable, setSelectedDeliverable] = useState<Deliverable | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading deliverables...</p>
        </CardContent>
      </Card>
    );
  }

  const handleReviewClick = (deliverable: Deliverable) => {
    setSelectedDeliverable(deliverable);
    setReviewDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Deliverables</CardTitle>
              <CardDescription>Work submitted by the freelancer</CardDescription>
            </div>
            {isFreelancer && freelancerId && (
              <SubmitWorkDialog projectId={projectId} freelancerId={freelancerId} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!deliverables || deliverables.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No deliverables submitted yet</p>
              <p className="text-sm">
                {isFreelancer
                  ? 'Click "Submit Work" to submit your completed work'
                  : 'Deliverables will appear here once the freelancer submits their work'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map((deliverable) => (
                <div
                  key={deliverable.id}
                  className="border rounded-lg p-6 hover:bg-muted/30 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{deliverable.title}</h3>
                        {getStatusBadge(deliverable.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Submitted {new Date(deliverable.submitted_at).toLocaleDateString()} at{' '}
                        {new Date(deliverable.submitted_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {isClient && deliverable.status === 'submitted' && (
                      <Button onClick={() => handleReviewClick(deliverable)}>
                        Review Work
                      </Button>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {deliverable.description}
                    </p>
                  </div>

                  {/* Review Feedback */}
                  {deliverable.review_feedback && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h4 className="text-sm font-medium mb-2">
                        {deliverable.status === 'approved'
                          ? 'Client Feedback'
                          : 'Requested Revisions'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {deliverable.review_feedback}
                      </p>
                      {deliverable.reviewed_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Reviewed on {new Date(deliverable.reviewed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      {selectedDeliverable && (
        <ReviewWorkDialog
          deliverable={selectedDeliverable}
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
        />
      )}
    </>
  );
}
