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
      userId: string;
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
  
  // Example of a team document
  const exampleTeam: Omit<Team, 'id' | 'createdAt'> = {
    competitionId: "competition-id",
    teamName: "Team Innovation",
    teamLeader: {
      name: "John Doe",
      userId: "user-id",
      email: "john@example.com"
    },
    members: {
      member1: {
        name: "Jane Smith",
        email: "jane@example.com"
      },
      member2: {
        name: "Bob Wilson",
        email: "bob@example.com"
      }
    },
    registrationStatus: "pending",
    registrationDocURL: "",
    registrationDate: new Date(),
    stages: {
      1: {  // Preliminary
        status: "pending",
        submissionURL: "",
        submissionDate: undefined,
        feedback: ""
      },
      2: {  // Semifinal
        status: "pending",
        submissionURL: "",
        submissionDate: undefined,
        feedback: "",
        paidStatus: false
      },
      3: {  // Final
        status: "pending",
        submissionURL: "",
        submissionDate: undefined,
        feedback: ""
      }
    },
    updatedAt: new Date()
  };