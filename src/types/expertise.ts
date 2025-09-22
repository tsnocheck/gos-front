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

export interface ExpertiseCriterions {
  // 1. Характеристика программы
  criterion1_1: Criterion; // Актуальность разработки и реализации программы
  criterion1_2: Criterion; // Цель и тема программы соответствуют друг другу
  criterion1_3: Criterion; // Профессиональный стандарт
  criterion1_4: Criterion; // Планируемые результаты обучения (знать/уметь)
  criterion1_5: Criterion; // Планируемые результаты обучения по программе

  // 2. Содержание программы
  criterion2_1: Criterion; // Содержание программы соответствует теме
  criterion2_2: Criterion; // Рабочие программы образовательных модулей
  criterion2_3: Criterion; // Содержание программы позволяет достигнуть планируемых результатов обучения
  criterion2_4: Criterion; // Формы и виды учебной деятельности слушателей

  // 3. Формы аттестации и оценочные материалы программы
  criterion3_1: Criterion; // Критерии оценки аттестации слушателей
  criterion3_2: Criterion; // Оценочные материалы по программе (знания)
  criterion3_3: Criterion; // Оценочные материалы по программе (умения)
  criterion3_4: Criterion; // Представленные примеры заданий аттестации

  // 4. Организационно-педагогические условия реализации программы
  criterion4_1: Criterion; // Список нормативно-правовых и методических документов
  criterion4_2: Criterion; // Список основной литературы
  criterion4_3: Criterion; // Список дополнительной литературы
  criterion4_4: Criterion; // Перечень ресурсов электронной поддержки
  criterion4_5: Criterion; // Технические средства обучения
}

/** Экспертиза */
export interface Expertise extends ExpertiseCriterions {
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
export interface SubmitExpertiseDto extends ExpertiseCriterions {
  additionalRecommendation?: string; // Дополнительные рекомендации
  generalFeedback?: string; // Общий отзыв эксперта
  conclusion?: string; // Заключение
}

/** Отправка на доработку */
export interface SendForRevisionDto {
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

/** Создание экспертизы */
export interface CreateExpertiseDto {
  programId: string;
  expertId: string;
  initialComments?: string;
}

/** Обновление экспертизы */
export interface UpdateExpertiseDto {
  status?: ExpertiseStatus;
  generalFeedback?: string;
  recommendations?: string;
  conclusion?: string;
  position?: ExpertPosition;
}

/** Фильтры для таблицы экспертов */
export interface ExpertTableFilters {
  status?: ExpertiseStatus;
  programId?: string;
  expertId?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
