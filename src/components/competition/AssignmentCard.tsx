// components/AssignmentCard.tsx
import { useState } from 'react';
import { Clock, Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  description: string;
  status: string;
  submitterName?: string;
  submissionTime?: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}

export function AssignmentCard({ assignment, onDownload, onUpload }: AssignmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div  className="bg-gray-500">
    <div className="bg-juneBud  rounded-lg shadow-lg mb-6 min-h-[200px]">
      {/* Header - Always visible */}
      <div 
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-3xl tracking-widest text-signalBlack">{assignment.title}</h3>
          <div className="flex items-center text-base text-signalBlack mt-3">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">Deadline: {assignment.deadline}</span>
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
              {assignment.submitterName && (
                <p className="text-base">
                  <span className="font-medium">Nama Berkas:</span> {assignment.submitterName}
                </p>
              )}
              {assignment.submissionTime && (
                <p className="text-base">
                  <span className="font-medium">Terkirim Dunggan:</span> {assignment.submissionTime}
                </p>
              )}
              <p className="text-base">
                <span className="font-medium">Status:</span>{' '}
                <span className="text-signalBlack font-semibold">{assignment.status}</span>
              </p>
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
              Unduh soal selesai
            </button>
            <button
              onClick={() => onUpload(assignment.id)}
              className="flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-signalBlack rounded-md hover:bg-signalBlack/80 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Unggah jawaban
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

// components/AssignmentList.tsx
interface AssignmentListProps {
  assignments: Assignment[];
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}

export function AssignmentList({ assignments, onDownload, onUpload }: AssignmentListProps) {
  return (
    <div className="max-w-5xl mx-auto px-6 bg-gray-500">
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