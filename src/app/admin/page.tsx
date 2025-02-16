"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, X, Clock } from 'lucide-react';
import { Competition } from "@/models/Competition";
import { Team } from "@/models/Team";
import { adminService } from '@/lib/firebase/competitionService';
import { db } from '@/lib/firebase/firebase';
import { doc, collection, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { COMPETITION_NAMES, STAGE_NAMES, initialCompetitions } from '@/lib/competitionData';

const AdminDashboard = () => {
  const [selectedCompetition, setSelectedCompetition] = useState<string>(initialCompetitions[0].id);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);

// Add function to initialize competitions in Firebase if they don't exist
const initializeCompetitions = async () => {
  try {
    setLoading(true);
    const completedCompetitions = initialCompetitions.map(comp => ({
      ...comp,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Add competitions to Firebase if they don't exist
    for (const competition of completedCompetitions) {
      const docRef = doc(db, 'competitions', competition.id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        console.log(`Initializing competition ${competition.id} in Firebase...`);
        await setDoc(docRef, competition);
      } else {
        console.log(`Competition ${competition.id} already exists in Firebase.`);
      }
    }

    // Get all competitions from Firebase
    const competitionsRef = collection(db, 'competitions');
    const competitionsSnapshot = await getDocs(competitionsRef);
    const competitionsData = competitionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        registrationDeadline: data.registrationDeadline?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        stages: Object.entries(data.stages || {}).reduce((acc, [key, value]: [string, any]) => ({
          ...acc,
          [key]: {
            ...value,
            deadline: value.deadline?.toDate() || new Date()
          }
        }), {})
      };
    }) as Competition[];

    setCompetitions(competitionsData);
  } catch (error) {
    console.error('Error initializing competitions:', error);
    setError('Failed to initialize competitions');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    initializeCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompetition) {
      loadTeamsForCompetition(selectedCompetition);
    }
  }, [selectedCompetition]);

  const loadTeamsForCompetition = async (competitionId: string) => {
    try {
      setLoading(true);
      const teamsData = await adminService.getTeamsByCompetition(competitionId);
      setTeams(teamsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDescription = async (description: string) => {
    try {
      await adminService.updateCompetition(selectedCompetition, { description });
      setCompetitions(prevState => 
        prevState.map(comp => 
          comp.id === selectedCompetition 
            ? { ...comp, description } 
            : comp
        )
      );
    } catch (err) {
      setError('Failed to update competition description');
    }
  };

  const handleUpdateStatus = async (teamId: string, status: 'approved' | 'rejected') => {
    try {
      await adminService.updateRegistrationStatus(teamId, status);
      await loadTeamsForCompetition(selectedCompetition);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleUpdateStage = async (
    teamId: string,
    stageNumber: number,
    status: 'cleared' | 'rejected',
    feedback?: string
  ) => {
    try {
      await adminService.updateStageClearance(teamId, stageNumber, status, feedback);
      await loadTeamsForCompetition(selectedCompetition);
    } catch (err) {
      setError('Failed to update stage');
    }
  };

  const handleGuidelineUpload = async (
    stageNumber: number,
    file: File,
    description: string
  ) => {
    try {
      await adminService.updateStageGuideline(selectedCompetition, stageNumber, file, description);
      // Update local state
      setCompetitions(prevState =>
        prevState.map(comp =>
          comp.id === selectedCompetition
            ? {
                ...comp,
                stages: {
                  ...comp.stages,
                  [stageNumber]: {
                    ...comp.stages[stageNumber],
                    description,
                  },
                },
              }
            : comp
        )
      );
    } catch (err) {
      setError('Failed to upload guideline');
    }
  };

  const getCurrentCompetition = () => 
    competitions.find(comp => comp.id === selectedCompetition);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Competition Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Competition Selector */}
          <div className="mb-6">
            <select
              value={selectedCompetition}
              onChange={(e) => setSelectedCompetition(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="stages">Stages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>{getCurrentCompetition()?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <Textarea
                        value={getCurrentCompetition()?.description}
                        onChange={(e) => handleUpdateDescription(e.target.value)}
                        placeholder="Enter competition description..."
                        className="h-32"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Registration Deadline</h3>
                      <p>{new Date(getCurrentCompetition()?.registrationDeadline || '').toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Team Leader
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teams.map(team => (
                      <tr key={team.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {team.teamName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {team.teamLeader.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {team.registrationStatus === 'pending' && <Clock className="text-yellow-500" />}
                            {team.registrationStatus === 'approved' && <Check className="text-green-500" />}
                            {team.registrationStatus === 'rejected' && <X className="text-red-500" />}
                            <span className="text-sm capitalize">{team.registrationStatus}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(team.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              disabled={team.registrationStatus === 'approved'}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(team.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              disabled={team.registrationStatus === 'rejected'}
                            >
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="stages">
              <div className="space-y-6">
                {Object.entries(getCurrentCompetition()?.stages || {}).map(([stageNumber, stage]) => (
                  <Card key={stageNumber}>
                    <CardHeader>
                      <CardTitle>Stage {stageNumber}: {stage.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Deadline</h4>
                          <p>{new Date(stage.deadline).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Guidelines</h4>
                          <Input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleGuidelineUpload(
                                  parseInt(stageNumber),
                                  e.target.files[0],
                                  stage.description
                                );
                              }
                            }}
                            className="mb-2"
                          />
                          <Textarea
                            value={stage.description}
                            placeholder="Stage guidelines description..."
                            onChange={(e) => {
                              const file = new File([""], "placeholder.txt", { type: "text/plain" });
                              handleGuidelineUpload(parseInt(stageNumber), file, e.target.value);
                            }}
                            className="h-24"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Visibility</h4>
                          <Button
                            variant="outline"
                            onClick={() => {
                              adminService.updateCompetition(selectedCompetition, {
                                stages: {
                                  ...getCurrentCompetition()?.stages,
                                  [stageNumber]: {
                                    ...stage,
                                    visibility: !stage.visibility
                                  }
                                }
                              });
                            }}
                          >
                            {stage.visibility ? 'Hide Stage' : 'Show Stage'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminDashboard;