// models/Competition.ts
export interface Stage {
    title: string;
    guidelineFileURL: string;
    description: string;
    deadline: Date;  
    visibility: boolean;     // Added deadline for each stage
  }
  
  export interface Competition {
    registrationUrl: string;
    id: string;
    name: string;
    description: string;
    registrationDeadline: Date; // Added registration deadline
    stages: {
      [key: number]: Stage;
    };
    createdAt: Date;
    updatedAt?: Date;
  }
 