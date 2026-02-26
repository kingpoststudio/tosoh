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

export type TopicFiltersWithApplyButton = TopicFilters & {
  apply_button_label?: string;
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

export type ErrorFields = {
  message: string;
  reload_in_label: string;
  second_reload_label: string;
  reload_label: string;
  try_again_label: string;
};

export type AdditionalConfSettings = {
  checkbox_settings: {
    no_options_label: string;
  };
  results_settings: {
    no_results_label: string;
  };
  pagination_settings: {
    items_per_page_label: string;
    of_label: string;
    pages_label: string;
    page_label: string;
    items_label: string;
    item_label: string;
  };
  search_settings: {
    possible_results_label: string;
  };
};
