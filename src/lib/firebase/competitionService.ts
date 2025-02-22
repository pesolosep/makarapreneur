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

  // Update stage clearance
  async updateStageClearance(
    teamId: string,
    stageNumber: number,
    status: 'cleared' | 'rejected',
    feedback?: string
  ) {
    await updateDoc(doc(db, 'teams', teamId), {
      [`stages.${stageNumber}.status`]: status,
      [`stages.${stageNumber}.feedback`]: feedback,
      updatedAt: new Date()
    });
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

  // Retrieve teams for a specific competition
  async getTeamsByCompetition(competitionId: string) {
    try {
      const teamsCollection = collection(db, 'teams');
      const q = query(teamsCollection, where('competitionId', '==', competitionId));
      const teamsSnapshot = await getDocs(q);
      
      const teams: Team[] = teamsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Team));
      
      return teams;
    } catch (error) {
      console.error('Error retrieving teams for competition:', error);
      throw new Error('Failed to retrieve teams for the specified competition');
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
  }

  
};