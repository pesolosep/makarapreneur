// components/competition/AssignmentCard.tsx
import { useState } from 'react';
import { Clock, Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { Stage } from '@/models/Competition';
import { TeamStageSubmission } from '@/models/Team';

interface Assignment extends Stage {
  id: string;
  submission?: TeamStageSubmission;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}

export function AssignmentCard({ assignment, onDownload, onUpload }: AssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper function to format the status with proper styling
  const getStatusDisplay = (status: string) => {
    const statusColors = {
      pending: 'text-yellow-600',
      cleared: 'text-green-600',
      rejected: 'text-red-600'
    };
    return <span className={statusColors[status as keyof typeof statusColors]}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="bg-juneBud rounded-lg shadow-lg mb-6">
      {/* Header - Always visible */}
      <div 
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-3xl tracking-widest text-signalBlack">
            {assignment.title}
          </h3>
          <div className="flex items-center text-base text-signalBlack mt-3">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Deadline: {new Date(assignment.deadline).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? 
            <ChevronUp className="w-6 h-6 text-signalBlack" /> : 
            <ChevronDown className="w-6 h-6 text-signalBlack" />
          }
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-signalBlack/10">
          {/* Status Section */}
          <div className="mt-4">
            <h4 className="text-xl font-semibold tracking-wide text-signalBlack mb-3">Status</h4>
            <div className="space-y-3">
              {assignment.submission?.submissionURL && (
                <p className="text-base">
                  <span className="font-medium">Submission File:</span>{' '}
                  {assignment.submission.submissionURL.split('/').pop()}
                </p>
              )}
              {assignment.submission?.submissionDate && (
                <p className="text-base">
                  <span className="font-medium">Submitted On:</span>{' '}
                  {new Date(assignment.submission.submissionDate).toLocaleString()}
                </p>
              )}
              <p className="text-base">
                <span className="font-medium">Status:</span>{' '}
                {getStatusDisplay(assignment.submission?.status || 'pending')}
              </p>
              {assignment.submission?.feedback && (
                <p className="text-base">
                  <span className="font-medium">Feedback:</span>{' '}
                  {assignment.submission.feedback}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <p className="text-base text-signalBlack font-medium max-w-[700px]">
              {assignment.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onDownload(assignment.id)}
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-signalBlack bg-white/80 rounded-md hover:bg-white transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Guidelines
            </button>
            <button
              onClick={() => onUpload(assignment.id)}
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-signalBlack rounded-md hover:bg-signalBlack/80 transition-colors"
              disabled={assignment.submission?.status === 'cleared'}
            >
              <Upload className="w-5 h-5" />
              Upload Submission
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}

export function AssignmentList({ assignments, onDownload, onUpload }: AssignmentListProps) {
  return (
    <div className="max-w-5xl mx-auto px-6">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          onDownload={onDownload}
          onUpload={onUpload}
        />
      ))}
    </div>
  );
}