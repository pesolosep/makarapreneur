/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/businessClassService.ts

import { db, storage } from './firebase';
import { Timestamp, limit, query, collection, doc, setDoc, updateDoc, getDoc, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  BusinessClassParticipant,
  ParticipantLevel, 
  InformationSource
} from '@/models/BusinessClassParticipant';

// Helper function to clean object of undefined values
function cleanObject(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => cleanObject(item));
  }

  const result: any = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Skip undefined values
      if (obj[key] === undefined) continue;
      
      // If it's an object, recursively clean it
      if (obj[key] !== null && typeof obj[key] === 'object') {
        result[key] = cleanObject(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
  }
  
  return result;
}

// Helper functions for converting between Dates and Timestamps
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
      // Special handling for date fields to ensure they are Firestore Timestamps
      if (key === 'registrationDate' || key === 'createdAt' || key === 'updatedAt') {
        if (obj[key] instanceof Date) {
          // Convert Date directly to Firestore Timestamp 
          converted[key] = Timestamp.fromDate(obj[key]);
        } else if (obj[key] instanceof Timestamp) {
          // Already a Timestamp, use as is
          converted[key] = obj[key];
        } else if (obj[key] && (typeof obj[key] === 'string' || typeof obj[key] === 'number')) {
          // Try to parse as Date then convert to Timestamp
          try {
            converted[key] = Timestamp.fromDate(new Date(obj[key]));
          } catch (e) {
            // If parsing fails, use current date
            converted[key] = Timestamp.fromDate(new Date());
          }
        } else if (obj[key] && typeof obj[key] === 'object') {
          // Handle case where it might be a serialized Timestamp object with seconds/nanoseconds
          if ('seconds' in obj[key] && 'nanoseconds' in obj[key]) {
            converted[key] = new Timestamp(obj[key].seconds, obj[key].nanoseconds);
          } else {
            // Fallback to current date
            converted[key] = Timestamp.fromDate(new Date());
          }
        } else {
          // Default to current date if all else fails
          converted[key] = Timestamp.fromDate(new Date());
        }
      } else if (obj[key] instanceof Date) {
        // Handle any other date fields that might not be one of the special keys
        converted[key] = Timestamp.fromDate(obj[key]);
      } else if (obj[key] !== null && typeof obj[key] === 'object') {
        // Recursively convert nested objects
        converted[key] = convertDatesToTimestamps(obj[key]);
      } else {
        // For non-date fields, keep as is
        converted[key] = obj[key];
      }
    }
  }
  return converted;
};

