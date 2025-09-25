// Типы и enum'ы программ

import type { User } from './user.ts';
import type { Expertise } from './expertise.ts';
import type { Dictionary, Standard } from './index.ts';

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

export enum Equipment {
  COMPUTER = 'computer',
  PROJECTOR = 'projector',
  INTERACTIVE_BOARD = 'interactive_board',
  SPEAKERS = 'speakers',
  MARKER_BOARDS = 'marker_boards',
  OTHER = 'other',
}

export enum DistanceEquipment {
  PC_INTERNET = 'pc-internet',
  AUDIO_DEVICES = 'audio-devices',
  SOFTWARE = 'software',
  OTHER_DISTANCE = 'other-distance',
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
  abbreviation: string; // Сокращение (например, "КОИРО")
  fullname: string; // Полная расшифровка
}

export interface Module {
  section: ProgramSection;
  code: string; // Код модуля
  name: string; // Название модуля
  lecture: number; // Часы лекций
  practice: number; // Часы практики
  distant: number; // Часы дистанционного обучения
  kad: number; // Количество аудиторных дней

  // Шаг 7: Учебно-тематический план
  topics?: Topic[]; // Темы учебно-тематического плана (таблица)
  network?: NetworkOrg[]; // Организации для сетевой формы (таблица)
  networkEnabled?: boolean; // Используется ли сетевая форма
}

export interface Topic {
  name: string; // Название темы
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
  name: string; // Название аттестации
  lecture: number; // Часы лекций
  practice: number; // Часы практики
  distant: number; // Часы дистанционного обучения
  form: string; // Форма аттестации

  /** НОВОЕ!!! */
  requirements?: string; // Описание требований к выполнению
  criteria?: string; // Критерии оценивания
  examples?: string; // Примеры заданий
  attempts?: number; // Количество попыток
}

export interface NetworkOrg {
  org: string; // Наименование организации
  participation: string; // Участие в реализации
  form: string; // Форма участия
}

export interface OrgPedConditions {
  normativeDocuments?: string; // Нормативные документы
  mainLiterature?: string; // Основная литература
  additionalLiterature?: string; // Дополнительная литература
  electronicMaterials?: string; // Электронные учебные материалы
  internetResources?: string; // Интернет-ресурсы
  equipment?: Equipment[]; // Оборудование для аудиторных занятий (чекбоксы)
  otherEquipment?: string; // Иное оборудование (текст)
  distanceEquipment?: DistanceEquipment[]; // Оборудование для дистанционного обучения (чекбоксы)
  otherDistance?: string; // Иное оборудование для дистанционного обучения (текст)
  personnelProvision?: string; // Кадровое обеспечение
}

export interface Program {
  /** Идентификатор */
  id: string;
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

  institution?: string; // Краткое название выбранного учреждения (например, "КОИРО")
  customInstitution?: string; // Название учреждения, если выбран вариант "Иное"
  title: string; // Название программы

  author?: User;

  coAuthorIds: string[]; // ID соавторов

  abbreviations?: Abbreviation[]; // Массив сокращений (аббревиатура + расшифровка)

  relevance?: string; // Актуальность разработки программы
  goal?: string; // Цель реализации программы
  standard?: Standard; // Выбранный стандарт: "professional-standard", "eks" или "both"
  functions?: string[]; // Трудовые функции (если выбран проф. стандарт)
  actions?: string[]; // Трудовые действия (если выбран проф. стандарт)
  duties?: string[]; // Должностные обязанности (если выбран ЕКС)

  know?: string[]; // Что должен знать слушатель
  can?: string[]; // Что должен уметь слушатель

  category?: string; // Категория слушателей
  educationForm?: string; // Форма обучения (очная, заочная и т.д.)
  term?: number; // Срок освоения программы (часы)

  modules?: Module[];
  attestations?: Attestation[];

  orgPedConditions: OrgPedConditions; // См. ниже
}

export interface ProgramPDFProps {
  program: Partial<Program>;
  authors: User[];
  getDictionaryById: (id: string) => Dictionary | undefined;
  pageNumber?: number;
  [key: string]: any;
}

export type ExtendedProgram = Partial<Program>;
