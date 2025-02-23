
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
  paidStatus?: boolean;      // Only for semifinal stage
}

export interface Team {
  id: string;
  userId: string;            // Add this: references the user who created/owns the team
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
  registrationDate: Date;
  stages: {
    [key: number]: TeamStageSubmission;
  };
  createdAt: Date;
  updatedAt?: Date;
}