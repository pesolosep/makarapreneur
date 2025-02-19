// components/competition/AssignmentCard.tsx
import { useState, useRef } from 'react';
import { Clock, Download, Upload, ChevronUp, ChevronDown, Eye, AlertTriangle } from 'lucide-react';
import { Stage } from '@/models/Competition';
import { TeamStageSubmission, Team } from '@/models/Team';
import { Timestamp } from 'firebase/firestore';
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

export function AssignmentCard({ assignment, onDownload, onUpload, team }: AssignmentCardProps) {
 const [isExpanded, setIsExpanded] = useState(false);
 const [showConfirmDialog, setShowConfirmDialog] = useState(false);
 const [fileToSubmit, setFileToSubmit] = useState<File | null>(null);
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
       return false;
     case 2:
       return team.stages[1]?.status !== 'cleared' || 
              !team.stages[1]?.paidStatus;
     case 3:
       return team.stages[2]?.status !== 'cleared';
     default:
       return true;
   }
 };

 const isSubmissionDisabled = () => {
   if (!team) return true;

   switch (assignment.stageNumber) {
     case 1:
       return assignment.submission?.status === 'cleared';
     case 2:
       return team.stages[1]?.status !== 'cleared' || 
              !team.stages[1]?.paidStatus || 
              assignment.submission?.status === 'cleared';
     case 3:
       return team.stages[2]?.status !== 'cleared' || 
              assignment.submission?.status === 'cleared';
     default:
       return true;
   }
 };

 const handleDialogClose = () => {
   setShowConfirmDialog(false);
   setFileToSubmit(null);
   if (fileInputRef.current) {
     fileInputRef.current.value = '';
   }
 };

 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (file) {
     setFileToSubmit(file);
     setShowConfirmDialog(true);
   }
 };

 const handleConfirmSubmission = async () => {
   if (fileToSubmit) {
     try {
       await onUpload(assignment.id, fileToSubmit);
       handleDialogClose();
     } catch (error) {
       console.error('Upload failed:', error);
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
   <div className="bg-juneBud rounded-lg shadow-lg mb-6">
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
           <p className="text-sm">
             <span className="font-medium">Deadline: </span>
             {assignment?.deadline ? formatDeadline(assignment.deadline) : 'Loading...'}
           </p>
         </div>
       </div>
       <div className="flex items-center gap-2">
         {isExpanded ? 
           <ChevronUp className="w-6 h-6 text-signalBlack" /> : 
           <ChevronDown className="w-6 h-6 text-signalBlack" />
         }
       </div>
     </div>

     {isExpanded && (
       <div className="px-6 pb-6 border-t border-signalBlack/10">
         <div className="mt-4">
           <div className="space-y-3">
             {team && assignment.submission?.submissionURL && (
               <div className="flex items-center gap-2">
                 <p className="text-base flex-1">
                   <span className="font-medium">Submission File:</span>{' '}
                   {decodeURIComponent(assignment.submission.submissionURL).split('/').slice(-1)[0].split('?')[0]}
                 </p>
                 <br></br>
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

             <p className="text-base">
               <span className="font-medium">Status:</span>{' '}
               {getStatusDisplay(assignment.submission?.status || 'pending')}
             </p>

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
           <p className="text-base text-signalBlack font-medium max-w-[700px]">
             {assignment.description}
           </p>
         </div>

         <div className="mt-6 flex gap-4">
           <button
             onClick={handleDownloadClick}
             className="flex items-center gap-2 px-6 py-3 text-base font-medium text-signalBlack bg-white/80 rounded-md hover:bg-white transition-colors"
           >
             <Download className="w-5 h-5" />
             Download Guidelines
           </button>
           
           {!shouldHideSubmission() && (
             <div className="relative">
               <input
                 ref={fileInputRef}
                 type="file"
                 id={`file-upload-${assignment.id}`}
                 className="hidden"
                 accept=".pdf,.doc,.docx"
                 onChange={handleFileSelect}
                 disabled={isSubmissionDisabled() || isDeadlinePassed()}
               />
               <label
                 htmlFor={`file-upload-${assignment.id}`}
                 className={`flex items-center gap-2 px-6 py-3 text-base font-medium text-white bg-signalBlack rounded-md hover:bg-signalBlack/80 transition-colors cursor-pointer
                   ${(isSubmissionDisabled() || isDeadlinePassed()) ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <Upload className="w-5 h-5" />
                 {assignment.submission?.submissionURL ? 'Update Submission' : 'Upload Submission'}
               </label>
             </div>
           )}
         </div>

         <AlertDialog open={showConfirmDialog} onOpenChange={handleDialogClose}>
           <AlertDialogContent>
             <AlertDialogHeader>
               <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
               <AlertDialogDescription className="space-y-2">
                 <p>
                   {assignment.submission?.submissionURL
                     ? 'Are you sure you want to update your submission?'
                     : 'Are you sure you want to submit this file?'}
                 </p>
                 {fileToSubmit && (
                   <div className="p-3 bg-gray-100 rounded-md">
                     <p className="font-medium">Selected file:</p>
                     <p className="text-sm">{fileToSubmit.name}</p>
                     <p className="text-sm text-gray-500">
                       Size: {(fileToSubmit.size / 1024 / 1024).toFixed(2)} MB
                     </p>
                   </div>
                 )}
                 {assignment.submission?.submissionURL && (
                   <p className="text-yellow-600">
                     This will replace your current submission.
                   </p>
                 )}
               </AlertDialogDescription>
             </AlertDialogHeader>
             <AlertDialogFooter>
               <AlertDialogCancel onClick={handleDialogClose}>
                 Cancel
               </AlertDialogCancel>
               <AlertDialogAction onClick={handleConfirmSubmission}>
                 Confirm
               </AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
         </AlertDialog>
       </div>
     )}
   </div>
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
   <div className="max-w-5xl mx-auto px-6">
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