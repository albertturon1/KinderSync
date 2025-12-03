import type { DatabaseSchema } from '@/types/realtime-database';

export const TEST_USERS = [
  {
    email: 'manager@test.com',
    password: 'Test123!',
    role: 'manager' as const,
  },
  {
    email: 'teacher@test.com',
    password: 'Test123!',
    role: 'teacher' as const,
  },
  {
    email: 'parent@test.com',
    password: 'Test123!',
    role: 'parent' as const,
  },
  {
    email: 'parent2@test.com',
    password: 'Test123!',
    role: 'parent' as const,
  },
] as const;

export const TEST_FACILITY = {
  'facility-1': {
    id: 'facility-1',
    name: 'Przedszkole Słoneczko',
    address: {
      street: 'Kwiatowa 15',
      city: 'Warszawa',
      postalCode: '00-001',
    },
    contactEmail: 'kontakt@przedszkole-sloneczko.pl',
    phoneNumber: '+48221234567',
    managerId: 'manager-1',
    status: 'active' as const,
    website: 'https://przedszkole-sloneczko.pl',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const TEST_GROUPS = {
  'group-1': {
    id: 'group-1',
    name: 'Żabki',
    facilityId: 'facility-1',
    teacherIds: {
      'teacher-1': true as const,
    },
    status: 'active' as const,
    colorCode: '#4ade80',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'group-2': {
    id: 'group-2',
    name: 'Bociany',
    facilityId: 'facility-1',
    teacherIds: {
      'teacher-1': true as const,
    },
    status: 'active' as const,
    colorCode: '#60a5fa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const TEST_CHILDREN = {
  'child-1': {
    id: 'child-1',
    firstName: 'Zofia',
    lastName: 'Kowalska',
    dateOfBirth: '2021-03-15',
    gender: 'female' as const,
    facilityId: 'facility-1',
    currentGroupId: 'group-1',
    parentIds: {
      'parent-1': true as const,
    },
    status: 'active' as const,
    allergies: 'Truskawki',
    notes: 'Uwielbia rysować i śpiewać',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'child-2': {
    id: 'child-2',
    firstName: 'Jakub',
    lastName: 'Kowalska',
    dateOfBirth: '2020-07-22',
    gender: 'male' as const,
    facilityId: 'facility-1',
    currentGroupId: 'group-1',
    parentIds: {
      'parent-1': true as const,
    },
    status: 'active' as const,
    notes: 'Bardzo energiczny, uwielbia zabawy na świeżym powietrzu',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'child-3': {
    id: 'child-3',
    firstName: 'Lena',
    lastName: 'Wiśniewska',
    dateOfBirth: '2021-11-08',
    gender: 'female' as const,
    facilityId: 'facility-1',
    currentGroupId: 'group-2',
    parentIds: {
      'parent-2': true as const,
    },
    status: 'active' as const,
    allergies: 'Cytrusy',
    notes: 'Spokojna i lubi czytać książki',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const TEST_USERS_PROFILES = {
  'manager-1': {
    role: TEST_USERS[0].role,
    email: TEST_USERS[0].email,
    id: 'manager-1',
    displayName: 'Jan Kowalski',
    facilityId: 'facility-1',
    canManageStaff: true,
    preferences: {
      theme: 'light' as const,
      notificationsEnabled: true,
      language: 'pl',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'teacher-1': {
    role: TEST_USERS[1].role,
    email: TEST_USERS[1].email,
    id: 'teacher-1',
    displayName: 'Anna Nowak',
    facilityId: 'facility-1',
    assignedGroupIds: {
      'group-1': true as const,
      'group-2': true as const,
    },
    title: 'Nauczyciel przedszkolny',
    preferences: {
      theme: 'light' as const,
      notificationsEnabled: true,
      language: 'pl',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'parent-1': {
    role: TEST_USERS[2].role,
    email: TEST_USERS[2].email,
    id: 'parent-1',
    displayName: 'Piotr Wiśniewski',
    childrenIds: {
      'child-1': true as const,
      'child-2': true as const,
    },
    isPayer: true,
    preferences: {
      theme: 'light' as const,
      notificationsEnabled: true,
      language: 'pl',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  'parent-2': {
    role: TEST_USERS[3].role,
    email: TEST_USERS[3].email,
    id: 'parent-2',
    displayName: 'Katarzyna Dąbrowska',
    childrenIds: {
      'child-3': true as const,
    },
    isPayer: false,
    preferences: {
      theme: 'light' as const,
      notificationsEnabled: true,
      language: 'pl',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export const TEST_LOOKUP_TABLES = {
  parentChildren: {
    'parent-1': {
      'child-1': true as const,
      'child-2': true as const,
    },
    'parent-2': {
      'child-3': true as const,
    },
  },
  groupChildren: {
    'group-1': {
      'child-1': true as const,
      'child-2': true as const,
    },
    'group-2': {
      'child-3': true as const,
    },
  },
  teacherGroups: {
    'teacher-1': {
      'group-1': true as const,
      'group-2': true as const,
    },
  },
  facilityUsers: {
    'facility-1': {
      'manager-1': {
        role: 'manager' as const,
      },
      'teacher-1': {
        role: 'teacher' as const,
      },
    },
  },
  facilityGroups: {
    'facility-1': {
      'group-1': true as const,
      'group-2': true as const,
    },
  },
};

// Sample activities for today
const today = new Date().toISOString().split('T')[0];

export const TEST_DATABASE: DatabaseSchema = {
  users: TEST_USERS_PROFILES,
  facilities: TEST_FACILITY,
  groups: TEST_GROUPS,
  children: TEST_CHILDREN,
  groupActivities: {
    'group-1': {
      [today]: {
        'activity-1': {
          id: 'activity-1',
          type: 'check_in' as const,
          childId: 'child-1',
          groupId: 'group-1',
          teacherId: 'teacher-1',
          timestamp: new Date().toISOString(),
          isParentVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'activity-2': {
          id: 'activity-2',
          type: 'meal' as const,
          childId: 'child-2',
          groupId: 'group-1',
          teacherId: 'teacher-1',
          timestamp: new Date().toISOString(),
          details: {
            subType: 'Śniadanie',
            amount: '100%',
          },
          isParentVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  childActivities: {
    'child-1': {
      [today]: {
        'activity-1': {
          id: 'activity-1',
          type: 'check_in' as const,
          childId: 'child-1',
          groupId: 'group-1',
          teacherId: 'teacher-1',
          timestamp: new Date().toISOString(),
          isParentVisible: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    },
  },
  parentChildren: TEST_LOOKUP_TABLES.parentChildren,
  groupChildren: TEST_LOOKUP_TABLES.groupChildren,
  teacherGroups: TEST_LOOKUP_TABLES.teacherGroups,
  facilityUsers: TEST_LOOKUP_TABLES.facilityUsers,
  facilityGroups: TEST_LOOKUP_TABLES.facilityGroups,
  facilityChildren: {
    'facility-1': {
      'child-1': true as const,
      'child-2': true as const,
      'child-3': true as const,
    },
  },
  presence: {},
};
