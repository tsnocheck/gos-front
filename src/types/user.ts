
export enum UserRole {
  
  ADMIN = 'admin',
  
  EXPERT = 'expert',
  
  AUTHOR = 'author',
}
export enum UserStatus {
  
  ACTIVE = 'active',
  
  INACTIVE = 'inactive',
  
  ARCHIVED = 'archived',
  
  HIDDEN = 'hidden',
}
export interface User {
  
  id: string;
  
  email: string;
  
  password: string;
  
  roles: UserRole[];
  
  status: UserStatus;
  
  lastName?: string;
  
  firstName?: string;
  
  middleName?: string;
  
  phone?: string;
  
  position?: string;
  
  workplace?: string;
  
  department?: string;
  
  subjects?: string[];
  
  academicDegree?: string;
  
  invitationToken?: string;
  
  invitationExpiresAt?: string | Date;
  
  sessions?: Session[];
  
  createdAt: string | Date;
  
  updatedAt: string | Date;
}
export interface Session {
  
  id: string;
  
  sessionKey: string;
  
  accessToken: string;
  
  refreshToken: string;
  
  expiresAt: string | Date;
  
  userId: string;
  
  createdAt: string | Date;
}
export enum CandidateStatus {
  
  PENDING = 'pending',
  
  INVITED = 'invited',
  
  REGISTERED = 'registered',
  
  REJECTED = 'rejected',
}
export interface Candidate {
  
  id: string;
  
  email: string;
  
  firstName: string;
  
  lastName: string;
  
  middleName?: string;
  
  phone?: string;
  
  organization?: string;
  
  position?: string;
  
  proposedRoles: string[];
  
  comment?: string;
  
  status: CandidateStatus;
  
  invitedById?: string;
  
  invitedBy?: User;
  
  registeredUserId?: string;
  
  registeredUser?: User;
  
  createdAt: string | Date;
  
  updatedAt: string | Date;
}
