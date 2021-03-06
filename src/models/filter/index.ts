import { SearchBaseModel, FilterOptionModel } from '@osu-cass/sb-components';

export const performanceOptions: FilterOptionModel[] = [
  { key: 'PT', label: 'Yes', isSelected: false }
];
export interface CSEFilterOptions {
  grades: SearchBaseModel[];
  subjects: SearchBaseModel[];
  claims?: SearchBaseModel[];
  targets?: SearchBaseModel[];
  filter?: string;
}

export interface CSEFilterParams {
  grades: string[];
  subject?: string;
  claim?: string;
  target?: string;
  filter?: string;
}

export interface CSESearchQuery {
  grades?: string[];
  subject?: string;
  claim?: string;
  target?: string;
  search?: string;
  filter?: string;
}
