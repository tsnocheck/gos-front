// Типы для форм

export interface CreateProgramForm {
  title: string;
  description?: string;
  duration?: number;
  targetAudience?: string;
  competencies?: string;
  learningOutcomes?: string;
  content?: string;
  methodology?: string;
  assessment?: string;
  materials?: string;
  requirements?: string;
  nprContent?: string;
  pmrContent?: string;
  vrContent?: string;
}

export interface ExpertiseForm {
  criteriaEvaluation: Record<string, {
    rating: boolean;
    comment?: string;
    recommendation?: string;
  }>;
  additionalRecommendations?: string;
  conclusion?: string;
} 