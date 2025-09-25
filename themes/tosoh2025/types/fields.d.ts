export type TopicFilters = {
  filters: {
    filter_label: string;
    hubdb_column_id: string;
    max?: number;
    min?: number | null;
    tolerance?: number | null;
    type: FilterType;
  }[];
  hubdb_table_id: number;
};

export type Search = {
  enable_search: boolean;
  hubdb_column_id: string;
  hubdb_table_id: number;
  placeholder: string;
  title: string;
  typeahead_enabled: boolean;
  is_access_level_filter_enabled?: boolean;
};
