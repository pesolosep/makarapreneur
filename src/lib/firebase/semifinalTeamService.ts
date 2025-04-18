/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/semifinalTeamService.ts

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
import { Team } from '@/models/SemifinalTeam';
import RegisterForm from '../../components/auth/RegisterForm';

export const semifinalTeamService = {
    async registerSemifinalTeam(
        userId: string,
        competitionId: string, 
        teamData: Omit<Team, 'competitionId' | 'userId' | 'id' | 'stages' | 'registrationStatus' | 'createdAt' | 'updatedAt' | 'registrationDocURL'>,
        registrationFile: File
      ) {
        // Validate file type (image or PDF)
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validFileTypes.includes(registrationFile.type)) {
          throw new Error('Registration file must be an image (JPEG, PNG) or PDF file');
        }
        
        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (registrationFile.size > maxSizeInBytes) {
          throw new Error('Registration file must be less than 5MB');
        }
        
        const teamId = crypto.randomUUID();
        const storageRef = ref(storage, `competitions/${competitionId}/semifinal-registrations/${teamId}/${registrationFile.name}`);
        
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
            2: { status: 'pending' },
            3: { status: 'pending' }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Store in collections
        await setDoc(doc(db, 'competitions', competitionId, 'semifinalTeams', teamId), team);
        
        // Also store in semifinalTeams collection for easy querying
        await setDoc(doc(db, 'semifinalTeams', teamId), team);
        
        return team;
      },
  
  // Stage Submission
  async submitSemifinalStageWork(
    teamId: string,
    stageNumber: number,
    submissionFile: File
  ) {
    try {
      // Validate file type
      const validFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      // If the file extension is correct but the type is not recognized, check the extension
      if (!validFileTypes.includes(submissionFile.type)) {
        const fileName = submissionFile.name.toLowerCase();
        const isValidExtension = fileName.endsWith('.pdf') || fileName.endsWith('.doc') || fileName.endsWith('.docx');
        
        if (!isValidExtension) {
          throw new Error('Submission file must be a PDF or Word document (.pdf, .doc, .docx)');
        }
      }
      
      // Validate file size (max 30MB)
      const maxSizeInBytes = 30 * 1024 * 1024; // 30MB
      if (submissionFile.size > maxSizeInBytes) {
        throw new Error('Submission file must be less than 10MB');
      }

      const teamDoc = await getDoc(doc(db, 'semifinalTeams', teamId));
      if (!teamDoc.exists()) {
        throw new Error('Semifinal team not found');
      }
      
      const teamData = teamDoc.data() as Team;
      
      // Check stage requirements
      if (stageNumber === 2) {
        // For stage 2, only check if registration is approved
        if (teamData.registrationStatus !== 'approved') {
          throw new Error('Team registration must be approved to submit for stage 2');
        }
      } else if (stageNumber === 3) {
        // For stage 3, check if stage 2 is cleared
        if (teamData.stages[2]?.status !== 'cleared') {
          throw new Error('Stage 2 must be cleared before submitting for stage 3');
        }
      } else {
        // Invalid stage number
        throw new Error('Invalid stage number. Only stages 2 and 3 are supported.');
      }
      
      // Check for existing submission file and delete it if it exists
      if (teamData.stages[stageNumber]?.submissionURL) {
        try {
          // Extract the path from the URL to delete the file
          const oldFileRef = ref(storage, decodeURIComponent(teamData.stages[stageNumber].submissionURL.split('?')[0].split('/o/')[1]));
          await deleteObject(oldFileRef);
        } catch (deleteError) {
          // Continue with upload even if deletion fails
        }
      }
      
      // Upload new file
      const storagePath = `competitions/${teamData.competitionId}/semifinal-submissions/${teamId}/stage${stageNumber}/${submissionFile.name}`;
      
      try {
        const storageRef = ref(storage, storagePath);
        const uploadResult = await uploadBytes(storageRef, submissionFile);
        const submissionURL = await getDownloadURL(storageRef);
        
        // Update team document with new submission
        const updateData = {
          [`stages.${stageNumber}`]: {
            status: 'pending',
            submissionURL,
            submissionDate: new Date()
          }
        };
        
        try {
          await updateDoc(doc(db, 'semifinalTeams', teamId), updateData);
        } catch (updateError: unknown) {
          throw new Error(`Failed to update the submission record: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
        }
        
        // Also update the submission in the competition's semifinalTeams subcollection
        try {
          await updateDoc(doc(db, 'competitions', teamData.competitionId, 'semifinalTeams', teamId), updateData);
        } catch (error) {
          // Continue even if this update fails
        }
        
        return {
          status: 'pending',
          submissionURL,
          submissionDate: new Date()
        };
      } catch (uploadError: unknown) {
        throw new Error(`File upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
      }
    } catch (error) {
      throw error;
    }
  },
   
  async updateSemifinalTeamInfo(
    teamId: string,
    updateData: Partial<Team>,
    newRegistrationFile: File | null = null
  ): Promise<Team> {
    try {
      // Get the current team data
      const teamDoc = await getDoc(doc(db, 'semifinalTeams', teamId));
      if (!teamDoc.exists()) {
        throw new Error('Semifinal team not found');
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
      
      // Check if semifinal registration deadline has passed
      const semifinalDeadline = new Date(competition.registrationDeadline);
      const now = new Date();
      
      if (now > semifinalDeadline) {
        throw new Error('Semifinal registration deadline has passed');
      }
      
      // Prepare update data
      const updateFields: any = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // If new registration file is provided, upload it
      if (newRegistrationFile) {
        // Validate file type (image or PDF)
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validFileTypes.includes(newRegistrationFile.type)) {
          throw new Error('Registration file must be an image (JPEG, PNG) or PDF file');
        }
        
        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (newRegistrationFile.size > maxSizeInBytes) {
          throw new Error('Registration file must be less than 5MB');
        }
        
        // Delete previous registration file if it exists
        if (teamData.registrationDocURL) {
          try {
            // Extract the path from the URL to delete the file
            const oldFileRef = ref(storage, decodeURIComponent(teamData.registrationDocURL.split('?')[0].split('/o/')[1]));
            await deleteObject(oldFileRef);
          } catch (deleteError) {
            // Continue with upload even if deletion fails
          }
        }
        
        // Upload and update the registration document URL
        const storageRef = ref(storage, `competitions/${teamData.competitionId}/semifinal-registrations/${teamId}/${newRegistrationFile.name}`);
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
      
      // Update in semifinalTeams collection
      await updateDoc(doc(db, 'semifinalTeams', teamId), convertedData);
      
      // Also update in competitions/[competitionId]/semifinalTeams/[teamId]
      await updateDoc(doc(db, 'competitions', teamData.competitionId, 'semifinalTeams', teamId), convertedData);
      
      // Return the updated team data
      const updatedTeamDoc = await getDoc(doc(db, 'semifinalTeams', teamId));
      return {
        id: updatedTeamDoc.id,
        ...convertTimestampsToDates(updatedTeamDoc.data())
      } as Team;
    } catch (error) {
      console.error('Error updating semifinal team:', error);
      throw error;
    }
  },

  // Get a specific semifinal team by both userId and competitionId
  async getSemifinalTeamByUserAndCompetition(userId: string, competitionId: string): Promise<Team | null> {
    try {
      const teamsQuery = query(
        collection(db, 'semifinalTeams'),
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
      console.error('Error fetching semifinal team:', error);
      throw new Error('Failed to fetch semifinal team');
    }
  },
};

// Admin functions for semifinal teams
export const adminSemifinalService = {
  // Update semifinal team registration status
  async updateSemifinalRegistrationStatus(
    teamId: string,
    status: 'approved' | 'rejected'
  ) {
    await updateDoc(doc(db, 'semifinalTeams', teamId), {
      registrationStatus: status,
      updatedAt: new Date()
    });
  },

  async updateSemifinalStageClearance(
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

      await updateDoc(doc(db, 'semifinalTeams', teamId), updateData);
    } catch (error) {
      console.error('Error updating semifinal stage clearance:', error);
      throw new Error('Failed to update semifinal stage clearance');
    }
  },

  async getSemifinalTeamsByCompetition(competitionId: string): Promise<Team[]> {
    try {
      const teamsCollection = collection(db, 'semifinalTeams');
      const q = query(teamsCollection, where('competitionId', '==', competitionId));
      const teamsSnapshot = await getDocs(q);
      
      return teamsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        };
      }) as Team[];
    } catch (error) {
      console.error('Error getting semifinal teams:', error);
      throw new Error('Failed to get semifinal teams');
    }
  },

  // Retrieve semifinal teams by registration status
  async getSemifinalTeamsByRegistrationStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Team[]> {
    try {
      const teamsCollection = collection(db, 'semifinalTeams');
      const q = query(teamsCollection, where('registrationStatus', '==', status));
      const teamsSnapshot = await getDocs(q);
      
      const teams: Team[] = teamsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...convertTimestampsToDates(data)
        };
      });
      
      return teams;
    } catch (error) {
      console.error('Error retrieving semifinal teams by registration status:', error);
      throw new Error('Failed to retrieve semifinal teams with specified registration status');
    }
  },
};

// These helper functions can be reused from the original service
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