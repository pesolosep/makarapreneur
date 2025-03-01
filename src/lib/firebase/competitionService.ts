/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/competitionService.ts

import { db, storage } from './firebase';
import { limit, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
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
    teamData: Omit<Team, 'competitionId' | 'userId' | 'id' | 'stages' | 'registrationStatus' | 'createdAt' | 'updatedAt' | 'registrationDocURL'>,
    registrationFile: File
  ) {
    // Validate file type (must be ZIP)
    if (registrationFile.type !== 'application/zip' && 
        registrationFile.type !== 'application/x-zip-compressed' && 
        !registrationFile.name.endsWith('.zip')) {
      throw new Error('Registration file must be a ZIP file');
    }
    
    // Validate file size (max 30MB)
    const maxSizeInBytes = 30 * 1024 * 1024; // 30MB
    if (registrationFile.size > maxSizeInBytes) {
      throw new Error('Registration file must be less than 30MB');
    }
    
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
  const teamDoc = await getDoc(doc(db, 'teams', teamId));
  if (!teamDoc.exists()) {
    throw new Error('Team not found');
  }
  
  const teamData = teamDoc.data() as Team;
  
  // Check if previous stage is cleared
  if (stageNumber > 1 && teamData.stages[stageNumber - 1]?.status !== 'cleared') {
    throw new Error('Previous stage not cleared');
  }
  
  // Check for existing submission file and delete it if it exists
  if (teamData.stages[stageNumber]?.submissionURL) {
    try {
      // Extract the path from the URL to delete the file
      const oldFileRef = ref(storage, decodeURIComponent(teamData.stages[stageNumber].submissionURL.split('?')[0].split('/o/')[1]));
      await deleteObject(oldFileRef);
      console.log('Previous submission file deleted successfully');
    } catch (deleteError) {
      console.error('Error deleting previous file:', deleteError);
      // Continue with upload even if deletion fails
    }
  }
  
  // Upload new file
  const storageRef = ref(storage, `competitions/${teamData.competitionId}/submissions/${teamId}/stage${stageNumber}/${submissionFile.name}`);
  await uploadBytes(storageRef, submissionFile);
  const submissionURL = await getDownloadURL(storageRef);
  
  // Update team document with new submission
  await updateDoc(doc(db, 'teams', teamId), {
    [`stages.${stageNumber}`]: {
      status: 'pending',
      submissionURL,
      submissionDate: new Date()
    }
  });
  
  // Also update the submission in the competition's teams subcollection if needed
  try {
    await updateDoc(doc(db, 'competitions', teamData.competitionId, 'teams', teamId), {
      [`stages.${stageNumber}`]: {
        status: 'pending',
        submissionURL,
        submissionDate: new Date()
      }
    });
  } catch (error) {
    console.error('Error updating competition team document:', error);
    // Continue even if this update fails
  }
  
  return {
    status: 'pending',
    submissionURL,
    submissionDate: new Date()
  };
},
 
  async updateTeamInfo(
    teamId: string,
    updateData: Partial<Team>,
    newRegistrationFile: File | null = null
  ): Promise<Team> {
    try {
      // Get the current team data
      const teamDoc = await getDoc(doc(db, 'teams', teamId));
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }
  
      const teamData = teamDoc.data() as Team;
      
      // Get the competition to check the deadline
      const competitionDoc = await getDoc(doc(db, 'competitions', teamData.competitionId));
      if (!competitionDoc.exists()) {
        throw new Error('Competition not found');
      }
      
      const competition = {
        id: competitionDoc.id,
        ...convertTimestampsToDates(competitionDoc.data())
      } as Competition;
      
      // Check if registration deadline has passed
      const registrationDeadline = new Date(competition.registrationDeadline);
      const now = new Date();
      
      if (now > registrationDeadline) {
        throw new Error('Registration deadline has passed');
      }
      
      // Prepare update data
      const updateFields: any = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // If new registration file is provided, upload it
      if (newRegistrationFile) {
        // Validate file type (must be ZIP)
        if (newRegistrationFile.type !== 'application/zip' && 
          newRegistrationFile.type !== 'application/x-zip-compressed' && 
          !newRegistrationFile.name.endsWith('.zip')) {
            throw new Error('Registration file must be a ZIP file');
          }
          
        // Validate file size (max 30MB)
        const maxSizeInBytes = 30 * 1024 * 1024; // 30MB
        if (newRegistrationFile.size > maxSizeInBytes) {
          throw new Error('Registration file must be less than 30MB');
        }
        
        // Delete previous registration file if it exists
        if (teamData.registrationDocURL) {
          try {
            // Extract the path from the URL to delete the file
            const oldFileRef = ref(storage, decodeURIComponent(teamData.registrationDocURL.split('?')[0].split('/o/')[1]));
            await deleteObject(oldFileRef);
            console.log('Previous registration file deleted successfully');
          } catch (deleteError) {
            console.error('Error deleting previous file:', deleteError);
            // Continue with upload even if deletion fails
          }
        }
        
        // Upload and update the registration document URL
        const storageRef = ref(storage, `competitions/${teamData.competitionId}/registrations/${teamId}/${newRegistrationFile.name}`);
        await uploadBytes(storageRef, newRegistrationFile);
        const registrationDocURL = await getDownloadURL(storageRef);
        
        updateFields.registrationDocURL = registrationDocURL;
        
        // If registration was previously rejected, set it back to pending for review
        if (teamData.registrationStatus === 'rejected') {
          updateFields.registrationStatus = 'pending';
        }
      }
      
      // Check if registration is already approved
      if (teamData.registrationStatus === 'approved') {
          updateFields.registrationStatus = 'pending';
      }
      
      // Convert dates to timestamps
      const convertedData = convertDatesToTimestamps(updateFields);
      
      // Update in teams collection
      await updateDoc(doc(db, 'teams', teamId), convertedData);
      
      // Also update in competitions/[competitionId]/teams/[teamId]
      await updateDoc(doc(db, 'competitions', teamData.competitionId, 'teams', teamId), convertedData);
      
      // Return the updated team data
      const updatedTeamDoc = await getDoc(doc(db, 'teams', teamId));
      return {
        id: updatedTeamDoc.id,
        ...convertTimestampsToDates(updatedTeamDoc.data())
      } as Team;
    } catch (error) {
      console.error('Error updating team:', error);
      throw error;
    }
  },

