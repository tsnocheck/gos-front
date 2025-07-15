// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  position: string;
  workplace: string;
  department: string;
  subjects: string[];
  academicDegree: string;
  roles: UserRole[];
  status: UserStatus;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  EXPERT = 'expert',
  AUTHOR = 'author'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
  HIDDEN = 'hidden'
}

// Program types
export interface Program {
  id: string;
  title: string;
  description?: string;
  status: ProgramStatus;
  programCode?: string;
  duration?: number;
  targetAudience?: string;
  competencies?: string;
  learningOutcomes?: string;
  content?: string;
  methodology?: string;
  assessment?: string;
  materials?: string;
  requirements?: string;
  nprContent?: string;
  pmrContent?: string;
  vrContent?: string;
  version: number;
  parentId?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  archivedAt?: Date;
  rejectionReason?: string;
  author: User;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProgramStatus {
  DRAFT = 'draft',
  IN_DEVELOPMENT = 'in_development',
  ON_EXPERTISE = 'on_expertise',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
}

// Expertise types
export interface Expertise {
  id: string;
  program: Program;
  expert: User;
  status: ExpertiseStatus;
  criteriaEvaluation?: CriteriaEvaluation;
  additionalRecommendations?: string;
  conclusion: ExpertiseConclusion;
  submittedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum ExpertiseStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ExpertiseConclusion {
  POSITIVE = 'positive',
  NEGATIVE = 'negative'
}

export interface CriteriaEvaluation {
  [key: string]: {
    rating: boolean;
    comment?: string;
    recommendation?: string;
  };
}

// Dictionary types
export interface Dictionary {
  id: string;
  type: DictionaryType;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum DictionaryType {
  INSTITUTIONS = 'INSTITUTIONS',
  SUBDIVISIONS = 'SUBDIVISIONS',
  POSITIONS = 'POSITIONS',
  ACADEMIC_DEGREES = 'ACADEMIC_DEGREES',
  SUBJECTS = 'SUBJECTS',
  LABOR_FUNCTIONS = 'LABOR_FUNCTIONS',
  LABOR_ACTIONS = 'LABOR_ACTIONS',
  STUDENT_CATEGORIES = 'STUDENT_CATEGORIES',
  EDUCATION_FORMS = 'EDUCATION_FORMS',
  EDUCATION_TECHNOLOGIES = 'EDUCATION_TECHNOLOGIES',
  COMPETENCY_TYPES = 'COMPETENCY_TYPES',
  ASSESSMENT_METHODS = 'ASSESSMENT_METHODS',
  DIFFICULTY_LEVELS = 'DIFFICULTY_LEVELS',
  PROGRAM_DIRECTIONS = 'PROGRAM_DIRECTIONS'
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  position: string;
  workplace: string;
  department: string;
  subjects: string[];
  academicDegree: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: User;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Form types
export interface CreateProgramForm {
  title: string;
  description?: string;
  duration?: number;
  targetAudience?: string;
  competencies?: string;
  learningOutcomes?: string;
  content?: string;
  methodology?: string;
  assessment?: string;
  materials?: string;
  requirements?: string;
  nprContent?: string;
  pmrContent?: string;
  vrContent?: string;
}

export interface ExpertiseForm {
  criteriaEvaluation: CriteriaEvaluation;
  additionalRecommendations?: string;
  conclusion: ExpertiseConclusion;
}

// Recommendation types
export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  content: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  dueDate?: Date;
  createdBy: User;
  assignedTo?: User;
  program?: Program;
  createdAt: Date;
  updatedAt: Date;
}

export enum RecommendationType {
  GENERAL = 'general',
  CONTENT = 'content',
  METHODOLOGY = 'methodology',
  STRUCTURE = 'structure',
  ASSESSMENT = 'assessment'
}

export enum RecommendationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum RecommendationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Program creation types
export interface CreateProgramRequest {
  title: string;
  description: string;
  category: string;
  duration: number;
  targetAudience: string;
  prerequisites: string;
  learningOutcomes: string[];
  sections: ProgramSectionRequest[];
}

export interface ProgramSectionRequest {
  title: string;
  description: string;
  duration: number;
  topics: string[];
  materials: string[];
}

// Update program type
export interface UpdateProgramRequest extends Partial<CreateProgramRequest> {
  id: string;
}
