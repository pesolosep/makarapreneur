// models/BusinessClass.ts

// Episode categories
export enum ParticipantLevel {
    BEGINNER = 'BEGINNER',
    ADVANCE = 'ADVANCE'
  }
  
  // Source of information
  export enum InformationSource {
    INSTAGRAM = 'INSTAGRAM',
    TIKTOK = 'TIKTOK',
    WEBSITE = 'WEBSITE',
    FRIEND = 'FRIEND',
    FACULTY = 'FACULTY',
    OTHER = 'OTHER'
  }
  
  // Main participant model
  export interface BusinessClassParticipant {
    id: string;
    email: string;
    name: string;
    institution: string;
    
    // Participant preferences and profile
    participantLevel: ParticipantLevel;
    reasonForJoining: string;
    informationSource: InformationSource;
    otherInformationSource?: string; // If InformationSource.OTHER is selected
    
    // Verification and status - single ZIP file containing all required proofs
    socialMediaProofURL?: string | null; // URL to the ZIP file containing all proofs
    registrationDate: Date;
    
    // Limited slots tracking
    queuePosition?: number;
    assignedEmailSent: boolean;
    
    // System fields
    createdAt: Date;
    updatedAt?: Date;
  }
  
