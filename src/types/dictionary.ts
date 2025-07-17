// Типы и enum'ы справочников

/** Тип справочника */
export enum DictionaryType {
  /** Место работы */
  WORKPLACE = 'workplace',
  /** Структурное подразделение */
  DEPARTMENT = 'department',
  /** Должность */
  POSITION = 'position',
  /** Учёная степень */
  ACADEMIC_DEGREE = 'academic_degree',
  /** Учебный предмет */
  SUBJECT = 'subject',
  /** Учреждение */
  INSTITUTIONS = 'institutions',
  /** Подразделение */
  SUBDIVISIONS = 'subdivisions',
  /** Трудовые функции */
  LABOR_FUNCTIONS = 'labor_functions',
  /** Трудовые действия */
  LABOR_ACTIONS = 'labor_actions',
  /** Должностные обязанности */
  JOB_RESPONSIBILITIES = 'job_responsibilities',
  /** Категории слушателей */
  STUDENT_CATEGORIES = 'student_categories',
  /** Формы обучения */
  EDUCATION_FORMS = 'education_forms',
  /** Учебные предметы */
  SUBJECTS = 'subjects',
  /** Алгоритмы назначения экспертов */
  EXPERT_ALGORITHMS = 'expert_algorithms',
  /** Подразделения КОИРО */
  KOIRO_SUBDIVISIONS = 'koiro_subdivisions',
  /** Руководители КОИРО */
  KOIRO_MANAGERS = 'koiro_managers',
}

/** Статус справочника */
export enum DictionaryStatus {
  /** Активен */
  ACTIVE = 'active',
  /** Неактивен */
  INACTIVE = 'inactive',
}

/** Справочник */
export interface Dictionary {
  /** Идентификатор */
  id: string;
  /** Тип справочника */
  type: DictionaryType;
  /** Значение справочника */
  value: string;
  /** Описание значения */
  description?: string;
  /** Порядок сортировки */
  sortOrder: number;
  /** Статус справочника */
  status: DictionaryStatus;
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
  /** Полное название (для учреждений) */
  fullName?: string;
  /** Связь с родительским элементом */
  parentId?: string;
  /** Дополнительные данные в JSON формате */
  metadata?: any;
} 