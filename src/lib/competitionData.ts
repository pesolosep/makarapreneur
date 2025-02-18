 import { Competition } from "../models/Competition";
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
  
  export const initialCompetitions: Omit<Competition,  | 'createdAt' | 'updatedAt'>[] = [
    {
      id:'business-plan',
      name: COMPETITION_NAMES.BUSINESS_PLAN,
      description: "",
      registrationDeadline: addDays(baseDate, 30), // Registration deadline in 30 days
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45),
          visibility: true // Preliminary deadline in 45 days
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 60), // Semifinal deadline in 60 days
          visibility: false
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75), // Final deadline in 75 days
          visibility: false
        }
      }
    },
    {
      id:'business-case',
      name: COMPETITION_NAMES.BUSINESS_CASE,
      description: "",

      registrationDeadline: addDays(baseDate, 30),
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45),
          visibility: true
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",

          deadline: addDays(baseDate, 60),
          visibility: false
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75),
          visibility: false
        }
      }
    },
    {
      id:'highschool-business-plan',
      name: COMPETITION_NAMES.HIGH_SCHOOL,
      description: "",

      registrationDeadline: addDays(baseDate, 30),
      stages: {
        1: {
          title: STAGE_NAMES.PRELIMINARY,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 45),
          visibility: true
        },
        2: {
          title: STAGE_NAMES.SEMIFINAL,
          guidelineFileURL: "",
          description: "",

          deadline: addDays(baseDate, 60),
          visibility: false
        },
        3: {
          title: STAGE_NAMES.FINAL,
          guidelineFileURL: "",
          description: "",
          deadline: addDays(baseDate, 75),
          visibility: false
        }
      }
    }
  ];