const convertTimestampsToDates = (obj: any): any => {
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

export const businessClassService = {
  // Register a new participant with proof file upload integrated
  async registerParticipant(
    participantData: Omit<BusinessClassParticipant, 'id' | 'socialMediaProofURL' | 'registrationStatus' | 'registrationDate' | 'assignedEmailSent' | 'createdAt' | 'updatedAt'>,
    proofZipFile: File
  ): Promise<BusinessClassParticipant> {
    try {
      const participantId = crypto.randomUUID();
      
      // Validate the ZIP file
      if (proofZipFile.type !== 'application/zip' && 
          proofZipFile.type !== 'application/x-zip-compressed' && 
          !proofZipFile.name.endsWith('.zip')) {
        throw new Error('Proof file must be a ZIP file');
      }
      
      // Validate file size (max 10MB)
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (proofZipFile.size > maxSizeInBytes) {
        throw new Error('Proof file must be less than 10MB');
      }
      
      // Validate required fields
      if (!participantData.participantLevel) {
        throw new Error('Participant level is required');
      }
      
      if (!participantData.reasonForJoining) {
        throw new Error('Reason for joining is required');
      }
      
      if (!participantData.informationSource) {
        throw new Error('Information source is required');
      }
      
      if (participantData.informationSource === InformationSource.OTHER && !participantData.otherInformationSource) {
        throw new Error('Please specify the other information source');
      }
      
      // Upload proof ZIP file directly in this function
      const storageRef = ref(storage, `businessClass/proofs/${participantId}/socialMedia_proof.zip`);
      await uploadBytes(storageRef, proofZipFile);
      const socialMediaProofURL = await getDownloadURL(storageRef);
      
      // Create participant data with all fields except date fields
      const participantDataWithoutDates = {
        id: participantId,
        ...participantData,
        socialMediaProofURL,
        assignedEmailSent: false
      };
      
      // Clean the object to remove any undefined values
      const cleanedData = cleanObject(participantDataWithoutDates);
      
      // Add date fields directly as Firestore Timestamps (not Date objects)
      const now = new Date();
      const firestoreData = {
        ...cleanedData,
        registrationDate: Timestamp.fromDate(now),
        createdAt: Timestamp.fromDate(now),
        updatedAt: Timestamp.fromDate(now)
      };
      
      // Store in Firestore
      await setDoc(doc(db, 'businessClassParticipants', participantId), firestoreData);
      
      // Return as JavaScript Date objects for client use
      return {
        ...cleanedData,
        registrationDate: now,
        createdAt: now,
        updatedAt: now
      } as BusinessClassParticipant;
    } catch (error) {
      console.error('Error registering participant:', error);
      throw new Error('Failed to register participant: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },
  
  // Get participant by ID
  async getParticipantById(participantId: string): Promise<BusinessClassParticipant | null> {
    try {
      const participantDoc = await getDoc(doc(db, 'businessClassParticipants', participantId));
      
      if (!participantDoc.exists()) {
        return null;
      }
      
      const data = participantDoc.data();
      return {
        id: participantDoc.id,
        ...convertTimestampsToDates(data)
      } as BusinessClassParticipant;
    } catch (error) {
      console.error('Error fetching participant:', error);
      throw new Error('Failed to fetch participant');
    }
  },
  
  // Get participant by email
  async getParticipantByEmail(email: string): Promise<BusinessClassParticipant | null> {
    try {
      const participantsQuery = query(
        collection(db, 'businessClassParticipants'),
        where('email', '==', email),
        limit(1)
      );
      
      const participantsSnapshot = await getDocs(participantsQuery);
      
      if (participantsSnapshot.empty) {
        return null;
      }
      
      const participantDoc = participantsSnapshot.docs[0];
      return {
        id: participantDoc.id,
        ...convertTimestampsToDates(participantDoc.data())
      } as BusinessClassParticipant;
    } catch (error) {
      console.error('Error fetching participant by email:', error);
      throw new Error('Failed to fetch participant by email');
    }
  },
  
  // Edit registration info and/or update proof file
  async editRegistration(
    participantId: string,
    updateData: Partial<BusinessClassParticipant>,
    newProofZipFile?: File
  ): Promise<BusinessClassParticipant> {
    try {
      // Check if participant exists
      const participantDoc = await getDoc(doc(db, 'businessClassParticipants', participantId));
      if (!participantDoc.exists()) {
        throw new Error('Participant not found');
      }
      
      const participantData = convertTimestampsToDates(participantDoc.data()) as BusinessClassParticipant;
      
      // Prepare update fields without date fields
      const updateFieldsWithoutDates = { ...updateData };
      
      // If updatedAt is included, remove it so we can add it as a proper Timestamp
      if ('updatedAt' in updateFieldsWithoutDates) {
        delete updateFieldsWithoutDates.updatedAt;
      }
      
      // If new proof file is provided, handle it
      if (newProofZipFile) {
        // Validate the ZIP file
        if (newProofZipFile.type !== 'application/zip' && 
            newProofZipFile.type !== 'application/x-zip-compressed' && 
            !newProofZipFile.name.endsWith('.zip')) {
          throw new Error('Proof file must be a ZIP file');
        }
        
        // Validate file size (max 10MB)
        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        if (newProofZipFile.size > maxSizeInBytes) {
          throw new Error('Proof file must be less than 10MB');
        }
        
        // Delete previous file if it exists
        if (participantData.socialMediaProofURL) {
          try {
            // Extract the path from the URL to delete the file
            const oldFileRef = ref(storage, decodeURIComponent(participantData.socialMediaProofURL.split('?')[0].split('/o/')[1]));
            await deleteObject(oldFileRef);
            console.log('Previous proof file deleted successfully');
          } catch (deleteError) {
            console.error('Error deleting previous proof file:', deleteError);
            // Continue with upload even if deletion fails
          }
        }
        
        // Upload new proof file
        const storageRef = ref(storage, `businessClass/proofs/${participantId}/socialMedia_proof.zip`);
        await uploadBytes(storageRef, newProofZipFile);
        updateFieldsWithoutDates.socialMediaProofURL = await getDownloadURL(storageRef);
      }
      
      // If information source is updated to OTHER, check for otherInformationSource
      if (updateData.informationSource === InformationSource.OTHER && 
          !updateData.otherInformationSource && 
          !participantData.otherInformationSource) {
        throw new Error('Please specify the other information source');
      }
      
      // Clean the object to remove any undefined values
      const cleanedUpdateFields = cleanObject(updateFieldsWithoutDates);
      
      // Add timestamp directly as a Firestore Timestamp
      const now = new Date();
      const firestoreData = {
        ...cleanedUpdateFields,
        updatedAt: Timestamp.fromDate(now)
      };
      
      // Update participant document 
      await updateDoc(doc(db, 'businessClassParticipants', participantId), firestoreData);
      
      // Return updated participant data
      const updatedParticipantDoc = await getDoc(doc(db, 'businessClassParticipants', participantId));
      return {
        id: updatedParticipantDoc.id,
        ...convertTimestampsToDates(updatedParticipantDoc.data())
      } as BusinessClassParticipant;
    } catch (error) {
      console.error('Error editing registration:', error);
      throw error;
    }
  }
};

// Admin service for business class
export const businessClassAdminService = {
  
  // Send email notification and update status
  async sendEmailNotification(
    participantId: string
  ): Promise<BusinessClassParticipant> {
    try {
      // This is a placeholder function - in a real app, you would integrate with an email service
      // For now, we'll just update the assignedEmailSent flag
      
      // Update in participants collection with explicit Timestamp
      await updateDoc(doc(db, 'businessClassParticipants', participantId), {
        assignedEmailSent: true,
        updatedAt: Timestamp.fromDate(new Date())
      });
      
      // Return the updated participant data
      const updatedParticipantDoc = await getDoc(doc(db, 'businessClassParticipants', participantId));
      return {
        id: updatedParticipantDoc.id,
        ...convertTimestampsToDates(updatedParticipantDoc.data())
      } as BusinessClassParticipant;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  },
  
  // Get all participants
  async getAllParticipants(): Promise<BusinessClassParticipant[]> {
    try {
      const participantsSnapshot = await getDocs(collection(db, 'businessClassParticipants'));
      
      return participantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data())
      })) as BusinessClassParticipant[];
    } catch (error) {
      console.error('Error fetching all participants:', error);
      throw new Error('Failed to fetch participants');
    }
  },

  // Get participants by level
  async getParticipantsByLevel(level: ParticipantLevel): Promise<BusinessClassParticipant[]> {
    try {
      const participantsQuery = query(
        collection(db, 'businessClassParticipants'),
        where('participantLevel', '==', level)
      );
      
      const participantsSnapshot = await getDocs(participantsQuery);
      
      return participantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data())
      })) as BusinessClassParticipant[];
    } catch (error) {
      console.error(`Error fetching participants by level (${level}):`, error);
      throw new Error('Failed to fetch participants by level');
    }
  },
  
  // Download and review proof ZIP file
  async downloadProofZipFile(participantId: string): Promise<string> {
    try {
      const participantDoc = await getDoc(doc(db, 'businessClassParticipants', participantId));
      if (!participantDoc.exists()) {
        throw new Error('Participant not found');
      }
      
      const participant = convertTimestampsToDates(participantDoc.data()) as BusinessClassParticipant;
      
      if (!participant.socialMediaProofURL) {
        throw new Error('Proof file not found for this participant');
      }
      
      // Return the URL for download
      return participant.socialMediaProofURL;
    } catch (error) {
      console.error('Error fetching proof ZIP file URL:', error);
      throw error;
    }
  }
};