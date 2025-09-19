// Типы для форм

export interface ExpertiseForm {
  criteriaEvaluation: Record<
    string,
    {
      rating: boolean;
      comment?: string;
      recommendation?: string;
    }
  >;
  additionalRecommendations?: string;
  conclusion?: string;
}
