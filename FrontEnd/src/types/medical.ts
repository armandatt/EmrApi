export interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  description: string;
  icd11_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  keyword: string;
  icd11_code: string;
}