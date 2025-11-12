import type { Program } from './program';
import type { User } from './user';

export enum ExpertiseStatus {
  
  PENDING = 'pending',
  
  IN_PROGRESS = 'in_progress',
  
  COMPLETED = 'completed',
  
  APPROVED = 'approved',
  
  REJECTED = 'rejected',
}

export enum ExpertPosition {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
}

export interface Criterion {
  value: boolean;
  comment?: string;
  recommendation?: string;
}

export interface ExpertiseCriterions {
  criterion1_1: Criterion;
  criterion1_2: Criterion;
  criterion1_3: Criterion;
  criterion1_4: Criterion;
  criterion1_5: Criterion;
  criterion2_1: Criterion;
  criterion2_2: Criterion;
  criterion2_3: Criterion;
  criterion2_4: Criterion;

  criterion3_1: Criterion;
  criterion3_2: Criterion;
  criterion3_3: Criterion;
  criterion3_4: Criterion;
  criterion4_1: Criterion;
  criterion4_2: Criterion;
  criterion4_3: Criterion;
  criterion4_4: Criterion;
  criterion4_5: Criterion;
}

export interface Expertise extends ExpertiseCriterions {
  id: string;

  status: ExpertiseStatus;

  position?: ExpertPosition;

  assignedAt?: string | Date;

  generalFeedback?: string | null;

  recommendations?: string | null;

  conclusion?: string | null;

  additionalRecommendation?: string | null;

  reviewedAt?: string | Date;

  isRecommendedForApproval: boolean;

  revisionComments?: string | null;

  sentForRevisionAt?: string | Date;

  revisionRound: number;

  program: Program;
  programId: string;

  expert: User;
  expertId: string;

  assignedBy?: User | null;
  assignedById?: string | null;

  createdAt: string | Date;

  updatedAt: string | Date;
}

export interface SubmitExpertiseDto extends ExpertiseCriterions {
  additionalRecommendation?: string;
  generalFeedback?: string;
  conclusion?: string;
}

export interface SendForRevisionDto {
  revisionComments: string;
  generalFeedback?: string;
  recommendations?: string;
}

export interface AssignExpertDto {
  expertId: string;
  assignmentMessage?: string;
}

export interface ExpertiseQueryDto {
  status?: ExpertiseStatus;
  expertId?: string;
  programId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface CreateExpertiseDto {
  programId: string;
  expertId: string;
  initialComments?: string;
}

export interface UpdateExpertiseDto {
  status?: ExpertiseStatus;
  generalFeedback?: string;
  recommendations?: string;
  conclusion?: string;
  position?: ExpertPosition;
}

export interface ExpertTableFilters {
  status?: ExpertiseStatus;
  programId?: string;
  expertId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
