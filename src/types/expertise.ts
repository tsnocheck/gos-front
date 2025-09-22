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

export enum ExpertPosition {
  FIRST = 'first',
  SECOND = 'second',
  THIRD = 'third',
}

/** Критерий экспертизы */
export interface Criterion {
  value: boolean;
  comment?: string;
  recommendation?: string;
}

/** Экспертиза */
export interface Expertise {
  /** Идентификатор */
  id: string;

  /** Статус экспертизы */
  status: ExpertiseStatus;

  /** Позиция эксперта (первый, второй, третий) */
  position?: ExpertPosition;

  /** Дата назначения эксперта */
  assignedAt?: string | Date;

  /** Общий отзыв эксперта */
  generalFeedback?: string | null;

  /** Рекомендации */
  recommendations?: string | null;

  /** Заключение */
  conclusion?: string | null;

  // --- Критерии ---

  /** 1.1. Актуальность разработки и реализации */
  criterion1_1?: Criterion;

  /** 1.2. Цель и тема программы */
  criterion1_2?: Criterion;

  /** 1.3. Профессиональный стандарт */
  criterion1_3?: Criterion;

  /** 1.4. Планируемые результаты (знать/уметь) */
  criterion1_4?: Criterion;

  /** 1.5. Планируемые результаты по программе */
  criterion1_5?: Criterion;

  /** 2.1. Содержание соответствует теме */
  criterion2_1?: Criterion;

  /** 2.2. Рабочие программы соответствуют плану */
  criterion2_2?: Criterion;

  /** Дополнительные рекомендации */
  additionalRecommendation?: string | null;

  /** Дата завершения экспертизы */
  reviewedAt?: string | Date;

  /** Рекомендуется к одобрению */
  isRecommendedForApproval: boolean;

  /** Комментарии для доработки */
  revisionComments?: string | null;

  /** Дата отправки на доработку */
  sentForRevisionAt?: string | Date;

  /** Номер круга доработки */
  revisionRound: number;

  // --- Связи ---
  program: Program;
  programId: string;

  expert: User;
  expertId: string;

  assignedBy?: User | null;
  assignedById?: string | null;

  /** Дата создания */
  createdAt: string | Date;

  /** Дата обновления */
  updatedAt: string | Date;
}

/** Отправка заполненной экспертизы */
export interface SubmitExpertiseDto {
  // 1. Характеристика программы
  criterion1_1: Criterion; // Актуальность разработки и реализации программы
  criterion1_2: Criterion; // Цель и тема программы соответствуют друг другу
  criterion1_3: Criterion; // Профессиональный стандарт
  criterion1_4: Criterion; // Планируемые результаты обучения (знать/уметь)
  criterion1_5: Criterion; // Планируемые результаты обучения по программе

  // 2. Содержание программы
  criterion2_1: Criterion; // Содержание программы соответствует теме
  criterion2_2: Criterion; // Рабочие программы образовательных модулей

  additionalRecommendation?: string; // Дополнительные рекомендации
  generalFeedback?: string; // Общий отзыв эксперта
  conclusion?: string; // Заключение
}

/** Отправка на доработку */
export interface ResubmitAfterRevisionDto {
  revisionComments: string; // Комментарии с замечаниями для доработки
  generalFeedback?: string; // Общий отзыв эксперта
  recommendations?: string; // Рекомендации по улучшению
}

/** Назначение эксперта */
export interface AssignExpertDto {
  expertId: string; // ID эксперта
  assignmentMessage?: string; // Сообщение при назначении
}

/** Фильтрация/запрос экспертиз */
export interface ExpertiseQueryDto {
  status?: ExpertiseStatus;
  expertId?: string;
  programId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number; // >= 1
  limit?: number; // 1–100
}
