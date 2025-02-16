// models/Team.ts
export interface TeamMember {
    name: string;
    email?: string;
  }
  
  export interface TeamStageSubmission {
    status: 'pending' | 'cleared' | 'rejected';
    submissionURL?: string;
    submissionDate?: Date;
    feedback?: string;
    paidStatus?: boolean;      // Only for semifinal stage
  }
  
  export interface Team {
    id: string;
    competitionId: string;
    teamName: string;
    teamLeader: {
      name: string;
  
      email: string;
    };
    members: {
      member1?: TeamMember;
      member2?: TeamMember;
    };
    registrationStatus: 'pending' | 'approved' | 'rejected';
    registrationDocURL: string;
    registrationDate: Date;    // Added to track against competition registration deadline
    stages: {
      [key: number]: TeamStageSubmission;
    };
    createdAt: Date;
    updatedAt?: Date;
  }
  
