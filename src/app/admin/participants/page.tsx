"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';
import { adminService } from '@/lib/firebase/competitionService';
import { db } from '@/lib/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { SubmissionViewer } from '@/components/admin/SubmissionViewer';
import { Search } from 'lucide-react';
import AdminNavbar from '@/components/admin/NavbarAdmin';

interface TeamManagementDashboardProps {}

type RegistrationStatus = 'all' | 'pending' | 'approved' | 'rejected';
type StageStatus = 'all' | 'pending' | 'cleared' | 'rejected';

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  description: string;
  action: () => Promise<void>;
}

const TeamManagementDashboard: React.FC<TeamManagementDashboardProps> = () => {
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StageStatus>('all');
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('all');
  const [checkPreviousStages, setCheckPreviousStages] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    description: '',
    action: async () => {},
  });

  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router, loading]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const competitionsRef = collection(db, 'competitions');
        const snapshot = await getDocs(competitionsRef);
        const competitionsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Competition[];
        setCompetitions(competitionsData);
        
        if (competitionsData.length > 0) {
          setSelectedCompetition(competitionsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setError('Failed to fetch competitions');
      }
    };

    fetchCompetitions();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!selectedCompetition) return;
      
      try {
        setLoading(true);
        const teams = await adminService.getTeamsByCompetition(selectedCompetition);
        setTeams(teams);
        setFilteredTeams(teams);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setError('Failed to fetch teams');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [selectedCompetition]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    handleStageFilter();
  };

  const handleStageFilter = () => {
    if (!selectedCompetition) return;

    let filtered = [...teams];

    // Apply registration status filter first
    if (registrationStatus !== 'all') {
      filtered = filtered.filter(team => team.registrationStatus === registrationStatus);
    }

    // Apply stage filter if selected
    if (selectedStage !== 'all') {
      filtered = filtered.filter(team => {
        const stageData = team.stages[Number(selectedStage)];
        if (!stageData) return false;

        // Only apply progression checks if checkbox is checked
        if (checkPreviousStages) {
          const stageNumber = Number(selectedStage);
          
          switch (stageNumber) {
            case 1:
              if (team.registrationStatus !== 'approved') return false;
              break;
            
            case 2:
              if (team.stages[1]?.status !== 'cleared') return false;
              break;
            
            case 3:
              if (team.stages[1]?.status !== 'cleared' || 
                  team.stages[2]?.status !== 'cleared' || 
                  !team?.paidStatus) return false;
              break;
          }
        }

        // Apply status filter if selected
        if (selectedStatus !== 'all') {
          return stageData.status === selectedStatus;
        }

        return true;
      });
    }

    // Apply search filter if there's a search term
// Apply search filter if there's a search term
if (searchTerm.trim()) {
  const term = searchTerm.trim().toLowerCase();
  filtered = filtered.filter(team => {
    // Basic search in team name and member names/emails
    const basicSearch = 
      team.teamName.toLowerCase().includes(term) ||
      team.teamLeader.name.toLowerCase().includes(term) ||
      (team.teamLeader.email || '').toLowerCase().includes(term) ||
      (team.members.member1?.name || '').toLowerCase().includes(term) ||
      (team.members.member2?.name || '').toLowerCase().includes(term) ||
      (team.members.member1?.email || '').toLowerCase().includes(term) ||
      (team.members.member2?.email || '').toLowerCase().includes(term);
      
    // Extended search in new fields
    const extendedSearch =
      // Team leader extended fields
      (team.teamLeader.phone || '').toLowerCase().includes(term) ||
      (team.teamLeader.institution || '').toLowerCase().includes(term) ||
      (team.teamLeader.major || '').toLowerCase().includes(term) ||
      (team.teamLeader.batchYear || '').toLowerCase().includes(term) ||
      // Member 1 extended fields
      (team.members.member1?.phone || '').toLowerCase().includes(term) ||
      (team.members.member1?.institution || '').toLowerCase().includes(term) ||
      (team.members.member1?.major || '').toLowerCase().includes(term) ||
      (team.members.member1?.batchYear || '').toLowerCase().includes(term) ||
      // Member 2 extended fields
      (team.members.member2?.phone || '').toLowerCase().includes(term) ||
      (team.members.member2?.institution || '').toLowerCase().includes(term) ||
      (team.members.member2?.major || '').toLowerCase().includes(term) ||
      (team.members.member2?.batchYear || '').toLowerCase().includes(term);
      
    return basicSearch || extendedSearch;
  });
}

    setFilteredTeams(filtered);
  };

  useEffect(() => {
    handleStageFilter();
  }, [selectedStage, selectedStatus, checkPreviousStages, registrationStatus, teams, searchTerm]);

  const handleRegistrationUpdate = async (teamId: string, status: 'approved' | 'rejected') => {
    setConfirmDialog({
      isOpen: true,
      title: `Confirm ${status === 'approved' ? 'Approval' : 'Rejection'}`,
      description: `Are you sure you want to ${status} this team's registration?`,
      action: async () => {
        try {
          await adminService.updateRegistrationStatus(teamId, status);
          
          // Update both teams and filteredTeams directly
          const updatedTeams = teams.map(team => 
            team.id === teamId 
              ? { ...team, registrationStatus: status }
              : team
          );
          setTeams(updatedTeams);
          
          // Also directly update the filtered teams
          const updatedFilteredTeams = filteredTeams.map(team => 
            team.id === teamId 
              ? { ...team, registrationStatus: status }
              : team
          );
          setFilteredTeams(updatedFilteredTeams);
          
          // Close the dialog
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          setError('Failed to update registration status');
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

// Update the handleStageClearance function
const handleStageClearance = async (
  teamId: string,
  stageNumber: number,
  status: 'cleared' | 'rejected',
  feedback?: string
) => {
  setConfirmDialog({
    isOpen: true,
    title: `Confirm Stage ${status === 'cleared' ? 'Clearance' : 'Rejection'}`,
    description: `Are you sure you want to mark this stage as ${status}?`,
    action: async () => {
      try {
        await adminService.updateStageClearance(teamId, stageNumber, status, feedback);
        
        // Update both teams and filteredTeams states
        const updatedTeams = teams.map(team => {
          if (team.id === teamId) {
            const updatedStages = {
              ...team.stages,
              [stageNumber]: {
                ...team.stages[stageNumber],
                status,
                ...(feedback && { feedback })
              }
            };
            return {
              ...team,
              stages: updatedStages
            };
          }
          return team;
        });

        setTeams(updatedTeams);
        
        // Update filteredTeams to reflect the new status
        const updatedFilteredTeams = filteredTeams.map(team => {
          if (team.id === teamId) {
            const updatedStages = {
              ...team.stages,
              [stageNumber]: {
                ...team.stages[stageNumber],
                status,
                ...(feedback && { feedback })
              }
            };
            return {
              ...team,
              stages: updatedStages
            };
          }
          return team;
        });

        setFilteredTeams(updatedFilteredTeams);
      } catch (error) {
        console.error(error);
        setError('Failed to update stage status');
      } finally {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    }
  });
};

// Update the stage action buttons rendering
const renderStageActions = (team: Team, stageNumber: string | number, submission: any) => {
  if (!submission.submissionURL) {
    return <span className="text-gray-500 italic">Awaiting submission</span>;
  }

  return (
    <>
      {submission.status === 'pending' && (
        <>
          <Button
            onClick={() => handleStageClearance(team.id, Number(stageNumber), 'cleared')}
            className="w-full bg-green-500 hover:bg-green-600 text-white mb-2"
          >
            Clear
          </Button>
          <Button
            onClick={() => handleStageClearance(team.id, Number(stageNumber), 'rejected')}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            Reject
          </Button>
        </>
      )}
      {submission.status === 'cleared' && (
        <Button
          onClick={() => handleStageClearance(team.id, Number(stageNumber), 'rejected')}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Reject
        </Button>
      )}
      {submission.status === 'rejected' && (
        <Button
          onClick={() => handleStageClearance(team.id, Number(stageNumber), 'cleared')}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          Clear
        </Button>
      )}
    </>
  );
};

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Not set';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueStages = () => {
    const stages = new Set<string>();
    teams.forEach(team => {
      Object.keys(team.stages || {}).forEach(stage => stages.add(stage));
    });
    return Array.from(stages).sort((a, b) => Number(a) - Number(b));
  };

  const getStatusBadge = (status: string): string => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cleared: 'bg-green-100 text-green-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <AdminNavbar></AdminNavbar>
      <Card className="mb-6 py-12">
        <CardHeader>
          <CardTitle>Team Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>

            <select
              value={registrationStatus}
              onChange={(e) => setRegistrationStatus(e.target.value as RegistrationStatus)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="all">All Registrations</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="registration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="registration">Registration Management</TabsTrigger>
          <TabsTrigger value="stages">Stage Management</TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <Card>
            <CardHeader>
              <CardTitle>Team Registrations</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
              <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Team Members</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.teamName}</TableCell>
                      <TableCell>
  <div className="space-y-2">
    <div className="border-b pb-2">
      <span className="font-medium text-gray-700">Team Leader:</span>
      <div className="text-sm">
        {team.teamLeader.name}
        <br />
        <span className="text-gray-500">{team.teamLeader.email}</span>
        {team.teamLeader.phone && (
          <>
            <br />
            <span className="text-gray-500">{team.teamLeader.phone|| 'No Phone'}</span>
          </>
        )}
        {team.teamLeader.institution && (
          <>
            <br />
            <span className="text-gray-500 italic">{team.teamLeader.institution|| 'N/A'}</span>
          </>
        )}
        {team.teamLeader.major && (
          <>
            <br />
            <span className="text-gray-500">{team.teamLeader.major} ({team.teamLeader.batchYear || 'N/A'})</span>
          </>
        )}
      </div>
    </div>
    {team.members.member1 && (
      <div className="border-b pb-2">
        <span className="font-medium text-gray-700">Member 1:</span>
        <div className="text-sm">
          {team.members.member1.name}
          {team.members.member1.email && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member1.email}</span>
            </>
          )}
          {team.members.member1.phone && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member1.phone || 'No Phone'}</span>
            </>
          )}
          {team.members.member1.institution && (
            <>
              <br />
              <span className="text-gray-500 italic">{team.members.member1.institution|| 'N/A'}</span>
            </>
          )}
          {team.members.member1.major && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member1.major} ({team.members.member1.batchYear || 'N/A'})</span>
            </>
          )}
        </div>
      </div>
    )}
    {team.members.member2 && (
      <div>
        <span className="font-medium text-gray-700">Member 2:</span>
        <div className="text-sm">
          {team.members.member2.name}
          {team.members.member2.email && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member2.email}</span>
            </>
          )}
          {team.members.member2.phone && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member2.phone || 'No phone'}</span>
            </>
          )}
          {team.members.member2.institution && (
            <>
              <br />
              <span className="text-gray-500 italic">{team.members.member2.institution || 'N/A'}</span>
            </>
          )}
          {team.members.member2.major && (
            <>
              <br />
              <span className="text-gray-500">{team.members.member2.major} ({team.members.member2.batchYear || 'N/A'})</span>
            </>
          )}
        </div>
      </div>
    )}
  </div>
