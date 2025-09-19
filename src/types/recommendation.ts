// Типы и enum'ы рекомендаций

import type { User } from './user';
import type { Program } from './program';

/** Статус рекомендации */
export enum RecommendationStatus {
  /** Активная */
  ACTIVE = 'active',
  /** Выполнена */
  RESOLVED = 'resolved',
  /** Проигнорирована */
  IGNORED = 'ignored',
  /** В архиве */
  ARCHIVED = 'archived',
}

/** Рекомендация */
export interface Recommendation {
  /** Идентификатор */
  id: string;
  /** Заголовок рекомендации */
  title: string;
  /** Содержание рекомендации */
  content: string;
  /** Тип рекомендации */
  type: string;
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