// Get a specific team by both userId and competitionId
async getTeamByUserAndCompetition(userId: string, competitionId: string): Promise<Team | null> {
  try {
    const teamsQuery = query(
      collection(db, 'teams'),
      where('userId', '==', userId),
      where('competitionId', '==', competitionId),
      limit(1)
    );
    
    const teamsSnapshot = await getDocs(teamsQuery);
    
    if (teamsSnapshot.empty) {
      return null;
    }

    const teamDoc = teamsSnapshot.docs[0];
    return {
      id: teamDoc.id,
      ...convertTimestampsToDates(teamDoc.data())
    } as Team;
  } catch (error) {
    console.error('Error fetching team:', error);
    throw new Error('Failed to fetch team');
  }
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
    // First get the current competition data to access the existing file URL
    const competitionDoc = await getDoc(doc(db, 'competitions', competitionId));
    if (!competitionDoc.exists()) {
      throw new Error('Competition not found');
    }
    
    const competitionData = competitionDoc.data();
    const existingGuidelineURL = competitionData?.stages?.[stageNumber]?.guidelineFileURL;
    
    // Delete the previous file if it exists
    if (existingGuidelineURL) {
      try {
        // Extract the path from the URL to delete the file
        const oldFileRef = ref(storage, decodeURIComponent(existingGuidelineURL.split('?')[0].split('/o/')[1]));
        await deleteObject(oldFileRef);
        console.log('Previous guideline file deleted successfully');
      } catch (deleteError) {
        console.error('Error deleting previous guideline file:', deleteError);
        // Continue with upload even if deletion fails
      }
    }
    
    // Upload the new file
    const storageRef = ref(storage, `guidelines/${competitionId}/stage${stageNumber}/${guidelineFile.name}`);
    await uploadBytes(storageRef, guidelineFile);
    const guidelineFileURL = await getDownloadURL(storageRef);
    
    // Update the competition document
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

  async getTeamsByCompetition(competitionId: string) {
    try {
      const teamsCollection = collection(db, 'teams');
      const q = query(teamsCollection, where('competitionId', '==', competitionId));
      const teamsSnapshot = await getDocs(q);
      
      return teamsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data),
          // Handle nested structures with custom fields
          teamLeader: {
            ...data.teamLeader,
            // Ensure all TeamLeader fields are present
            phone: data.teamLeader?.phone || '',
            institution: data.teamLeader?.institution || '',
            major: data.teamLeader?.major || '',
            batchYear: data.teamLeader?.batchYear || ''
          },
          members: {
            member1: data.members?.member1 ? {
              ...data.members.member1,
              // Ensure all Member1 fields are present
              phone: data.members.member1?.phone || '',
              institution: data.members.member1?.institution || '',
              major: data.members.member1?.major || '',
              batchYear: data.members.member1?.batchYear || ''
            } : undefined,
            member2: data.members?.member2 ? {
              ...data.members.member2,
              // Ensure all Member2 fields are present
              phone: data.members.member2?.phone || '',
              institution: data.members.member2?.institution || '',
              major: data.members.member2?.major || '',
              batchYear: data.members.member2?.batchYear || ''
            } : undefined
          }
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
      
      const teams: Team[] = teamsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data),
          // Handle nested structures with custom fields
          teamLeader: {
            ...data.teamLeader,
            phone: data.teamLeader?.phone || '',
            institution: data.teamLeader?.institution || '',
            major: data.teamLeader?.major || '',
            batchYear: data.teamLeader?.batchYear || ''
          },
          members: {
            member1: data.members?.member1 ? {
              ...data.members.member1,
              phone: data.members.member1?.phone || '',
              institution: data.members.member1?.institution || '',
              major: data.members.member1?.major || '',
              batchYear: data.members.member1?.batchYear || ''
            } : undefined,
            member2: data.members?.member2 ? {
              ...data.members.member2,
              phone: data.members.member2?.phone || '',
              institution: data.members.member2?.institution || '',
              major: data.members.member2?.major || '',
              batchYear: data.members.member2?.batchYear || ''
            } : undefined
          }
        };
      });
      
      return teams;
    } catch (error) {
      console.error('Error retrieving teams by registration status:', error);
      throw new Error('Failed to retrieve teams with specified registration status');
    }
  },


};