import type { Expertise } from '@/types';

export const getExpertsFromExpertises = (expertises?: Expertise[]) => {
  return expertises?.map((expertise) => expertise.expert) ?? [];
};
