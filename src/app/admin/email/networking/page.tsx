// "use client";

// import React, { useState, useEffect, useMemo } from 'react';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { 
//   Bold, Italic, List, ListOrdered, Heading1, Heading2, Undo, Redo, Search, 
//   Download, Filter, Mail, CheckCircle, XCircle, Edit, Eye, FileText,
//   ArrowUpDown, ChevronDown, FileX, RefreshCw, Trash2, Send, MailX
// } from 'lucide-react';
// import { networkingEventAdminService } from '@/lib/networkingEventService';
// import type { NetworkingParticipant, MembershipStatus } from '@/models/NetworkParticipant';
// import { useAuth } from '@/contexts/AuthContext';
// import { useRouter } from 'next/navigation';
// import AdminNavbar from '@/components/admin/NavbarAdmin';
// import { toast } from 'sonner';
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import Papa from 'papaparse';

// // Types for the Dashboard
// interface FilterOptions {
//   membershipStatus: MembershipStatus | 'ALL';
//   hasBusiness: boolean | 'ALL';
//   searchQuery: string;
//   attendanceStatus: 'ALL' | 'CONFIRMED' | 'ATTENDED' | 'ABSENT' | 'NOT_CONFIRMED';
// }

// export default function NetworkingEventDashboard() {
//   const { user, isAdmin, loading } = useAuth();
//   const router = useRouter();
  
//   // State for participants data
//   const [participants, setParticipants] = useState<NetworkingParticipant[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // State for filters
//   const [filters, setFilters] = useState<FilterOptions>({
//     membershipStatus: 'ALL',
//     hasBusiness: 'ALL',
//     searchQuery: '',
//     attendanceStatus: 'ALL',
//   });

//   // State for selected participants (for bulk actions)
//   const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
//   const [selectAll, setSelectAll] = useState<boolean>(false);
  
//   // State for email sending
//   const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false);
//   const [emailSubject, setEmailSubject] = useState<string>('');
//   const [sendingEmail, setSendingEmail] = useState<boolean>(false);

//   // Email editor
//   const editor = useEditor({
//     extensions: [StarterKit],
//     content: '<p>Enter your email content here...</p>',
//   });

//   // Fetch participants data
//   useEffect(() => {
//     if (!isAdmin && !loading) {
//       router.push('/');
//       return;
//     }
    
//     const fetchParticipants = async () => {
//       try {
//         setLoading(true);
//         const data = await networkingEventAdminService.getAllParticipants();
//         setParticipants(data);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching participants:', err);
//         setError('Failed to load participants data. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchParticipants();
//   }, [isAdmin, loading, router]);

//   // Handle select all checkbox
//   useEffect(() => {
//     if (selectAll) {
//       setSelectedParticipants(filteredParticipants.map(p => p.id));
//     } else if (selectedParticipants.length === filteredParticipants.length) {
//       setSelectedParticipants([]);
//     }
//   }, [selectAll]);

//   // Update selectAll state when individual selections change
//   useEffect(() => {
//     if (filteredParticipants.length > 0 && selectedParticipants.length === filteredParticipants.length) {
//       setSelectAll(true);
//     } else {
//       setSelectAll(false);
//     }
//   }, [selectedParticipants, filteredParticipants]);

//   // Apply filters to participants data
//   const filteredParticipants = useMemo(() => {
//     return participants.filter(participant => {
//       // Filter by membership status
//       if (filters.membershipStatus !== 'ALL' && participant.membershipStatus !== filters.membershipStatus) {
//         return false;
//       }
      
//       // Filter by business status
//       if (filters.hasBusiness !== 'ALL' && participant.hasBusiness !== filters.hasBusiness) {
//         return false;
//       }
      
//       // Filter by attendance status
//       if (filters.attendanceStatus !== 'ALL') {
//         if (filters.attendanceStatus === 'NOT_CONFIRMED' && participant.attendanceStatus) {
//           return false;
//         }
//         if (filters.attendanceStatus !== 'NOT_CONFIRMED' && participant.attendanceStatus !== filters.attendanceStatus) {
//           return false;
//         }
//       }
      
