import React, { useMemo } from 'react';
import { useRecommendationHook } from '@/hooks/useRecommendations';
import { RecommendationField } from '@/types/recommendation';
import SuggestionInput from './SuggestionInput';

interface RecommendationSuggestionInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  rows?: number;
  type: RecommendationField;
}

const RecommendationSuggestionInput: React.FC<RecommendationSuggestionInputProps> = ({
  type,
  ...props
}) => {
  const { getRecommendationsByType } = useRecommendationHook();

  const suggestions = useMemo(() => {
    const recommendations = getRecommendationsByType(type);
    return recommendations.map(rec => rec.content);
  }, [getRecommendationsByType, type]);

  return (
    <SuggestionInput
      {...props}
      suggestions={suggestions}
    />
  );
};

export default RecommendationSuggestionInput;
