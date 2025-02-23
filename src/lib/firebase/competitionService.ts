/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/competitionService.ts

import { db, storage } from './firebase';
import { Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { Competition } from '@/models/Competition';
import { Team } from '@/models/Team';

export const competitionService = {
  async registerTeam(
    userId: string,
    competitionId: string, 
    teamData: Omit<Team,  'competitionId'| 'userId'| 'id' | 'stages' | 'registrationStatus' | 'createdAt' | 'updatedAt' | 'registrationDocURL'>,
    registrationFile: File
  ) {
    const teamId = crypto.randomUUID();
    const storageRef = ref(storage, `competitions/${competitionId}/registrations/${teamId}/${registrationFile.name}`);
    
    // Upload registration file
    await uploadBytes(storageRef, registrationFile);
    const registrationDocURL = await getDownloadURL(storageRef);
    
    // Create team document with competitionId
    const team: Team = {
      userId,
      competitionId,
      id: teamId,
      ...teamData,
      registrationStatus: 'pending',
      registrationDocURL,
      stages: {
        1: { status: 'pending' },
        2: { status: 'pending' },
        3: { status: 'pending' }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Store in competitions/[competitionId]/teams/[teamId]
    await setDoc(doc(db, 'competitions', competitionId, 'teams', teamId), team);
    
    // Also store in teams collection for easy querying
    await setDoc(doc(db, 'teams', teamId), team);
    
    return team;
  },
  // Stage Submission
  async submitStageWork(
    teamId: string,
    stageNumber: number,
    submissionFile: File
  ) {
    const team = await getDoc(doc(db, 'teams', teamId));
    const teamData = team.data() as Team;
    
    // Check if previous stage is cleared
    if (stageNumber > 1 && teamData.stages[stageNumber - 1].status !== 'cleared') {
      throw new Error('Previous stage not cleared');
    }
    
    const storageRef = ref(storage, `submissions/${teamId}/stage${stageNumber}/${submissionFile.name}`);
    await uploadBytes(storageRef, submissionFile);
    const submissionURL = await getDownloadURL(storageRef);
    
    await updateDoc(doc(db, 'teams', teamId), {
      [`stages.${stageNumber}`]: {
        status: 'pending',
        submissionURL,
        submissionDate: new Date()
      }
    });
  },
  async getCompetitionById(competitionId: string): Promise<Competition | null> {
    try {
      const competitionDoc = await getDoc(doc(db, 'competitions', competitionId));
      
      if (!competitionDoc.exists()) {
        return null;
      }
  
      const data = competitionDoc.data();
      return {
        id: competitionDoc.id,
        ...convertTimestampsToDates(data)
      } as Competition;
      
    } catch (error) {
      console.error('Error fetching competition:', error);
      throw new Error('Failed to fetch competition');
    }
  },
};


const convertDatesToTimestamps = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertDatesToTimestamps(item));
  }

  const converted: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      converted[key] = convertDatesToTimestamps(obj[key]);
    }
  }
  return converted;
};
export const convertTimestampsToDates = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Timestamp) {
    return obj.toDate();
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertTimestampsToDates(item));
  }

  const converted: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      converted[key] = convertTimestampsToDates(obj[key]);
    }
  }
  return converted;
};





