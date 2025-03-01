"use client";

import { useState, useRef } from 'react';
import { Clock, Download, Upload, ChevronDown, Eye, AlertTriangle, Loader2 } from 'lucide-react';
import { Stage } from '@/models/Competition';
import { TeamStageSubmission, Team } from '@/models/Team';
import { Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface Assignment extends Stage {
  id: string;
  stageNumber: number;
  submission?: TeamStageSubmission;
  submissionEnabled: boolean;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onDownload: (id: string) => void;
  onUpload: (id: string, file: File) => void;
  team?: Team | null;
}

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 0.5,
      bounce: 0.3
    }
  }
};

const contentVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export function AssignmentCard({ assignment, onDownload, onUpload, team }: AssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [fileToSubmit, setFileToSubmit] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDeadline = (deadline: Date | Timestamp) => {
    const date = deadline instanceof Date ? deadline : deadline.toDate();
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const isDeadlinePassed = () => {
    if (!assignment.deadline) return false;
    const deadline = assignment.deadline instanceof Date 
      ? assignment.deadline 
      : new Date(assignment.deadline);
    return new Date() > deadline;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStatusDisplay = (status: string) => {
    if (assignment.stageNumber === 1) {
      if (!team) {
        return <span className="text-gray-600">NOT REGISTERED</span>;
      }
      if (!assignment.submission?.status) {
        return <span className="text-yellow-600">PENDING</span>;
      }
    }

    const statusColors = {
      pending: 'text-yellow-600',
      cleared: 'text-green-600',
      rejected: 'text-red-400'
    };
    return <span className={statusColors[status as keyof typeof statusColors]}>{status.toUpperCase()}</span>;
  };

  const shouldHideSubmission = () => {
    if (!team) return true;
    
    switch (assignment.stageNumber) {
      case 1:
        return assignment.submission?.status == 'cleared';
      case 2:
        return team.stages[1]?.status !== 'cleared' || 
               assignment.submission?.status === 'cleared' ;
      case 3:
        return team.stages[2]?.status !== 'cleared'|| 
        assignment.submission?.status === 'cleared';
      default:
        return true;
    }
  };

  const isSubmissionDisabled = () => {
    if (!team) return true;

    switch (assignment.stageNumber) {
      case 1:
        return team.registrationStatus !== 'approved' ;
      case 2:
        return team.stages[1]?.status !== 'cleared' || team.paidStatus !== true; ;
      case 3:
        return team.stages[2]?.status !== 'cleared';
      default:
        return true;
    }
  };

  const handleDialogClose = () => {
    if (isSubmitting) return; // Prevent closing dialog while submitting
    setShowConfirmDialog(false);
    setFileToSubmit(null);
    // Don't reset fileInputRef here as we already clear it in handleFileSelect
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToSubmit(file);
      setShowConfirmDialog(true);
      // Remove the file from the input to allow reselection of the same file
      e.target.value = '';
    }
  };

  const handleConfirmSubmission = async () => {
    if (fileToSubmit && !isSubmitting) {
      try {
        setIsSubmitting(true);
        
        // Directly call onUpload with the file we already have
        // No need to open another file picker dialog
        await onUpload(assignment.id, fileToSubmit);
        
        // Close dialog and clean up
        setShowConfirmDialog(false);
        setFileToSubmit(null);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleFilePreview = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload(assignment.id);
  };

  return (
    <motion.div 
      className="bg-juneBud rounded-lg overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
    >
      <div 
        className={cn(
          "p-6 flex justify-between items-center cursor-pointer transition-colors duration-200",
          isExpanded ? "bg-accent/5" : "hover:bg-accent/5"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-2xl text-card-foreground font-poppins">
              {assignment.title}
            </h3>
            {assignment.submission?.status && (
              <div className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                assignment.submission.status === 'cleared' && "bg-juneBud/20 text-juneBud",
                assignment.submission.status === 'rejected' && "bg-destructive/20 text-destructive",
                assignment.submission.status === 'pending' && "bg-muted/20 text-muted-foreground"
              )}>
                {assignment.submission.status.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex items-center text-base text-muted-foreground mt-3">
            <Clock className="w-4 h-4 mr-2" />
            <p className="text-sm">
              <span className="font-medium">Deadline: </span>
              {assignment?.deadline ? formatDeadline(assignment.deadline) : 'Loading...'}
            </p>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="px-6 pb-6 border-t border-gray-400"
          >
            <div className="mt-4">
              <div className="space-y-3">
                {team && assignment.submission?.submissionURL && (
                  <div className="flex items-center gap-2">
                    <p className="text-base flex-1">
                      <span className="font-medium">Submission File:</span>{' '}
                      {decodeURIComponent(assignment.submission.submissionURL).split('/').slice(-1)[0].split('?')[0]}
                    </p>
                    <button
                      onClick={() => assignment.submission?.submissionURL && handleFilePreview(assignment.submission.submissionURL)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                      View File
                    </button>
                  </div>
                )}

                {team && assignment.submission?.submissionDate && (
                  <p className="text-base">
                    <span className="font-medium">Submitted On:</span>{' '}
                    {formatDeadline(assignment.submission.submissionDate)}
                  </p>
                )}

                {team && assignment.submission?.feedback && (
                  <p className="text-base">
                    <span className="font-medium">Feedback:</span>{' '}
                    {assignment.submission.feedback}
                  </p>
                )}

                {isDeadlinePassed() && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-sm">Submission deadline has passed</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-base text-card-foreground/90 font-medium max-w-[700px]">
                {assignment.description}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadClick}
                className="flex items-center gap-2 px-6 py-3 text-base font-medium 
                  bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Guidelines
              </motion.button>
              
              {!shouldHideSubmission() && (
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id={`file-upload-${assignment.id}`}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    disabled={isSubmissionDisabled() || isDeadlinePassed() || isSubmitting}
                  />
                  <motion.label
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    htmlFor={`file-upload-${assignment.id}`}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 text-base font-medium",
                      "bg-primary text-primary-foreground rounded-md",
                      "hover:bg-primary/90 transition-colors cursor-pointer",
                      (isSubmissionDisabled() || isDeadlinePassed() || isSubmitting) && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        {assignment.submission?.submissionURL ? 'Update Submission' : 'Upload Submission'}
                      </>
                    )}
                  </motion.label>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertDialog open={showConfirmDialog} onOpenChange={handleDialogClose}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold font-poppins">
              Confirm Submission
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p className="text-card-foreground/80">
                  {assignment.submission?.submissionURL
                    ? 'Are you sure you want to update your submission? This action cannot be undone.'
                    : 'Are you sure you want to submit this file? Please ensure all information is correct.'}
                </p>
                
                {fileToSubmit && (
                  <div className="p-4 rounded-lg bg-accent/5 border border-border space-y-2">
                    <p className="font-medium text-card-foreground">Selected file:</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{fileToSubmit.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Size: {(fileToSubmit.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                )}
                
                {assignment.submission?.submissionURL && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      This will replace your current submission.
                    </span>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={handleDialogClose}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
              onClick={handleConfirmSubmission}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </div>
              ) : (
                assignment.submission?.submissionURL ? 'Update Submission' : 'Submit File'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  onDownload: (id: string) => void;
  onUpload: (id: string, file: File) => void;
  team?: Team | null;
}

export function AssignmentList({ assignments, onDownload, onUpload, team }: AssignmentListProps) {
  return (
    <div className="max-w-7xl mx-auto ">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onDownload={onDownload}
          onUpload={onUpload}
          team={team}
        />
      ))}
    </div>
  );
}