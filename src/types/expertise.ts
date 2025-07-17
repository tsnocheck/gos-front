// Типы и enum'ы экспертиз

import type { Program } from './program';
import type { User } from './user';

/** Статус экспертизы */
export enum ExpertiseStatus {
  /** Ожидает экспертизы */
  PENDING = 'pending',
  /** В процессе экспертизы */
  IN_PROGRESS = 'in_progress',
  /** Экспертиза завершена */
  COMPLETED = 'completed',
  /** Одобрено экспертом */
  APPROVED = 'approved',
  /** Отклонено экспертом */
  REJECTED = 'rejected',
}

/** Экспертиза */
export interface Expertise {
  /** Идентификатор */
  id: string;
  /** Статус экспертизы */
  status: ExpertiseStatus;
  /** Общий отзыв эксперта */
  generalFeedback: string;
  /** Рекомендации */
  recommendations: string;
  /** Заключение */
  conclusion: string;
  /** Актуальность (0-10) */
  relevanceScore: number;
  /** Качество содержания (0-10) */
  contentQualityScore: number;
  /** Методология (0-10) */
  methodologyScore: number;
  /** Практическая ценность (0-10) */
  practicalValueScore: number;
  /** Инновационность (0-10) */
  innovationScore: number;
  /** Общая оценка */
  totalScore: number;
  /** Дата завершения экспертизы */
  reviewedAt?: string | Date;
  /** Комментарии эксперта */
  expertComments: string;
  /** Рекомендуется к одобрению */
  isRecommendedForApproval: boolean;
  /** Программа */
  program: Program;
  /** ID программы */
  programId: string;
  /** Эксперт */
  expert: User;
  /** ID эксперта */
  expertId: string;
  /** Кем назначено */
  assignedBy?: User;
  /** ID назначившего */
  assignedById?: string;
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
} 