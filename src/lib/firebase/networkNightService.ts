/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/networkingEventService.ts

import { db, storage } from './firebase';
import { Timestamp, limit, query, collection, doc, setDoc, updateDoc, getDoc, getDocs, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  NetworkingParticipant, 
  MembershipStatus, 
  calculatePaymentAmount
} from '@/models/NetworkParticipant';

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

export const networkingEventService = {
  // Register a new participant with optional payment proof
  async registerParticipant(
    userId: string,
    participantData: Omit<NetworkingParticipant, 'id' | 'userId' | 'paymentStatus' | 'registrationDate' | 'createdAt' | 'updatedAt' | 'paymentProofURL' | 'paymentAmount'>,
    paymentProofFile?: File
  ): Promise<NetworkingParticipant> {
    try {
      const participantId = crypto.randomUUID();
      
      // Validate required fields
      if (!participantData.name) {
        throw new Error('Name is required');
      }
      
      if (!participantData.whatsappNumber) {
        throw new Error('WhatsApp number is required');
      }
      
      if (!participantData.membershipStatus) {
        throw new Error('Membership status is required');
      }
      
      if (!participantData.position) {
        throw new Error('Position is required');
      }
      
      if (!participantData.expectations || participantData.expectations.length === 0) {
        throw new Error('At least one expectation is required');
      }
      
      // If non-fungsionaris, validate hipmiPtOrigin
      if (participantData.membershipStatus === MembershipStatus.NON_FUNGSIONARIS && !participantData.hipmiPtOrigin) {
        throw new Error('HIPMI PT origin is required for non-fungsionaris');
      }
      
      // Handle business field explicitly
      if (participantData.hasBusiness === true) {
        // Validate business information
        if (!participantData.business || !participantData.business.name || !participantData.business.field) {
          throw new Error('Business information is required when you have a business');
        }
        
        // Ensure no undefined values in business object
        if (participantData.business) {
          participantData.business.name = participantData.business.name || "";
          participantData.business.field = participantData.business.field || "OTHER";
          participantData.business.description = participantData.business.description || "";
        }
      } else if (participantData.hasBusiness === false) {
        // If not a business, explicitly set to null
        participantData.business = null;
      }
      
      // Calculate payment amount based on membership status
      const paymentAmount = calculatePaymentAmount(participantData.membershipStatus);
      
      // Create participant document
      const participant: NetworkingParticipant = {
        id: participantId,
        userId,
        ...participantData,
        paymentAmount,
        registrationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Process payment proof if provided
      if (paymentProofFile) {
        // Validate file type (image or PDF)
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validFileTypes.includes(paymentProofFile.type)) {
          throw new Error('Payment proof must be an image (JPEG, PNG) or PDF file');
        }
        
        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (paymentProofFile.size > maxSizeInBytes) {
          throw new Error('Payment proof file must be less than 5MB');
        }
        
        // Upload payment proof
        const storageRef = ref(storage, `networkingEvent/paymentProofs/${participantId}/${paymentProofFile.name}`);
        await uploadBytes(storageRef, paymentProofFile);
        participant.paymentProofURL = await getDownloadURL(storageRef);
        participant.paymentDate = new Date();
      }
      
      // Clean the object to remove any undefined values
      const cleanedParticipant = cleanObject(participant);
      
      // Debug logs
      console.log("Debug - hasBusiness value:", participantData.hasBusiness);
      console.log("Debug - business object before cleaning:", participant.business);
      console.log("Debug - business object after cleaning:", cleanedParticipant.business);
      
      // Use a flat collection structure instead of nested subcollections
      await setDoc(doc(db, 'networkingEventParticipants', participantId), convertDatesToTimestamps(cleanedParticipant));
      
      return participant;
    } catch (error) {
      console.error('Error registering participant:', error);
      throw new Error('Failed to register participant: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  },
  
  // Edit registration and/or submit payment proof
  async editRegistration(
    participantId: string,
    updateData: Partial<NetworkingParticipant>,
    paymentProofFile?: File
  ): Promise<NetworkingParticipant> {
    try {
      // Check if participant exists
      const participantDoc = await getDoc(doc(db, 'networkingEventParticipants', participantId));
      if (!participantDoc.exists()) {
        throw new Error('Participant not found');
      }
      
      const participantData = convertTimestampsToDates(participantDoc.data()) as NetworkingParticipant;
      
      // Prepare update fields
      const updateFields: any = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // Handle business field explicitly
      if (updateData.hasBusiness === true) {
        // Validate business information
        if (!updateData.business || !updateData.business.name || !updateData.business.field) {
          throw new Error('Business information is required when you have a business');
        }
        
        // Ensure no undefined values in business object
        if (updateData.business) {
          updateFields.business = {
            name: updateData.business.name || "",
            field: updateData.business.field || "OTHER",
            description: updateData.business.description || "",
            socialMedia: updateData.business.socialMedia
          };
        }
      } else if (updateData.hasBusiness === false) {
        // If not a business, explicitly set to null
        updateFields.business = null;
      }
      
      // If membership status is changing, recalculate payment amount
      if (updateData.membershipStatus && updateData.membershipStatus !== participantData.membershipStatus) {
        updateFields.paymentAmount = calculatePaymentAmount(updateData.membershipStatus);
        
   
      }
      
      // If payment proof file is provided, process it
      if (paymentProofFile) {
        // Validate file type (image or PDF)
        const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validFileTypes.includes(paymentProofFile.type)) {
          throw new Error('Payment proof must be an image (JPEG, PNG) or PDF file');
        }
        
        // Validate file size (max 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (paymentProofFile.size > maxSizeInBytes) {
          throw new Error('Payment proof file must be less than 5MB');
        }
        
        // Delete previous payment proof if it exists
        if (participantData.paymentProofURL) {
          try {
            // Extract the path from the URL to delete the file
            const oldFileRef = ref(storage, decodeURIComponent(participantData.paymentProofURL.split('?')[0].split('/o/')[1]));
            await deleteObject(oldFileRef);
            console.log('Previous payment proof deleted successfully');
          } catch (deleteError) {
            console.error('Error deleting previous payment proof:', deleteError);
            // Continue with upload even if deletion fails
          }
        }
        
        // Upload new payment proof
        const storageRef = ref(storage, `networkingEvent/paymentProofs/${participantId}/${paymentProofFile.name}`);
        await uploadBytes(storageRef, paymentProofFile);
        updateFields.paymentProofURL = await getDownloadURL(storageRef);
        updateFields.paymentDate = new Date();
      }
      
      // Clean the object to remove any undefined values
      const cleanedUpdateFields = cleanObject(updateFields);
      
      // Debug logs
      console.log("Debug - update fields before cleaning:", updateFields);
      console.log("Debug - update fields after cleaning:", cleanedUpdateFields);
      
      // Convert dates to timestamps
      const convertedData = convertDatesToTimestamps(cleanedUpdateFields);
      
      // Update in participants collection
      await updateDoc(doc(db, 'networkingEventParticipants', participantId), convertedData);
      
      // Return the updated participant data
      const updatedParticipantDoc = await getDoc(doc(db, 'networkingEventParticipants', participantId));
      return {
        id: updatedParticipantDoc.id,
        ...convertTimestampsToDates(updatedParticipantDoc.data())
      } as NetworkingParticipant;
    } catch (error) {
      console.error('Error editing registration:', error);
      throw error;
    }
  },
  
  // Get participant by ID
  async getParticipantById(participantId: string): Promise<NetworkingParticipant | null> {
    try {
      const participantDoc = await getDoc(doc(db, 'networkingEventParticipants', participantId));
      
      if (!participantDoc.exists()) {
        return null;
      }
      
      const data = participantDoc.data();
      return {
        id: participantDoc.id,
        ...convertTimestampsToDates(data)
      } as NetworkingParticipant;
    } catch (error) {
      console.error('Error fetching participant:', error);
      throw new Error('Failed to fetch participant');
    }
  },
  
  // Get participant by user ID
  async getParticipantByUserId(userId: string): Promise<NetworkingParticipant | null> {
    try {
      const participantsQuery = query(
        collection(db, 'networkingEventParticipants'),
        where('userId', '==', userId),
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
      } as NetworkingParticipant;
    } catch (error) {
      console.error('Error fetching participant by user ID:', error);
      throw new Error('Failed to fetch participant');
    }
  }
};

// Admin service for networking event
export const networkingEventAdminService = {
  // Get all participants
  async getAllParticipants(): Promise<NetworkingParticipant[]> {
    try {
      const participantsSnapshot = await getDocs(collection(db, 'networkingEventParticipants'));
      
      return participantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data())
      })) as NetworkingParticipant[];
    } catch (error) {
      console.error('Error fetching all participants:', error);
      throw new Error('Failed to fetch participants');
    }
  },
  
  // Get participants by membership status
  async getParticipantsByMembershipStatus(membershipStatus: MembershipStatus): Promise<NetworkingParticipant[]> {
    try {
      const participantsQuery = query(
        collection(db, 'networkingEventParticipants'),
        where('membershipStatus', '==', membershipStatus)
      );
      
      const participantsSnapshot = await getDocs(participantsQuery);
      
      return participantsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestampsToDates(doc.data())
      })) as NetworkingParticipant[];
    } catch (error) {
      console.error(`Error fetching participants by membership status (${membershipStatus}):`, error);
      throw new Error('Failed to fetch participants by membership status');
    }
  },
  


  // Export participants data (e.g., for generating name badges, attendance lists)
  async exportParticipantsData(): Promise<Array<{
    id: string;
    name: string;
    whatsappNumber: string;
    membershipStatus: MembershipStatus;
    hipmiPtOrigin?: string;
    position: string;
    hasBusiness: boolean;
    businessName?: string;
    businessField?: string;
  }>> {
    try {
      const participantsSnapshot = await getDocs(collection(db, 'networkingEventParticipants'));
      
      return participantsSnapshot.docs.map(doc => {
        const data = convertTimestampsToDates(doc.data()) as NetworkingParticipant;
        return {
          id: doc.id,
          name: data.name,
          whatsappNumber: data.whatsappNumber,
          membershipStatus: data.membershipStatus,
          hipmiPtOrigin: data.hipmiPtOrigin?.toString() || undefined,
          position: data.position.toString(),
          hasBusiness: data.hasBusiness,
          businessName: data.business?.name,
          businessField: data.business?.field?.toString(),
        };
      });
    } catch (error) {
      console.error('Error exporting participants data:', error);
      throw new Error('Failed to export participants data');
    }
  }
};

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
      converted[key] = convertDatesToTimestamps(obj[key]);
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