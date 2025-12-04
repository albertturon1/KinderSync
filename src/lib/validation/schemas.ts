import { z } from 'zod';

export const BaseEntitySchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notificationsEnabled: z.boolean(),
  language: z.string().default('pl'),
});

export const BaseProfileSchema = BaseEntitySchema.extend({
  email: z.email(),
  displayName: z.string().min(2),
  facilityId: z.string().optional(),
  avatarUrl: z.url().optional(),
  preferences: PreferencesSchema.optional(),
  fcmToken: z.string().optional(),
});

export const TeacherProfileSchema = BaseProfileSchema.extend({
  role: z.literal('teacher'),
  assignedGroupIds: z.record(z.string(), z.boolean()).optional(),
  title: z.string().optional(),
});

export const ParentProfileSchema = BaseProfileSchema.extend({
  role: z.literal('parent'),
  childrenIds: z.record(z.string(), z.boolean()),
  isPayer: z.boolean().default(false),
});

export const ManagerProfileSchema = BaseProfileSchema.extend({
  role: z.literal('manager'),
  canManageStaff: z.boolean().default(true),
});

export const UserProfileSchema = z.discriminatedUnion('role', [
  TeacherProfileSchema,
  ParentProfileSchema,
  ManagerProfileSchema,
]);

export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
});

export const FacilitySchema = BaseEntitySchema.extend({
  name: z.string().min(1),
  address: AddressSchema,
  contactEmail: z.email(),
  phoneNumber: z.string(),
  managerId: z.string(),
  status: z.enum(['active', 'inactive', 'maintenance']),
  website: z.url().optional(),
  logoUrl: z.url().optional(),
});

export const GroupSchema = BaseEntitySchema.extend({
  name: z.string(),
  facilityId: z.string(),
  teacherIds: z.record(z.string(), z.boolean()).optional(),
  status: z.enum(['active', 'archived']),
  colorCode: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});
export const ChildSchema = BaseEntitySchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female']),
  facilityId: z.string(),
  currentGroupId: z.string(),
  parentIds: z.record(z.string(), z.boolean()),
  status: z.enum(['active', 'graduated', 'transferred']),
  photoUrl: z.url().optional(),
  allergies: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const ActivityTypeSchema = z.enum([
  'check_in',
  'check_out',
  'meal',
  'nap',
  'diaper',
  'play',
  'learning',
  'incident',
  'photo',
  'other',
]);

export const ActivityDetailsSchema = z.object({
  subType: z.string().optional(),
  amount: z.string().optional(),
  duration: z.string().optional(),
  mood: z.enum(['excellent', 'good', 'sad', 'angry', 'tired']).optional(),
  description: z.string().optional(),
  photoPaths: z.array(z.string()).optional(),
});

export const ActivitySchema = BaseEntitySchema.extend({
  type: ActivityTypeSchema,
  childId: z.string(),
  groupId: z.string(),
  teacherId: z.string(),
  timestamp: z.iso.datetime(),
  details: ActivityDetailsSchema.optional(),
  isParentVisible: z.boolean().default(true),
  _syncedAt: z.string().optional(),
});

export const PresenceStateEnum = z.enum(['online', 'offline']);
export const PlatformEnum = z.enum(['ios', 'android', 'web']);

export const PresenceSchema = z.object({
  state: PresenceStateEnum,
  lastChanged: z.number(),
  platform: PlatformEnum.optional(),
  currentVersion: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type Facility = z.infer<typeof FacilitySchema>;
export type Group = z.infer<typeof GroupSchema>;
export type Child = z.infer<typeof ChildSchema>;
export type Activity = z.infer<typeof ActivitySchema>;
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type Presence = z.infer<typeof PresenceSchema>;