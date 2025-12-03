/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { Activity, Child, Facility, Group, Presence, UserProfile } from '@/lib/validation/schemas';

export interface DatabaseSchema {
  users: Record<string, UserProfile>;
  facilities: Record<string, Facility>;
  groups: Record<string, Group>;
  children: Record<string, Child>;
  // for teacher
  groupActivities: {
    [groupId: string]: {
      [date: string]: {
        [activityId: string]: Activity;
      };
    };
  };

  // for parent
  childActivities: {
    [childId: string]: {
      [date: string]: {
        [activityId: string]: Activity;
      };
    };
  };

  parentChildren: {
    [parentId: string]: {
      [childId: string]: true;
    };
  };

  groupChildren: {
    [groupId: string]: {
      [childId: string]: true;
    };
  };

  teacherGroups: {
    [teacherId: string]: {
      [groupId: string]: true;
    };
  };

  facilityChildren: {
    [facilityId: string]: {
      [childId: string]: true;
    };
  };

  facilityUsers: {
    [facilityId: string]: {
      [userId: string]: {
        role: UserProfile['role'];
      };
    };
  };

  facilityGroups: {
    [facilityId: string]: {
      [groupId: string]: true;
    };
  };

  presence: {
    [userId: string]: Presence;
  };
}
