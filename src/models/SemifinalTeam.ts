// models/Team.ts
export interface TeamMember {
    name: string;
    email?: string;
  }
  
  export interface TeamStageSubmission {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any;
    status: 'pending' | 'cleared' | 'rejected' | 'approved';
    submissionURL?: string;
    submissionDate?: Date;
    feedback?: string;
   
  }
  
  export interface Team {
    id: string;
    userId: string;            // References the user who created/owns the team
    competitionId: string;
    teamName: string;
    teamLeader: TeamMember;
    members: {
      member1?: TeamMember;
      member2?: TeamMember;
    };
    registrationStatus: 'pending' | 'approved' | 'rejected';
    registrationDocURL: string;
    registrationDate: Date;
    stages: {
      [key: number]: TeamStageSubmission;
    };
    createdAt: Date;
    updatedAt?: Date;
  }