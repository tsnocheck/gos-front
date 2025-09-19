// Типы и enum'ы пользователей, сессий и кандидатов

/** Роль пользователя */
export enum UserRole {
  /** Администратор */
  ADMIN = 'admin',
  /** Эксперт */
  EXPERT = 'expert',
  /** Автор */
  AUTHOR = 'author',
}

/** Статус пользователя */
export enum UserStatus {
  /** Активен */
  ACTIVE = 'active',
  /** Неактивен (до одобрения админом) */
  INACTIVE = 'inactive',
  /** Архивирован */
  ARCHIVED = 'archived',
  /** Скрыт */
  HIDDEN = 'hidden',
}

/** Пользователь */
export interface User {
  /** Идентификатор */
  id: string;
  /** Email (уникальный) */
  email: string;
  /** Хэш пароля */
  password: string;
  /** Роли пользователя */
  roles: UserRole[];
  /** Статус пользователя */
  status: UserStatus;
  /** Фамилия */
  lastName?: string;
  /** Имя */
  firstName?: string;
  /** Отчество */
  middleName?: string;
  /** Телефон */
  phone?: string;
  /** Должность */
  position?: string;
  /** Место работы */
  workplace?: string;
  /** Структурное подразделение */
  department?: string;
  /** Преподаваемые предметы */
  subjects?: string[];
  /** Ученая степень */
  academicDegree?: string;
  /** Токен для приглашения/смены пароля */
  invitationToken?: string;
  /** Время истечения приглашения */
  invitationExpiresAt?: string | Date;
  /** Сессии пользователя */
  sessions?: Session[];
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
}

/** Сессия пользователя */
export interface Session {
  /** Идентификатор сессии */
  id: string;
  /** Ключ сессии (уникальный) */
  sessionKey: string;
  /** Access-токен */
  accessToken: string;
  /** Refresh-токен */
  refreshToken: string;
  /** Время истечения сессии */
  expiresAt: string | Date;
  /** ID пользователя */
  userId: string;
  /** Дата создания сессии */
  createdAt: string | Date;
}

/** Статус кандидата */
export enum CandidateStatus {
  /** Ожидает приглашения */
  PENDING = 'pending',
  /** Приглашён */
  INVITED = 'invited',
  /** Зарегистрирован */
  REGISTERED = 'registered',
  /** Отклонён */
  REJECTED = 'rejected',
}

/** Кандидат */
export interface Candidate {
  /** Идентификатор */
  id: string;
  /** Email (уникальный) */
  email: string;
  /** Имя */
  firstName: string;
  /** Фамилия */
  lastName: string;
  /** Отчество */
  middleName?: string;
  /** Телефон */
  phone?: string;
  /** Организация */
  organization?: string;
  /** Должность */
  position?: string;
  /** Предлагаемые роли */
  proposedRoles: string[];
  /** Комментарий */
  comment?: string;
  /** Статус кандидата */
  status: CandidateStatus;
  /** ID пригласившего пользователя */
  invitedById?: string;
  /** Пригласивший пользователь */
  invitedBy?: User;
  /** ID зарегистрированного пользователя */
  registeredUserId?: string;
  /** Зарегистрированный пользователь */
  registeredUser?: User;
  /** Дата создания */
  createdAt: string | Date;
  /** Дата обновления */
  updatedAt: string | Date;
}
