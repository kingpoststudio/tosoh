import type { FilterType } from './global';

export type TopicFilters = {
  filters_title?: string;
  reset_filters_label: string;
  filters: {
    filter_label: string;
    hubdb_column_id: string;
    max?: number;
    min?: number | null;
    tolerance?: number | null;
    type: FilterType;
  }[];
  hubdb_table_id: string;
};

export type TopicFiltersWithViewAs = TopicFilters & {
  view_as_label?: string;
  grid_label?: string;
  list_label?: string;
};

export type Search = {
  enable_search: boolean;
  hubdb_column_ids:
    | {
        hubdb_column_id: string;
      }[]
    | null;
  hubdb_table_id: number | string;
  placeholder: string;
  title: string;
  typeahead_enabled: boolean;
  is_access_level_filter_enabled?: boolean;
};