// Admin functions
export const adminService = {

  async updateStageVisibility(
    competitionId: string,
    stageNumber: number,
    visibility: boolean
  ) {
    await updateDoc(doc(db, 'competitions', competitionId), {
      [`stages.${stageNumber}.visibility`]: visibility,
      updatedAt: new Date()
    });
  },
  
  async updateCompetition(competitionId: string, updates: Partial<Competition>) {
    try {
      // Create a copy of the updates to avoid modifying the original
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      // Convert all Date objects to Firestore Timestamps, including nested objects
      const convertedData = convertDatesToTimestamps(updateData);

      // Get reference to the competition document
      const competitionRef = doc(db, 'competitions', competitionId);

      // Perform the update
      await updateDoc(competitionRef, convertedData);
    } catch (error) {
      console.error('Error updating competition:', error);
      throw new Error('Failed to update competition');
    }
  },

  // Update team registration status
  async updateRegistrationStatus(
    teamId: string,
    status: 'approved' | 'rejected'
  ) {
    await updateDoc(doc(db, 'teams', teamId), {
      registrationStatus: status,
      updatedAt: new Date()
    });
  },

  async updateStageClearance(
    teamId: string,
    stageNumber: number,
    status: 'cleared' | 'rejected',
    feedback?: string
  ) {
    try {
      // Create update data object
      const updateData: any = {
        [`stages.${stageNumber}.status`]: status,
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Only add feedback field if it's provided
      if (feedback) {
        updateData[`stages.${stageNumber}.feedback`] = feedback;
      }

      await updateDoc(doc(db, 'teams', teamId), updateData);
    } catch (error) {
      console.error('Error updating stage clearance:', error);
      throw new Error('Failed to update stage clearance');
    }
  },


  
  // Update stage guideline
  async updateStageGuideline(
    competitionId: string,
    stageNumber: number,
    guidelineFile: File,
    description: string
  ) {
    try {
      const storageRef = ref(storage, `guidelines/${competitionId}/stage${stageNumber}/${guidelineFile.name}`);
      await uploadBytes(storageRef, guidelineFile);
      const guidelineFileURL = await getDownloadURL(storageRef);
      
      await updateDoc(doc(db, 'competitions', competitionId), {
        [`stages.${stageNumber}.guidelineFileURL`]: guidelineFileURL,
        [`stages.${stageNumber}.description`]: description,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating stage guideline:', error);
      throw new Error('Failed to update stage guideline');
    }
  },

// Also update the getTeamsByCompetition function in your adminService:
async getTeamsByCompetition(competitionId: string) {
  try {
    const teamsCollection = collection(db, 'teams');
    const q = query(teamsCollection, where('competitionId', '==', competitionId));
    const teamsSnapshot = await getDocs(q);
    
    return teamsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        registrationDate: data.registrationDate?.toDate(), // Convert Firestore Timestamp to Date
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
        stages: Object.entries(data.stages || {}).reduce((acc, [key, value]: [string, any]) => ({
          ...acc,
          [key]: {
            ...value,
            submissionDate: value.submissionDate?.toDate() // Convert Firestore Timestamp to Date
          }
        }), {})
      };
    }) as Team[];
  } catch (error) {
    console.error('Error getting teams:', error);
    throw new Error('Failed to get teams');
  }
},

  // Retrieve teams by registration status
  async getTeamsByRegistrationStatus(status: 'pending' | 'approved' | 'rejected') {
    try {
      const teamsCollection = collection(db, 'teams');
      const q = query(teamsCollection, where('registrationStatus', '==', status));
      const teamsSnapshot = await getDocs(q);
      
      const teams: Team[] = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Team));
      
      return teams;
    } catch (error) {
      console.error('Error retrieving teams by registration status:', error);
      throw new Error('Failed to retrieve teams with specified registration status');
    }
  },

  async getTeamsByStageWithPreviousCheck(
    competitionId: string,
    stageNumber: number,
    checkPreviousStages: boolean = false
  ) {
    try {
      const teamsCollection = collection(db, 'teams');
      const baseQuery = query(
        teamsCollection, 
        where('competitionId', '==', competitionId),
        where('registrationStatus', '==', 'approved')
      );
      const teamsSnapshot = await getDocs(baseQuery);
      
      return teamsSnapshot.docs.map(doc => {
        const data = doc.data();
        const team = {
          id: doc.id,
          ...data,
          registrationDate: data.registrationDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          stages: Object.entries(data.stages || {}).reduce((acc, [key, value]: [string, any]) => ({
            ...acc,
            [key]: {
              ...value,
              submissionDate: value.submissionDate?.toDate()
            }
          }), {})
        } as Team;
  
        if (!checkPreviousStages || stageNumber === 1) {
          return { ...team, allPreviousStagesCleared: true };
        }
  
        // Custom progression checks based on stage number
        let allPreviousStagesCleared = true;
  
        if (stageNumber === 2) {
          // For stage 2, check if stage 1 is cleared
          const stage1 = team.stages[1];
          allPreviousStagesCleared = stage1?.status === 'cleared';
        } else if (stageNumber === 3) {
          // For stage 3, check if stage 1 is cleared AND stage 2 is paid
          const stage1 = team.stages[1];
          const stage2 = team.stages[2];
          allPreviousStagesCleared = 
            stage1?.status === 'cleared' && 
            stage2?.status === 'cleared' && 
            stage2?.paidStatus === true;
        }
  
        return { ...team, allPreviousStagesCleared };
      });
    } catch (error) {
      console.error('Error getting teams by stage:', error);
      throw new Error('Failed to get teams by stage');
    }
  },

  async searchTeams(
    competitionId: string,
    searchTerm: string
  ) {
    try {
      const teamsCollection = collection(db, 'teams');
      // Add registration status check here too for consistency
      const q = query(
        teamsCollection, 
        where('competitionId', '==', competitionId),
        where('registrationStatus', '==', 'approved')
      );
      const teamsSnapshot = await getDocs(q);
      
      const searchTermLower = searchTerm.toLowerCase().trim();
      
      // Return all teams if search term is empty
      if (!searchTermLower) {
        return teamsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          registrationDate: doc.data().registrationDate?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          stages: Object.entries(doc.data().stages || {}).reduce((acc, [key, value]: [string, any]) => ({
            ...acc,
            [key]: {
              ...value,
              submissionDate: value.submissionDate?.toDate()
            }
          }), {})
        })) as Team[];
      }
      
      return teamsSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            registrationDate: data.registrationDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
            stages: Object.entries(data.stages || {}).reduce((acc, [key, value]: [string, any]) => ({
              ...acc,
              [key]: {
                ...value,
                submissionDate: value.submissionDate?.toDate()
              }
            }), {})
          } as Team;
        })
        .filter(team => 
          team.teamName.toLowerCase().includes(searchTermLower) ||
          team.teamLeader.name.toLowerCase().includes(searchTermLower) ||
          team.teamLeader.email.toLowerCase().includes(searchTermLower) ||
          // Also search team members
          (team.members.member1?.name.toLowerCase().includes(searchTermLower) ?? false) ||
          (team.members.member2?.name.toLowerCase().includes(searchTermLower) ?? false) ||
          (team.members.member1?.email?.toLowerCase().includes(searchTermLower) ?? false) ||
          (team.members.member2?.email?.toLowerCase().includes(searchTermLower) ?? false)
        );
    } catch (error) {
      console.error('Error searching teams:', error);
      throw new Error('Failed to search teams');
    }
  }
  
};