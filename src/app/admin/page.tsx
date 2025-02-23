/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { db } from '@/lib/firebase/firebase';
import { doc, collection, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { initialCompetitions } from '@/lib/competitionData';
import CompetitionEditor from '@/components/competition/CompetitionEditor';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/firebase/competitionService';

interface Stage {
  title: string;
  description: string;
  deadline: Date;
  isVisible?: boolean;
  guidelineFileURL: string;
}

interface Competition {
  id: string;
  name: string;
  description: string;
  registrationDeadline: Date;
  stages: Record<string, Stage>;
  createdAt: Date;
  updatedAt: Date;
}

interface AdminDashboardProps {}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [selectedCompetition, setSelectedCompetition] = useState<string>(initialCompetitions[0].id);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [visibilityDialogOpen, setVisibilityDialogOpen] = useState<boolean>(false);
  const [pendingVisibilityChange, setPendingVisibilityChange] = useState<{
    stageId: string;
    isVisible: boolean;
  } | null>(null);
  const [fileUploadDialog, setFileUploadDialog] = useState<{
    isOpen: boolean;
    stageId: string;
    file: File | null;
    description: string;
  } | null>(null);

  const { user, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, router, loading]);
  
  const initializeCompetitions = async (): Promise<void> => {
    try {
      setLoading(true);
      const completedCompetitions = initialCompetitions.map(comp => ({
        ...comp,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
  
      // Initialize competitions in Firestore if they don't exist
      for (const competition of completedCompetitions) {
        const docRef = doc(db, 'competitions', competition.id);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) {
          await setDoc(docRef, {
            ...competition,
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
            registrationDeadline: Timestamp.fromDate(competition.registrationDeadline),
            stages: Object.entries(competition.stages).reduce((acc, [key, stage]) => ({
              ...acc,
              [key]: {
                ...stage,
                deadline: Timestamp.fromDate(stage.deadline)
              }
            }), {})
          });
        }
      }
  
      // Fetch all competitions
      const competitionsRef = collection(db, 'competitions');
      const competitionsSnapshot = await getDocs(competitionsRef);
      const competitionsData = competitionsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          registrationDeadline: data.registrationDeadline?.toDate() || new Date(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
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

  const getCurrentCompetition = (): Competition | undefined => 
    competitions.find(comp => comp.id === selectedCompetition);

  const handleUpdateCompetition = async (
    competitionId: string, 
    updates: Partial<Competition>
  ): Promise<void> => {
    try {
      const docRef = doc(db, 'competitions', competitionId);
      
      // Convert dates to Timestamps for Firestore
      const processedUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
        if (value instanceof Date) {
          return { ...acc, [key]: Timestamp.fromDate(value) };
        }
        if (key === 'stages' && typeof value === 'object') {
          const processedStages = Object.entries(value).reduce((stageAcc, [stageKey, stage]: [string, any]) => ({
            ...stageAcc,
            [stageKey]: {
              ...stage,
              deadline: stage.deadline instanceof Date ? Timestamp.fromDate(stage.deadline) : stage.deadline
            }
          }), {});
          return { ...acc, [key]: processedStages };
        }
        return { ...acc, [key]: value };
      }, {});

      await setDoc(docRef, {
        ...processedUpdates,
        updatedAt: Timestamp.fromDate(new Date())
      }, { merge: true });
      
      setCompetitions(prev => prev.map(comp => 
        comp.id === competitionId 
          ? { ...comp, ...updates, updatedAt: new Date() } 
          : comp
      ));
    } catch (error) {
      throw new Error('Failed to update competition');
    }
  };

  const handleUpdateStageVisibility = async (
    stageId: string, 
    isVisible: boolean
  ): Promise<void> => {
    setPendingVisibilityChange({ stageId, isVisible });
    setVisibilityDialogOpen(true);
  };

  const confirmVisibilityChange = async (): Promise<void> => {
    if (!pendingVisibilityChange) return;
    const { stageId, isVisible } = pendingVisibilityChange;

    try {
      const competition = getCurrentCompetition();
      if (!competition) return;

      await adminService.updateStageVisibility(competition.id, Number(stageId), isVisible);

      setCompetitions(prev => prev.map(comp => {
        if (comp.id === competition.id) {
          return {
            ...comp,
            stages: {
              ...comp.stages,
              [stageId]: {
                ...comp.stages[stageId],
                isVisible
              }
            },
            updatedAt: new Date()
          };
        }
        return comp;
      }));

      setVisibilityDialogOpen(false);
      setPendingVisibilityChange(null);
    } catch (error) {
      setError('Failed to update stage visibility');
    }
  };

  const handleStageGuidelineUpdate = async (
    stageId: string, 
    file: File,
    description: string
  ) => {
    setFileUploadDialog({
      isOpen: true,
      stageId,
      file,
      description
    });
  };

  const confirmGuidelineUpload = async () => {
    if (!fileUploadDialog || !fileUploadDialog.file) return;
    
    try {
      const competition = getCurrentCompetition();
      if (!competition) return;

      await adminService.updateStageGuideline(
        competition.id,
        Number(fileUploadDialog.stageId),
        fileUploadDialog.file,
        fileUploadDialog.description
      );

      // Update local state after successful upload
      await initializeCompetitions(); // Refresh competitions to get new URLs
      setFileUploadDialog(null);
    } catch (error) {
      console.error('Error uploading guideline:', error);
      setError('Failed to upload guideline file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const competition = getCurrentCompetition();

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Competition Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {!competition ? (
        <Card>
          <CardContent className="p-4 text-center">
            <p>No competition selected</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <CompetitionEditor
            competition={competition}
            onUpdateCompetition={handleUpdateCompetition}
            onUpdateStageVisibility={handleUpdateStageVisibility}
            onUpdateStageGuideline={handleStageGuidelineUpdate}
          />

          <AlertDialog open={visibilityDialogOpen} onOpenChange={setVisibilityDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {pendingVisibilityChange?.isVisible 
                    ? 'Show Stage' 
                    : 'Hide Stage'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {pendingVisibilityChange?.isVisible
                    ? 'Are you sure you want to make this stage visible to participants?'
                    : 'Are you sure you want to hide this stage from participants?'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                  setVisibilityDialogOpen(false);
                  setPendingVisibilityChange(null);
                }}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmVisibilityChange}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog 
            open={fileUploadDialog?.isOpen ?? false} 
            onOpenChange={(isOpen) => {
              if (!isOpen) setFileUploadDialog(null);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Upload Guideline File</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to upload this guideline file? 
                  This will replace any existing guideline for this stage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFileUploadDialog(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={confirmGuidelineUpload}>
                  Upload
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AdminDashboard;