</TableCell>
                      <TableCell>
                        {team.teamLeader.name}
                        <br />
                        <span className="text-sm text-gray-500">
                          {team.teamLeader.email}
                        </span>
                      </TableCell>
                      <TableCell>Registrated on: {formatDate(team.registrationDate)}
                        <br/>
                        Payment status : {team.paidStatus ? 'Paid' : 'Not Paid'}


                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(team.registrationStatus)}>
                          {team.registrationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="space-x-2">
                            {team.registrationStatus === 'pending' && (
                              <>
                                <Button
                                  onClick={() => handleRegistrationUpdate(team.id, 'approved')}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleRegistrationUpdate(team.id, 'rejected')}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {team.registrationStatus === 'approved' && (
                              <Button
                                onClick={() => handleRegistrationUpdate(team.id, 'rejected')}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Reject
                              </Button>
                            )}
                            {team.registrationStatus === 'rejected' && (
                              <Button
                                onClick={() => handleRegistrationUpdate(team.id, 'approved')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                          {team.registrationDocURL && (
                            <div className="mt-2">
                              <SubmissionViewer
                                submission={{ 
                                  status: team.registrationStatus,
                                  submissionURL: team.registrationDocURL 
                                }}
                                teamName={team.teamName}
                                stageNumber="Registration"
                              />
                            </div>
                          )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredTeams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No teams found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="stages">
            <Card>
              <CardHeader>
                <CardTitle>Stage Management</CardTitle>
                <div className="space-y-4 mt-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search teams..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <select
                      value={selectedStage}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="p-2 border rounded-md flex-1"
                    >
                      <option value="all">All Stages</option>
                      {getUniqueStages().map(stage => (
                        <option key={stage} value={stage}>
                          Stage {stage}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as StageStatus)}
                      className="p-2 border rounded-md flex-1"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="cleared">Cleared</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  {selectedStage !== 'all' && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="checkPreviousStages"
                        checked={checkPreviousStages}
                        onCheckedChange={(checked) => setCheckPreviousStages(checked as boolean)}
                      />
                      <label htmlFor="checkPreviousStages" className="text-sm text-gray-600">
                        Only show teams with all previous stages cleared
                      </label>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeams.map((team) => {
                      const stages = team.stages || {};
                      const stageNumbers = selectedStage === 'all' 
                        ? Object.keys(stages)
                        : [selectedStage];
  
                      return stageNumbers.map((stageNumber) => {
                        const submission = stages[Number(stageNumber)];
                        if (!submission) return null;
  
                        if (selectedStatus !== 'all' && submission.status !== selectedStatus) {
                          return null;
                        }
  
                        return (
                          <TableRow key={`${team.id}-${stageNumber}`}>
                            <TableCell>{team.teamName}</TableCell>
                            <TableCell>Stage {stageNumber}</TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div>{formatDate(submission.submissionDate)}</div>
                                {submission.submissionURL && (
                                  <SubmissionViewer
                                    submission={submission}
                                    teamName={team.teamName}
                                    stageNumber={stageNumber}
                                  />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(submission.status)}>
                                {submission.status}
                              </Badge>
                              {submission.feedback && (
                                <div className="mt-2 text-sm text-gray-600">
                                  Feedback: {submission.feedback}
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
  <div className="space-y-2">
    {renderStageActions(team, stageNumber, submission)}
  </div>
</TableCell>
                          </TableRow>
                        );
                      }).filter(Boolean);
                    })}
                    {filteredTeams.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No submissions found for the selected filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
  
        <AlertDialog 
          open={confirmDialog.isOpen} 
          onOpenChange={(isOpen) => setConfirmDialog(prev => ({ ...prev, isOpen }))}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => confirmDialog.action()}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
  
        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  };
  
  export default TeamManagementDashboard;