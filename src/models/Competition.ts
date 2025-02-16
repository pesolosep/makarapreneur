// models/Competition.ts
export interface Stage {
    title: string;
    guidelineFileURL: string;
    description: string;
    deadline: Date;  
    visibility: Boolean;     // Added deadline for each stage
  }
  
  export interface Competition {
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
 