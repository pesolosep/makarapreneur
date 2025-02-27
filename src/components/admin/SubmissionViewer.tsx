// components/SubmissionViewer.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Eye } from 'lucide-react';
import { TeamStageSubmission } from '@/models/Team';

interface SubmissionViewerProps {
  submission: TeamStageSubmission;
  teamName: string;
  stageNumber: string;
}

export const SubmissionViewer: React.FC<SubmissionViewerProps> = ({ submission, teamName, stageNumber }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Don't render if no submission URL
  if (!submission.submissionURL) {
    return null;
  }

  const getFileExtension = (url: string) => {
    const extension = url.split('.').pop()?.toLowerCase();
    return extension;
  };

  const isViewableInBrowser = (url: string) => {
    const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
    const extension = getFileExtension(url);
    return extension ? viewableExtensions.includes(extension) : false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View Submission
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{teamName} - Stage {stageNumber} Submission</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <a
              href={submission.submissionURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Download className="h-4 w-4" />
              Download File
            </a>
          </div>
          {isViewableInBrowser(submission.submissionURL) ? (
            <iframe
              src={submission.submissionURL}
              className="w-full h-full min-h-[60vh] border rounded"
              title={`${teamName} Stage ${stageNumber} Submission`}
            />
          ) : (
            <div className="text-center py-8">
              This file type cannot be previewed. Please download to view.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// In your TeamManagementDashboard component, update the date formatting function:
const formatDate = (date: Date | string | undefined) => {
  if (!date) return 'Not set';
  
  // Handle Firestore Timestamp conversion
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }

  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

