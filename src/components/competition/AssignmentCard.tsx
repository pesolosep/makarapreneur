// components/competition/AssignmentCard.tsx
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Download, Upload, ChevronDown, FileText, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
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

  const getStatusInfo = (status: string) => {
    const statusConfig = {
      pending: {
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        icon: <Timer className="w-4 h-4" />,
        label: 'PENDING'
      },
      cleared: {
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: 'CLEARED'
      },
      rejected: {
        color: 'text-red-500',
        bgColor: 'bg-red-500/10',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'REJECTED'
      }
    };
    
    return statusConfig[status as keyof typeof statusConfig];
  };

  return (
    <motion.div 
      className="bg-juneBud rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header - Always visible */}
      <motion.div 
        className="p-6 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h3 className="text-2xl font-bold text-signalBlack">
              {assignment.title}
            </h3>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center text-sm text-signalBlack/70">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>
                  {new Date(assignment.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              {assignment.submission?.status && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                  getStatusInfo(assignment.submission.status).color
                } ${getStatusInfo(assignment.submission.status).bgColor}`}>
                  {getStatusInfo(assignment.submission.status).icon}
                  {getStatusInfo(assignment.submission.status).label}
                </div>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-6 h-6 text-signalBlack/60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-signalBlack/10">
              {/* Description */}
              <div className="mt-6">
                <p className="text-base text-signalBlack/80 leading-relaxed">
                  {assignment.description}
                </p>
              </div>

              {/* Submission Info */}
              {assignment.submission && (
                <div className="mt-6 p-4 bg-signalBlack/5 rounded-lg">
                  <h4 className="font-medium text-signalBlack mb-3">Submission Details</h4>
                  <div className="space-y-2 text-sm text-signalBlack/70">
                    {assignment.submission.submissionURL && (
                      <p className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Submitted: {assignment.submission.submissionURL.split('/').pop()}
                      </p>
                    )}
                    {assignment.submission.submissionDate && (
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Date: {new Date(assignment.submission.submissionDate).toLocaleString()}
                      </p>
                    )}
                    {assignment.submission.feedback && (
                      <div className="mt-4 p-3 bg-white/50 rounded border border-signalBlack/10">
                        <p className="font-medium text-signalBlack mb-1">Feedback:</p>
                        <p className="text-signalBlack/80">{assignment.submission.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDownload(assignment.id)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/80 text-signalBlack rounded-lg hover:bg-white transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Guidelines
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onUpload(assignment.id)}
                  disabled={assignment.submission?.status === 'cleared'}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                    assignment.submission?.status === 'cleared'
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-signalBlack text-white hover:bg-signalBlack/90'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload Submission
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface AssignmentListProps {
  assignments: Assignment[];
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}

export function AssignmentList({ assignments, onDownload, onUpload }: AssignmentListProps) {
  return (
    <div className="space-y-4">
      {assignments.map((assignment, index) => (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <AssignmentCard
            assignment={assignment}
            onDownload={onDownload}
            onUpload={onUpload}
          />
        </motion.div>
      ))}
    </div>
  );
}