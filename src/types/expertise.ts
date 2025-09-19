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

export interface ExpertiseCriteriaDto {
  criterion1: boolean;
  criterion1Comment?: string;
  criterion2: boolean;
  criterion2Comment?: string;
  criterion3: boolean;
  criterion3Comment?: string;
  criterion4: boolean;
  criterion4Comment?: string;
  criterion5: boolean;
  criterion5Comment?: string;
  criterion6: boolean;
  criterion6Comment?: string;
  criterion7: boolean;
  criterion7Comment?: string;
  criterion8: boolean;
  criterion8Comment?: string;
  criterion9: boolean;
  criterion9Comment?: string;
  criterion10: boolean;
  criterion10Comment?: string;
  criterion11: boolean;
  criterion11Comment?: string;
  criterion12: boolean;
  criterion12Comment?: string;
  criterion13: boolean;
  criterion13Comment?: string;
  finalDecision: 'approve' | 'reject';
  generalComment?: string;
}

// DTOs aligned with backend
export interface CreateExpertiseDto {
  programId: string;
  expertId: string;
  initialComments?: string;
}

export interface UpdateExpertiseDto {
  generalFeedback?: string;
  recommendations?: string;
  conclusion?: string;
  relevanceScore?: number; // 0-10
  contentQualityScore?: number; // 0-10
  methodologyScore?: number; // 0-10
  practicalValueScore?: number; // 0-10
  innovationScore?: number; // 0-10
  expertComments?: string;
  isRecommendedForApproval?: boolean;
}

export interface CompleteExpertiseDto {
  generalFeedback: string;
  conclusion: string;
  relevanceScore: number; // 0-10
  contentQualityScore: number; // 0-10
  methodologyScore: number; // 0-10
  practicalValueScore: number; // 0-10
  innovationScore: number; // 0-10
  isRecommendedForApproval: boolean;
  recommendations?: string;
  expertComments?: string;
}

export interface ExpertTableFilters {
  status?: ExpertiseStatus;
  programTitle?: string;
  authorName?: string;
  dateFrom?: string | Date;
  dateTo?: string | Date;
  result?: 'positive' | 'negative';
}

export interface ExpertiseForRevisionDto {
  revisionComments: string; // Комментарии с замечаниями для доработки
  generalFeedback?: string; // Общий отзыв эксперта
  recommendations?: string; // Рекомендации по улучшению
}

export interface ResubmitAfterRevisionDto {
  revisionNotes: string; // Заметки автора о внесенных изменениях
  changesSummary?: string; // Краткое описание изменений
}
