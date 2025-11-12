import type { User } from './user.ts';
import type { Expertise } from './expertise.ts';
import type { Dictionary, Standard } from './index.ts';

export enum ProgramStatus {
  
  DRAFT = 'draft',
  
  SUBMITTED = 'submitted',
  
  IN_REVIEW = 'in_review',
  
  APPROVED = 'approved',
  
  REJECTED = 'rejected',
  
  ARCHIVED = 'archived',
}

export enum ProgramSection {
  NPR = 'npr',
  PMR = 'pmr',
  VR = 'vr',
}

export const programSection: {
  full: Record<ProgramSection, string>;
  short: Record<ProgramSection, string>;
} = {
  full: {
    [ProgramSection.NPR]: 'Нормативно-правовой раздел',
    [ProgramSection.PMR]: 'Предметно-методический раздел',
    [ProgramSection.VR]: 'Вариативный раздел',
  },
  short: {
    [ProgramSection.NPR]: 'НПР',
    [ProgramSection.PMR]: 'ПМР',
    [ProgramSection.VR]: 'ВР',
  },
};

export const attestationForms = ['Тест', 'Практическая работа', 'Кейс'];

export interface Abbreviation {
  abbreviation: string;
  fullname: string;
}

export interface Module {
  section: ProgramSection;
  code: string;
  name: string;
  lecture: number;
  practice: number;
  distant: number;
  kad: number;

  topics?: Topic[];
  network?: NetworkOrg[];
  networkEnabled?: boolean;
}

export interface Topic {
  name: string;
  lecture?: TopicContent;
  practice?: TopicContent;
  distant?: TopicContent;
}

export interface TopicContent {
  content: string[];
  forms: string[];
  hours: number;
}

export interface Attestation {
  moduleCode?: string;
  name: string;
  lecture: number;
  practice: number;
  distant: number;
  form: string;
  requirements?: string;
  criteria?: string;
  examples?: string;
  attempts?: number;

  kad?: number;
}

export interface NetworkOrg {
  org: string;
  participation: string;
  form: string;
}

export interface OrgPedConditions {
  normativeDocuments?: string;
  mainLiterature?: string;
  additionalLiterature?: string;
  electronicMaterials?: string;
  internetResources?: string;
  personnelProvision?: string;

  equipment?: string;
}

export interface Program {
  id: string;
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
  submittedAt?: string | Date;
  approvedAt?: string | Date;
  archivedAt?: string | Date;
  rejectionReason?: string;
  authorId: string;
  approvedBy?: User;
  approvedById?: string;
  expertises?: Expertise[];
  createdAt: string | Date;
  updatedAt: string | Date;

  institution?: string;
  customInstitution?: string;

  title: string;

  type?: string;

  author?: User;

  coAuthorIds: string[];

  abbreviations?: Abbreviation[];

  relevance?: string;
  goal?: string;
  standard?: Standard;
  functions?: string[];
  actions?: string[];
  duties?: string[];

  know?: string[];
  can?: string[];

  category?: string;
  educationForm?: string;
  term?: number;

  modules?: Module[];
  attestations?: Attestation[];

  orgPedConditions: OrgPedConditions;
}

export interface ProgramPDFProps {
  program: Partial<Program>;
  authors: User[];
  getDictionaryById: (id: string) => Dictionary | undefined;
  pageNumber?: number;
  [key: string]: any;
}

export type ExtendedProgram = Partial<Program>;
