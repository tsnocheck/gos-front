
export enum DictionaryType {
  
  WORKPLACE = 'workplace',
  
  DEPARTMENT = 'department',
  
  POSITION = 'position',
  
  ACADEMIC_DEGREE = 'academic_degree',
  
  SUBJECT = 'subject',
  
  INSTITUTIONS = 'institutions',
  
  SUBDIVISIONS = 'subdivisions',
  
  LABOR_FUNCTIONS = 'labor_functions',
  
  LABOR_ACTIONS = 'labor_actions',
  
  JOB_RESPONSIBILITIES = 'job_responsibilities',
  
  STUDENT_CATEGORIES = 'student_categories',
  
  EDUCATION_FORMS = 'education_forms',
  
  SUBJECTS = 'subjects',
  
  EXPERT_ALGORITHMS = 'expert_algorithms',
  
  KOIRO_SUBDIVISIONS = 'koiro_subdivisions',
  
  KOIRO_MANAGERS = 'koiro_managers',
}

export type TDictionaryType = DictionaryType | `${string}--${DictionaryType}`;
export enum DictionaryStatus {
  
  ACTIVE = 'active',
  
  INACTIVE = 'inactive',
}

export enum Standard {
  PROFESSIONAL = 'professional-standard',
  EKS = 'eks',
  BOTH = 'both',
}

export const standards: Record<Standard, string> = {
  [Standard.PROFESSIONAL]: 'Профессиональный стандарт',
  [Standard.EKS]: 'Единый квалификационный справочник',
  [Standard.BOTH]: 'Проф. стандарт + ЕКС',
};
export interface Dictionary {
  
  id: string;
  
  type: DictionaryType;
  
  value: string;
  
  description?: string;
  
  sortOrder?: number;
  
  status?: DictionaryStatus;
  
  createdAt: string | Date;
  
  updatedAt: string | Date;
}
