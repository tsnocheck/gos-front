// Типы и enum'ы рекомендаций

import type { User } from './user';
import type { Program } from './program';

/** Статус рекомендации */
export enum RecommendationStatus {
  /** Активная */
  ACTIVE = 'active',
  /** Выполнена */
  RESOLVED = 'resolved',
  /** Неактивная */
  INACTIVE = 'inactive',
  /** В архиве */
  ARCHIVED = 'archived',
}

export enum RecommendationField {
  // Page 1
  TITLE = 'title',
  CUSTOM_INSTITUTION = 'customInstitution',

  // Abbreviations (ConstructorStep4)
  ABBREVIATION = 'abbreviation',
  FULLNAME = 'fullname',

  // Page 4 (ConstructorStep5)
  RELEVANCE = 'relevance',
  GOAL = 'goal',

  // Page 6 (modules)
  MODULE_NAME = 'module.name',
  MODULE_CODE = 'module.code',

  // Page 7 (topics)
  TOPIC_NAME = 'topic.name',

  // Attestations (ConstructorStep8)
  ATTESTATION_REQUIREMENTS = 'attestation.requirements',
}

export const recommendationFieldTranslations: Record<RecommendationField, string> = {
  // Page 1
  [RecommendationField.TITLE]: 'Название программы',
  [RecommendationField.CUSTOM_INSTITUTION]: 'Иное учреждение',

  // Abbreviations (ConstructorStep4)
  [RecommendationField.ABBREVIATION]: 'Аббревиатура',
  [RecommendationField.FULLNAME]: 'Расшифровка',

  // Page 4 (ConstructorStep5)
  [RecommendationField.RELEVANCE]: 'Актуальность разработки программы',
  [RecommendationField.GOAL]: 'Цель реализации программы',

  // Page 6 (modules)
  [RecommendationField.MODULE_NAME]: 'Название модуля',
  [RecommendationField.MODULE_CODE]: 'Код модуля',

  // Page 7 (topics)
  [RecommendationField.TOPIC_NAME]: 'Название темы',

  // Attestations (ConstructorStep8)
  [RecommendationField.ATTESTATION_REQUIREMENTS]: 'Описание требований к выполнению',
};

/** Рекомендация */
export interface Recommendation {
  /** Идентификатор */
  id: string;
  /** Заголовок рекомендации */
  title: string;
  /** Содержание рекомендации */
  content: string;
  /** Тип рекомендации — поле конструктора, к которому привязана рекомендация */
  type: RecommendationField;
  /** Статус рекомендации */
  status: RecommendationStatus;
  /** Приоритет (1-высокий, 2-средний, 3-низкий) */
  priority: number;
  /** Срок выполнения */
  dueDate?: string | Date;
  /** Ответ автора на рекомендацию */
  authorResponse?: string;
  /** Дата выполнения */
  resolvedAt?: string | Date;
  /** Обратная связь эксперта */
  expertFeedback?: string;
  /** Программа */
  program?: Program;
  /** ID программы */
  programId?: string;
  /** Создавший пользователь */
  createdBy: User;
  /** ID создавшего */
  createdById: string;
  /** Назначенный пользователь */
  assignedTo?: User;
  /** ID назначенного */
  assignedToId?: string;
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
}
