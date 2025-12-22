import type { User } from './user';
import type { Program } from './program';

export enum RecommendationStatus {
  
  ACTIVE = 'active',
  
  RESOLVED = 'resolved',
  
  INACTIVE = 'inactive',
  
  ARCHIVED = 'archived',
}

export enum RecommendationField {
  TITLE = 'title',
  CUSTOM_INSTITUTION = 'customInstitution',

  ABBREVIATION = 'abbreviation',
  FULLNAME = 'fullname',

  RELEVANCE = 'relevance',
  GOAL = 'goal',

  MODULE_NAME = 'module.name',
  MODULE_CODE = 'module.code',

  TOPIC_NAME = 'topic.name',

  ATTESTATION_REQUIREMENTS = 'attestation.requirements',
}

export const recommendationFieldTranslations: Record<RecommendationField, string> = {
  [RecommendationField.TITLE]: 'Название программы',
  [RecommendationField.CUSTOM_INSTITUTION]: 'Иное учреждение',

  [RecommendationField.ABBREVIATION]: 'Аббревиатура',
  [RecommendationField.FULLNAME]: 'Расшифровка',

  [RecommendationField.RELEVANCE]: 'Актуальность разработки программы',
  [RecommendationField.GOAL]: 'Цель реализации программы',

  [RecommendationField.MODULE_NAME]: 'Название модуля',
  [RecommendationField.MODULE_CODE]: 'Код модуля',

  [RecommendationField.TOPIC_NAME]: 'Название темы',

  [RecommendationField.ATTESTATION_REQUIREMENTS]: 'Описание требований к выполнению',
};

export interface Recommendation {
  id: string;
  title: string;
  content: string;
  type: RecommendationField;
  status: RecommendationStatus;
  priority: number;
  dueDate?: string | Date;
  authorResponse?: string;
  resolvedAt?: string | Date;
  expertFeedback?: string;
  program?: Program;
  programId?: string;
  createdBy: User;
  createdById: string;
  assignedTo?: User;
  assignedToId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