//       // Search query (case insensitive)
//       if (filters.searchQuery) {
//         const query = filters.searchQuery.toLowerCase();
//         // Search in multiple fields
//         return (
//           participant.name.toLowerCase().includes(query) ||
//           participant.whatsappNumber.toLowerCase().includes(query) ||
//           (participant.hipmiPtOrigin && participant.hipmiPtOrigin.toLowerCase().includes(query)) ||
//           (participant.business?.name && participant.business.name.toLowerCase().includes(query)) ||
//           (participant.business?.field && participant.business.field.toLowerCase().includes(query))
//         );
//       }
      
//       return true;
//     });
//   }, [participants, filters]);

//   // Toggle participant selection
//   const toggleParticipantSelection = (participantId: string) => {
//     setSelectedParticipants(prev => {
//       if (prev.includes(participantId)) {
//         return prev.filter(id => id !== participantId);
//       } else {
//         return [...prev, participantId];
//       }
//     });
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setFilters({
//       membershipStatus: 'ALL',
//       hasBusiness: 'ALL',
//       searchQuery: '',
//       attendanceStatus: 'ALL',
//     });
//   };

//   // Export filtered participants as CSV
//   const exportToCSV = () => {
//     const dataToExport = filteredParticipants.map(p => ({
//       ID: p.id,
//       Name: p.name,
//       WhatsApp: p.whatsappNumber,
//       MembershipStatus: getMembershipStatusLabel(p.membershipStatus),
//       Position: getPositionLabel(p.position),
//       HIPMIPTOrigin: p.hipmiPtOrigin || 'N/A',
//       HasBusiness: p.hasBusiness ? 'Yes' : 'No',
//       BusinessName: p.business?.name || 'N/A',
//       BusinessField: p.business?.field || 'N/A',
//       RegistrationDate: formatDate(p.registrationDate),
//       PaymentStatus: p.paymentProofURL ? 'Submitted' : 'Not Submitted',
//       PaymentDate: p.paymentDate ? formatDate(p.paymentDate) : 'N/A',
//       AttendanceStatus: p.attendanceStatus || 'Not Confirmed',
//     }));
    
//     const csv = Papa.unparse(dataToExport);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `networking-participants-${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
    
//     toast.success(`Exported ${dataToExport.length} participants to CSV`);
//   };

//   // Send email to selected participants
//   const sendEmail = async () => {
//     if (selectedParticipants.length === 0) {
//       toast.error('Please select at least one participant to send an email');
//       return;
//     }
    
//     if (!emailSubject) {
//       toast.error('Please enter an email subject');
//       return;
//     }
    
//     if (!editor?.getText() || editor?.getText().trim() === '') {
//       toast.error('Please enter email content');
//       return;
//     }
    
//     try {
//       setSendingEmail(true);
      
//       // Get selected participants' data
//       const selectedParticipantsData = participants.filter(p => 
//         selectedParticipants.includes(p.id)
//       );
      
//       // Create email recipients array
//       const emailData = {
//         subject: emailSubject,
//         html: editor?.getHTML() || '',
//         recipients: selectedParticipantsData.map(p => ({
//           id: p.id,
//           name: p.name,
//           whatsappNumber: p.whatsappNumber,
//           membershipStatus: p.membershipStatus,
//         })),
//       };
      
//       // Call API to send emails
//       const response = await fetch('/api/admin/networking/send-email', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(emailData),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to send emails');
//       }
      
//       // Reset form and close dialog
//       setEmailDialogOpen(false);
//       setEmailSubject('');
//       editor?.commands.setContent('<p>Enter your email content here...</p>');
      
//       toast.success(`Emails sent to ${selectedParticipantsData.length} participants`);
//     } catch (error) {
//       console.error('Error sending emails:', error);
//       toast.error('Failed to send emails. Please try again.');
//     } finally {
//       setSendingEmail(false);
//     }
//   };

//   // Update attendance status
//   const updateAttendanceStatus = async (participantId: string, status: 'CONFIRMED' | 'ATTENDED' | 'ABSENT') => {
//     try {
//       await networkingEventAdminService.updateAttendanceStatus(participantId, status);
      
//       // Update local state
//       setParticipants(prev => 
//         prev.map(p => 
//           p.id === participantId ? { ...p, attendanceStatus: status } : p
//         )
//       );
      
//       toast.success(`Attendance status updated to ${status}`);
//     } catch (error) {
//       console.error('Error updating attendance status:', error);
//       toast.error('Failed to update attendance status');
//     }
//   };

//   // Verify payment
//   const verifyPayment = async (participantId: string, isVerified: boolean, notes?: string) => {
//     try {
//       await networkingEventAdminService.verifyPayment(participantId, isVerified, notes);
      
//       // Update local state
//       setParticipants(prev => 
//         prev.map(p => 
//           p.id === participantId ? { ...p, paymentVerified: isVerified, notes } : p
//         )
//       );
      
//       toast.success(`Payment ${isVerified ? 'verified' : 'rejected'}`);
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       toast.error('Failed to verify payment');
//     }
//   };

//   // Helper functions
//   const formatDate = (date: Date | undefined) => {
//     if (!date) return 'N/A';
//     return new Date(date).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getMembershipStatusLabel = (status: MembershipStatus) => {
//     switch (status) {
//       case 'FUNGSIONARIS':
//         return 'Fungsionaris';
//       case 'NON_FUNGSIONARIS':
//         return 'Non-Fungsionaris';
//       default:
//         return status;
//     }
//   };

//   const getPositionLabel = (position: string) => {
//     switch (position) {
//       case 'PENGURUS_INTI':
//         return 'Pengurus Inti';
//       case 'KEPALA_WAKIL_KEPALA_BIDANG':
//         return 'Kepala/Wakil Kepala Bidang';
//       case 'STAF':
//         return 'Staf';
//       case 'ANGGOTA':
//         return 'Anggota';
//       default:
//         return position;
//     }
//   };

//   const getStatusBadgeColor = (status: string | undefined) => {
//     switch (status) {
//       case 'CONFIRMED':
//         return 'bg-yellow-500';
//       case 'ATTENDED':
//         return 'bg-green-500';
//       case 'ABSENT':
//         return 'bg-red-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-zinc-950 text-white">
//         <AdminNavbar />
//         <div className="container mx-auto pt-24 px-4">
//           <div className="flex items-center justify-center h-64">
//             <RefreshCw className="animate-spin h-8 w-8 mr-2" />
//             <span>Loading participants data...</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-zinc-950 text-white">
//         <AdminNavbar />
//         <div className="container mx-auto pt-24 px-4">
//           <Alert variant="destructive">
//             <AlertDescription>
//               {error}
//               <Button variant="outline" className="ml-4" onClick={() => window.location.reload()}>
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Retry
//               </Button>
//             </AlertDescription>
//           </Alert>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white">
//       <AdminNavbar />
//       <div className="container mx-auto pt-24 px-4 pb-12">
//         <div className="flex flex-col gap-6">
//           {/* Dashboard Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold">Networking Event Participants</h1>
//               <p className="text-gray-400">Manage and communicate with all networking event participants</p>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 variant="outline"
//                 onClick={exportToCSV}
//                 disabled={filteredParticipants.length === 0}
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Export to CSV ({filteredParticipants.length})
//               </Button>
//               <Button
//                 variant="default"
//                 onClick={() => setEmailDialogOpen(true)}
//                 disabled={selectedParticipants.length === 0}
//               >
//                 <Mail className="h-4 w-4 mr-2" />
//                 Email Selected ({selectedParticipants.length})
//               </Button>
//             </div>
//           </div>

//           {/* Search and Filters */}
//           <Card className="bg-zinc-900 border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center">
//                 <Filter className="h-5 w-5 mr-2" />
//                 Search & Filters
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col gap-4">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   {/* Search Bar */}
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                     <Input
//                       placeholder="Search by name, WhatsApp, business..."
//                       className="pl-10 bg-zinc-800 border-zinc-700"
//                       value={filters.searchQuery}
//                       onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
//                     />
//                   </div>

//                   {/* Filter by Membership Status */}
//                   <div className="w-full md:w-56">
//                     <Select
//                       value={filters.membershipStatus}
//                       onValueChange={(value) => setFilters({...filters, membershipStatus: value as any})}
//                     >
//                       <SelectTrigger className="bg-zinc-800 border-zinc-700">
//                         <SelectValue placeholder="Membership Status" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-zinc-800 border-zinc-700">
//                         <SelectItem value="ALL">All Statuses</SelectItem>
//                         <SelectItem value="FUNGSIONARIS">Fungsionaris</SelectItem>
//                         <SelectItem value="NON_FUNGSIONARIS">Non-Fungsionaris</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Filter by Business Status */}
//                   <div className="w-full md:w-56">
//                     <Select
//                       value={String(filters.hasBusiness)}
//                       onValueChange={(value) => setFilters({...filters, hasBusiness: value === 'ALL' ? 'ALL' : value === 'true'})}
//                     >
//                       <SelectTrigger className="bg-zinc-800 border-zinc-700">
//                         <SelectValue placeholder="Business Status" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-zinc-800 border-zinc-700">
//                         <SelectItem value="ALL">All Business Statuses</SelectItem>
//                         <SelectItem value="true">Has Business</SelectItem>
//                         <SelectItem value="false">No Business</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Filter by Attendance Status */}
//                   <div className="w-full md:w-56">
//                     <Select
//                       value={filters.attendanceStatus}
//                       onValueChange={(value) => setFilters({...filters, attendanceStatus: value as any})}
//                     >
//                       <SelectTrigger className="bg-zinc-800 border-zinc-700">
//                         <SelectValue placeholder="Attendance Status" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-zinc-800 border-zinc-700">
//                         <SelectItem value="ALL">All Attendance Statuses</SelectItem>
//                         <SelectItem value="NOT_CONFIRMED">Not Confirmed</SelectItem>
//                         <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//                         <SelectItem value="ATTENDED">Attended</SelectItem>
//                         <SelectItem value="ABSENT">Absent</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* Applied Filters & Reset */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex flex-wrap gap-2">
//                     {filters.membershipStatus !== 'ALL' && (
//                       <Badge variant="secondary" className="flex items-center gap-1">
//                         Membership: {getMembershipStatusLabel(filters.membershipStatus as MembershipStatus)}
//                         <XCircle 
//                           className="h-3.5 w-3.5 cursor-pointer ml-1" 
//                           onClick={() => setFilters({...filters, membershipStatus: 'ALL'})} 
//                         />
//                       </Badge>
//                     )}
//                     {filters.hasBusiness !== 'ALL' && (
//                       <Badge variant="secondary" className="flex items-center gap-1">
//                         Business: {filters.hasBusiness ? 'Yes' : 'No'}
//                         <XCircle 
//                           className="h-3.5 w-3.5 cursor-pointer ml-1" 
//                           onClick={() => setFilters({...filters, hasBusiness: 'ALL'})} 
//                         />
//                       </Badge>
//                     )}
//                     {filters.attendanceStatus !== 'ALL' && (
//                       <Badge variant="secondary" className="flex items-center gap-1">
//                         Attendance: {filters.attendanceStatus === 'NOT_CONFIRMED' ? 'Not Confirmed' : filters.attendanceStatus}
//                         <XCircle 
//                           className="h-3.5 w-3.5 cursor-pointer ml-1" 
//                           onClick={() => setFilters({...filters, attendanceStatus: 'ALL'})} 
//                         />
//                       </Badge>
//                     )}
//                     {filters.searchQuery && (
//                       <Badge variant="secondary" className="flex items-center gap-1">
//                         Search: {filters.searchQuery}
//                         <XCircle 
//                           className="h-3.5 w-3.5 cursor-pointer ml-1" 
//                           onClick={() => setFilters({...filters, searchQuery: ''})} 
//                         />
//                       </Badge>
//                     )}
//                   </div>
//                   <Button 
//                     variant="ghost" 
//                     onClick={resetFilters}
//                     disabled={
//                       filters.membershipStatus === 'ALL' && 
//                       filters.hasBusiness === 'ALL' && 
//                       filters.attendanceStatus === 'ALL' && 
//                       !filters.searchQuery
//                     }
//                   >
//                     <RefreshCw className="h-4 w-4 mr-2" />
//                     Reset Filters
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Participants Table */}
//           <Card className="bg-zinc-900 border-zinc-800">
//             <CardHeader className="pb-2">
//               <CardTitle className="text-lg flex items-center justify-between">
//                 <span>Participants ({filteredParticipants.length})</span>
//                 {selectedParticipants.length > 0 && (
//                   <div className="flex items-center">
//                     <Badge variant="outline" className="mr-2">
//                       {selectedParticipants.length} selected
//                     </Badge>
//                     <Button 
//                       variant="ghost" 
//                       size="sm"
//                       onClick={() => setSelectedParticipants([])}
//                     >
//                       Clear
//                     </Button>
//                   </div>
//                 )}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {filteredParticipants.length > 0 ? (
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead className="w-[40px]">
//                           <Checkbox 
//                             checked={selectAll} 
//                             onCheckedChange={() => setSelectAll(!selectAll)}
//                           />
//                         </TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>WhatsApp</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Business</TableHead>
//                         <TableHead>Payment</TableHead>
//                         <TableHead>Attendance</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredParticipants.map((participant) => (
//                         <TableRow key={participant.id}>
//                           <TableCell>
//                             <Checkbox 
//                               checked={selectedParticipants.includes(participant.id)} 
//                               onCheckedChange={() => toggleParticipantSelection(participant.id)}
//                             />
//                           </TableCell>
//                           <TableCell className="font-medium">
//                             {participant.name}
//                             <div className="text-xs text-gray-400">
//                               {getPositionLabel(participant.position)}
//                             </div>
//                           </TableCell>
//                           <TableCell>{participant.whatsappNumber}</TableCell>
//                           <TableCell>
//                             <Badge variant={participant.membershipStatus === 'FUNGSIONARIS' ? "default" : "secondary"}>
//                               {getMembershipStatusLabel(participant.membershipStatus)}
//                             </Badge>
//                             {participant.membershipStatus === 'NON_FUNGSIONARIS' && participant.hipmiPtOrigin && (
//                               <div className="text-xs text-gray-400 mt-1">
//                                 {participant.hipmiPtOrigin}
//                               </div>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {participant.hasBusiness ? (
//                               <div>
//                                 <Badge variant="outline" className="bg-green-950 text-green-400 border-green-700">
//                                   Yes
//                                 </Badge>
//                                 <div className="text-xs mt-1">
//                                   {participant.business?.name}
//                                 </div>
//                                 <div className="text-xs text-gray-400">
//                                   {participant.business?.field}
//                                 </div>
//                               </div>
//                             ) : (
//                               <Badge variant="outline" className="bg-zinc-800 text-zinc-400 border-zinc-700">
//                                 No
//                               </Badge>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {participant.paymentProofURL ? (
//                               <div className="flex flex-col gap-1">
//                                 <Badge 
//                                   variant="outline" 
//                                   className={
//                                     participant.paymentVerified === true 
//                                       ? "bg-green-950 text-green-400 border-green-700" 
//                                       : participant.paymentVerified === false
//                                         ? "bg-red-950 text-red-400 border-red-700"
//                                         : "bg-yellow-950 text-yellow-400 border-yellow-700"
//                                   }
//                                 >
//                                   {participant.paymentVerified === true 
//                                     ? "Verified" 
//                                     : participant.paymentVerified === false
//                                       ? "Rejected"
//                                       : "Pending"
//                                   }
//                                 </Badge>
//                                 <div className="text-xs text-gray-400">
//                                   {participant.paymentDate ? formatDate(participant.paymentDate) : 'N/A'}
//                                 </div>
//                               </div>
//                             ) : (
//                               <Badge variant="outline" className="bg-red-950 text-red-400 border-red-700">
//                                 Not Submitted
//                               </Badge>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             {participant.attendanceStatus ? (
//                               <Badge 
//                                 className={getStatusBadgeColor(participant.attendanceStatus)}
//                               >
//                                 {participant.attendanceStatus}
//                               </Badge>
//                             ) : (
//                               <Badge variant="outline">
//                                 Not Confirmed
//                               </Badge>
//                             )}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex justify-end gap-2">
//                               <TooltipProvider>
//                                 <DropdownMenu>
//                                   <Tooltip>
//                                     <TooltipTrigger asChild>
//                                       <DropdownMenuTrigger asChild>
//                                         <Button variant="ghost" size="icon">
//                                           <ChevronDown className="h-4 w-4" />
//                                         </Button>
//                                       </DropdownMenuTrigger>
//                                     </TooltipTrigger>
//                                     <TooltipContent>
//                                       <p>Actions</p>
//                                     </TooltipContent>
//                                   </Tooltip>
//                                   <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800">
//                                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                     <DropdownMenuSeparator />
                                    
//                                     {/* View Details */}
//                                     <DropdownMenuItem>
//                                       <Eye className="mr-2 h-4 w-4" />
//                                       <span>View Details</span>
//                                     </DropdownMenuItem>
                                    
//                                     {/* Payment Actions */}
//                                     {participant.paymentProofURL && !participant.paymentVerified && (
//                                       <>
//                                         <DropdownMenuSeparator />
//                                         <DropdownMenuLabel>Payment</DropdownMenuLabel>
//                                         <DropdownMenuItem onClick={() => verifyPayment(participant.id, true)}>
//                                           <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
//                                           <span>Verify Payment</span>
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem onClick={() => verifyPayment(participant.id, false)}>
//                                           <XCircle className="mr-2 h-4 w-4 text-red-500" />
//                                           <span>Reject Payment</span>
//                                         </DropdownMenuItem>
//                                       </>
//                                     )}
                                    
//                                     {/* Attendance Actions */}
//                                     <DropdownMenuSeparator />
//                                     <DropdownMenuLabel>Attendance</DropdownMenuLabel>
//                                     <DropdownMenuItem 
//                                       onClick={() => updateAttendanceStatus(participant.id, 'CONFIRMED')}
//                                       className={participant.attendanceStatus === 'CONFIRMED' ? "bg-yellow-900/20" : ""}
//                                     >
//                                       <CheckCircle className="mr-2 h-4 w-4 text-yellow-500" />
//                                       <span>Mark as Confirmed</span>
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem 
//                                       onClick={() => updateAttendanceStatus(participant.id, 'ATTENDED')}
//                                       className={participant.attendanceStatus === 'ATTENDED' ? "bg-green-900/20" : ""}
//                                     >
//                                       <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
//                                       <span>Mark as Attended</span>
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem 
//                                       onClick={() => updateAttendanceStatus(participant.id, 'ABSENT')}
//                                       className={participant.attendanceStatus === 'ABSENT' ? "bg-red-900/20" : ""}
//                                     >
//                                       <XCircle className="mr-2 h-4 w-4 text-red-500" />
//                                       <span>Mark as Absent</span>
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </TooltipProvider>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               ) : (
//                 <div className="text-center py-8">
//                   <FileX className="h-12 w-12 mx-auto text-gray-500 mb-3" />
//                   <h3 className="text-lg font-medium">No participants found</h3>
//                   <p className="text-sm text-gray-400">
//                     {participants.length > 0 
//                       ? "Try adjusting your filters to see more results." 
//                       : "There are no registered participants yet."}
//                   </p>
//                   {participants.length > 0 && (
//                     <Button variant="outline" className="mt-4" onClick={resetFilters}>
//                       <RefreshCw className="h-4 w-4 mr-2" />
//                       Reset Filters
//                     </Button>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//             <CardFooter className="flex justify-between border-t border-zinc-800 pt-4">
//               <div className="text-sm text-gray-400">
//                 Showing {filteredParticipants.length} of {participants.length} participants
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                   Refresh Data
//                 </Button>
//               </div>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
      
//       {/* Email Dialog */}
//       <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
//         <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Send Email to Participants</DialogTitle>
//             <DialogDescription>
//               You are about to send an email to {selectedParticipants.length} selected participants.
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email-subject">Subject</Label>
//               <Input
//                 id="email-subject"
//                 placeholder="Email subject"
//                 className="bg-zinc-800 border-zinc-700"
//                 value={emailSubject}
//                 onChange={(e) => setEmailSubject(e.target.value)}
//               />
//             </div>
            
//             <div className="space-y-2">
//               <Label>Content</Label>
              
//               {/* TipTap Editor Toolbar */}
//               <div className="bg-zinc-800 border border-zinc-700 rounded-t-md p-2 flex flex-wrap gap-1">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleBold().run()}
//                   data-active={editor?.isActive('bold')}
//                   className={editor?.isActive('bold') ? 'bg-zinc-700' : ''}
//                 >
//                   <Bold className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleItalic().run()}
//                   data-active={editor?.isActive('italic')}
//                   className={editor?.isActive('italic') ? 'bg-zinc-700' : ''}
//                 >
//                   <Italic className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
//                   data-active={editor?.isActive('heading', { level: 1 })}
//                   className={editor?.isActive('heading', { level: 1 }) ? 'bg-zinc-700' : ''}
//                 >
//                   <Heading1 className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
//                   data-active={editor?.isActive('heading', { level: 2 })}
//                   className={editor?.isActive('heading', { level: 2 }) ? 'bg-zinc-700' : ''}
//                 >
//                   <Heading2 className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleBulletList().run()}
//                   data-active={editor?.isActive('bulletList')}
//                   className={editor?.isActive('bulletList') ? 'bg-zinc-700' : ''}
//                 >
//                   <List className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().toggleOrderedList().run()}
//                   data-active={editor?.isActive('orderedList')}
//                   className={editor?.isActive('orderedList') ? 'bg-zinc-700' : ''}
//                 >
//                   <ListOrdered className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().undo().run()}
//                 >
//                   <Undo className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => editor?.chain().focus().redo().run()}
//                 >
//                   <Redo className="h-4 w-4" />
//                 </Button>
//               </div>
              
//               {/* TipTap Editor Content */}
//               <div className="min-h-[200px] bg-zinc-800 border border-zinc-700 border-t-0 rounded-b-md p-4">
//                 <EditorContent editor={editor} className="prose prose-invert max-w-none" />
//               </div>
//             </div>
            
//             {/* Template Selector */}
//             <div className="space-y-2">
//               <Label>Templates</Label>
//               <Select onValueChange={(value) => {
//                 // Set predefined templates based on value
//                 if (value === 'confirmation') {
//                   setEmailSubject('Networking Event - Registration Confirmation');
//                   editor?.commands.setContent(`
//                     <h2>Registration Confirmation</h2>
//                     <p>Dear Participant,</p>
//                     <p>Thank you for registering for our upcoming Networking Night event. Your registration has been received and is being processed.</p>
//                     <p>Event details:</p>
//                     <ul>
//                       <li><strong>Date:</strong> [Event Date]</li>
//                       <li><strong>Time:</strong> [Event Time]</li>
//                       <li><strong>Venue:</strong> [Event Venue]</li>
//                     </ul>
//                     <p>Please make sure to complete your payment if you haven't already. We look forward to seeing you!</p>
//                     <p>Best regards,<br>HIPMI PT UI Team</p>
//                   `);
//                 } else if (value === 'reminder') {
//                   setEmailSubject('Networking Event - Important Reminder');
//                   editor?.commands.setContent(`
//                     <h2>Event Reminder</h2>
//                     <p>Dear Participant,</p>
//                     <p>This is a friendly reminder about our upcoming Networking Night event. We are excited to have you join us!</p>
//                     <p>Event details:</p>
//                     <ul>
//                       <li><strong>Date:</strong> [Event Date]</li>
//                       <li><strong>Time:</strong> [Event Time]</li>
//                       <li><strong>Venue:</strong> [Event Venue]</li>
//                     </ul>
//                     <p>Please don't forget to bring your ID and confirmation email for smooth check-in.</p>
//                     <p>If you have any questions, feel free to contact us.</p>
//                     <p>Best regards,<br>HIPMI PT UI Team</p>
//                   `);
//                 } else if (value === 'payment') {
//                   setEmailSubject('Networking Event - Payment Confirmation Required');
//                   editor?.commands.setContent(`
//                     <h2>Payment Confirmation Required</h2>
//                     <p>Dear Participant,</p>
//                     <p>We noticed that we haven't received your payment confirmation for the upcoming Networking Night event.</p>
//                     <p>To secure your spot, please complete the payment and upload your payment proof through your registration account.</p>
//                     <p>Payment details:</p>
//                     <ul>
//                       <li><strong>Bank Account:</strong> [Bank Account]</li>
//                       <li><strong>Account Number:</strong> [Account Number]</li>
//                       <li><strong>Account Name:</strong> [Account Name]</li>
//                       <li><strong>Amount:</strong> [Amount]</li>
//                     </ul>
//                     <p>The deadline for payment is [Payment Deadline]. Please ensure your payment is completed before then.</p>
//                     <p>Best regards,<br>HIPMI PT UI Team</p>
//                   `);
//                 } else if (value === 'thank-you') {
//                   setEmailSubject('Thank You for Attending Our Networking Event');
//                   editor?.commands.setContent(`
//                     <h2>Thank You for Attending</h2>
//                     <p>Dear Participant,</p>
//                     <p>Thank you for attending our Networking Night event. We hope you had a great time and made valuable connections.</p>
//                     <p>We would love to hear your feedback about the event. Please take a moment to fill out our feedback form [link to feedback form].</p>
//                     <p>Stay connected with us on social media for updates on future events:</p>
//                     <ul>
//                       <li>Instagram: @hipmiui</li>
//                       <li>Twitter: @hipmiui</li>
//                       <li>LinkedIn: HIPMI PT UI</li>
//                     </ul>
//                     <p>Best regards,<br>HIPMI PT UI Team</p>
//                   `);
//                 }
//               }}>
//                 <SelectTrigger className="bg-zinc-800 border-zinc-700">
//                   <SelectValue placeholder="Select a template" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-zinc-800 border-zinc-700">
//                   <SelectItem value="confirmation">Registration Confirmation</SelectItem>
//                   <SelectItem value="reminder">Event Reminder</SelectItem>
//                   <SelectItem value="payment">Payment Reminder</SelectItem>
//                   <SelectItem value="thank-you">Thank You Message</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button 
//               disabled={!emailSubject || !editor?.getText() || sendingEmail}
//               onClick={sendEmail}
//             >
//               {sendingEmail ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                   Sending...
//                 </>
//               ) : (
//                 <>
//                   <Send className="h-4 w-4 mr-2" />
//                   Send Email
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }