import { apiClient } from '../lib/api';
import { type Dictionary, DictionaryType, type DictionaryStatus } from '../types';

export interface CreateDictionaryData {
  type: DictionaryType;
  value: string;
  description?: string;
  sortOrder?: number;
  status?: DictionaryStatus;
}

export interface UpdateDictionaryData {
  value?: string;
  description?: string;
  sortOrder?: number;
  status?: DictionaryStatus;
}

export const dictionaryService = {
  // Получение справочников
  async getDictionaries(): Promise<Dictionary[]> {
    return apiClient.get<Dictionary[]>('/dictionaries/all');
  },

  async getDictionaryByType(type: DictionaryType | string): Promise<Dictionary[]> {
    return apiClient.get<Dictionary[]>(`/dictionaries/type/${type}`);
  },

  async getActionsByFunctions(functionsIds: string[]) {
    console.log(functionsIds)

    const promises: (() => Promise<Dictionary[]>)[] = []

    functionsIds.forEach((id) => promises.push(() => this.getDictionaryByType(id + `--${DictionaryType.LABOR_ACTIONS}`)))

    const rawActions = await Promise.all(promises.map((fn) => fn()))

    return rawActions.reduce((acc, items) => {
      acc.push(...items)
      return acc;
    }, [])
  },

  async getDictionaryHierarchy(type: DictionaryType): Promise<Dictionary[]> {
    return apiClient.get<Dictionary[]>(`/dictionaries/hierarchy/${type}`);
  },

  async getDictionaryTypes(): Promise<DictionaryType[]> {
    return apiClient.get<DictionaryType[]>('/dictionaries/types');
  },

  // CRUD операции
  async createDictionary(data: CreateDictionaryData): Promise<Dictionary> {
    return apiClient.post<Dictionary>('/dictionaries', data);
  },

  async updateDictionary(id: string, data: UpdateDictionaryData): Promise<Dictionary> {
    return apiClient.patch<Dictionary>(`/dictionaries/${id}`, data);
  },

  async deleteDictionary(id: string): Promise<void> {
    await apiClient.delete(`/dictionaries/${id}`);
  },

  // Административные функции (только для админов)
  async initializeSystemDictionaries(): Promise<void> {
    await apiClient.post('/dictionaries/admin/initialize-system');
  },

  async linkDictionaries(parentId: string, childId: string): Promise<void> {
    await apiClient.post('/dictionaries/admin/link', { parentId, childId });
  },

  async exportDictionaries(type?: DictionaryType): Promise<Blob> {
    const url = type ? `/dictionaries/admin/export?type=${type}` : '/dictionaries/admin/export';
    return apiClient.get(url, { responseType: 'blob' });
  },

  async importDictionaries(file: File, type: DictionaryType): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    await apiClient.post('/dictionaries/admin/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Поиск
  async searchDictionaries(query: string, type?: DictionaryType): Promise<Dictionary[]> {
    const params = new URLSearchParams({ query });
    if (type) params.append('type', type);
    
    return apiClient.get<Dictionary[]>(`/dictionaries/search?${params}`);
  },

  // Получение популярных значений
  async getPopularDictionaries(type: DictionaryType, limit = 10): Promise<Dictionary[]> {
    return apiClient.get<Dictionary[]>(`/dictionaries/popular/${type}?limit=${limit}`);
  }
};
