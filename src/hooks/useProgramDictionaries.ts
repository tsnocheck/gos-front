import { useDictionaries } from '@/queries/dictionaries';
import { DictionaryType, type TDictionaryType } from '@/types';
import { useCallback } from 'react';

export const useProgramDictionaries = () => {
  const { data = [] } = useDictionaries();

  const getDictionaryById = useCallback(
    (id: string) => (data ?? []).find((dictionary) => dictionary.id === id),
    [data],
  );

  const getDictionaryByTypes = useCallback(
    (types: TDictionaryType[]) => {
      return data?.filter((dictionary) => types.includes(dictionary.type)) ?? [];
    },
    [data],
  );

  const getFullInstitutionName = useCallback(
    (shortName: string) => {
      const institution = data?.find(
        (dictionary) =>
          dictionary.type === DictionaryType.INSTITUTIONS && dictionary.value === shortName,
      );
      return institution?.description || shortName;
    },
    [data],
  );

  const getActions = useCallback(
    (functionIds: string[]) =>
      getDictionaryByTypes(
        (functionIds.map((functionId) => `${functionId}--${DictionaryType.LABOR_ACTIONS}`) ??
          []) as TDictionaryType[],
      ),
    [getDictionaryByTypes],
  );

  return {
    institutions: getDictionaryByTypes([DictionaryType.INSTITUTIONS]),
    functions: getDictionaryByTypes([DictionaryType.LABOR_FUNCTIONS]),
    categories: getDictionaryByTypes([DictionaryType.STUDENT_CATEGORIES]),
    educationForms: getDictionaryByTypes([DictionaryType.EDUCATION_FORMS]),
    duties: getDictionaryByTypes([DictionaryType.JOB_RESPONSIBILITIES]),

    getActions,
    getDictionaryById,
    getFullInstitutionName,
  };
};
