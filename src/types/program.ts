// Типы и enum'ы программ

import type {User} from "./user.ts";
import type {Expertise} from "./expertise.ts";

/** Статус программы */
export enum ProgramStatus {
  /** Черновик */
  DRAFT = 'draft',
  /** Отправлена на экспертизу */
  SUBMITTED = 'submitted',
  /** На рассмотрении */
  IN_REVIEW = 'in_review',
  /** Одобрена */
  APPROVED = 'approved',
  /** Отклонена */
  REJECTED = 'rejected',
  /** В архиве */
  ARCHIVED = 'archived',
}

/** Раздел программы */
export enum ProgramSection {
  /** Нормативно-правовой раздел */
  NPR = 'npr',
  /** Предметно-методический раздел */
  PMR = 'pmr',
  /** Вариативный раздел */
  VR = 'vr',
}

/** Программа */
export interface Program {
  /** Идентификатор */
  id: string;
  /** Название программы */
  title: string;
  /** Описание программы */
  description?: string;
  /** Статус программы */
  status: ProgramStatus;
  /** Код программы */
  programCode?: string;
  /** Продолжительность в часах */
  duration?: number;
  /** Целевая аудитория */
  targetAudience?: string;
  /** Компетенции */
  competencies?: string;
  /** Результаты обучения */
  learningOutcomes?: string;
  /** Содержание программы */
  content?: string;
  /** Методология */
  methodology?: string;
  /** Оценка результатов */
  assessment?: string;
  /** Учебные материалы */
  materials?: string;
  /** Требования к участникам */
  requirements?: string;
  /** Нормативно-правовой раздел */
  nprContent?: string;
  /** Предметно-методический раздел */
  pmrContent?: string;
  /** Вариативный раздел */
  vrContent?: string;
  /** Версия программы */
  version: number;
  /** ID родительской версии */
  parentId?: string;
  /** Дата отправки на экспертизу */
  submittedAt?: string | Date;
  /** Дата одобрения */
  approvedAt?: string | Date;
  /** Дата архивирования */
  archivedAt?: string | Date;
  /** Причина отклонения */
  rejectionReason?: string;
  /** Автор программы */
  author: User;
  /** ID автора */
  authorId: string;
  /** Одобривший пользователь */
  approvedBy?: User;
  /** ID одобрившего */
  approvedById?: string;
  /** Экспертизы по программе */
  expertises?: Expertise[];
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
} 