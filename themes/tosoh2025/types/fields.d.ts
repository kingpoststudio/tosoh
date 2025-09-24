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
