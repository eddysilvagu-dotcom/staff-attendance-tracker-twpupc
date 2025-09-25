
export interface StaffMember {
  id: string;
  name: string;
  attendance: {
    [key: string]: boolean; // key is date string (YYYY-MM-DD), value is present/absent
  };
}

export interface WeeklyAttendance {
  [staffId: string]: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday', 
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const;

export type DayOfWeek = typeof DAYS_OF_WEEK[number];
