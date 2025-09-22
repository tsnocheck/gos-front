import { useRecommendations } from '@/queries/recommendations';
import { RecommendationField } from '@/types/recommendation';
import { useCallback } from 'react';

export const useRecommendationHook = () => {
  const { data } = useRecommendations();

  const getRecommendationsByType = useCallback(
    (type: RecommendationField) => {
      return data?.data.filter((item) => item.type === type) ?? [];
    },
    [data],
  );

  return {
    getRecommendationsByType,
  };
};
