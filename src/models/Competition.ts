// models/Competition.ts
export interface Stage {
    title: string;
    guidelineFileURL: string;
    description: string;
    deadline: Date;       // Added deadline for each stage
  }
  
  export interface Competition {
    id: string;
    name: string;
    description: string;
    currentStage: number; // 1, 2, or 3
    registrationDeadline: Date; // Added registration deadline
    stages: {
      [key: number]: Stage;
    };
    createdAt: Date;
    updatedAt?: Date;
  }
  
  // lib/competitionData.ts
  export const COMPETITION_NAMES = {
    BUSINESS_PLAN: "Business Plan Competition",
    BUSINESS_CASE: "Business Case Competition",
    HIGH_SCHOOL: "High School Business Plan Competition"
  } as const;
  
  export const STAGE_NAMES = {
    PRELIMINARY: "Preliminary",
    SEMIFINAL: "Semifinal",
    FINAL: "Final"
  } as const;
  
  // Helper function to add days to a date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  // Get base date for deadlines
  const baseDate = new Date();
  
  export const initialCompetitions: Omit<Competition, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: COMPETITION_NAMES.BUSINESS_PLAN,
      description: "",
      currentStage: 1,
      registrationDeadline: addDays(baseDate, 30), // Registration deadline in 30 days
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45) // Preliminary deadline in 45 days
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 60) // Semifinal deadline in 60 days
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75) // Final deadline in 75 days
        }
      }
    },
    {
      name: COMPETITION_NAMES.BUSINESS_CASE,
      description: "",
      currentStage: 1,
      registrationDeadline: addDays(baseDate, 30),
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45)
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",

          deadline: addDays(baseDate, 60)
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75)
        }
      }
    },
    {
      name: COMPETITION_NAMES.HIGH_SCHOOL,
      description: "",
      currentStage: 1,
      registrationDeadline: addDays(baseDate, 30),
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45)
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",

          deadline: addDays(baseDate, 60)
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75)
        }
      }
    }
  ];