import type { FilterType } from './global';

/** One row in `topic_filters.filters` (HubDB column + UI type). */
export type TopicFilterRow = {
  filter_label: string;
  hubdb_column_id: string;
  max?: number;
  min?: number | null;
  tolerance?: number | null;
  type: FilterType;
  /** Used by some UIs for dropdown placeholder copy (optional). */
  dropdown_filter_placeholder?: string;
};

/**
 * Serialized module key `topic_filters` (camelCase `topicFilters` in `fields.ts` exports).
 * Extra labels (`filters_title`, `reset_filters_label`, etc.) are optional unless your HubSpot field group defines them.
 */
export type TopicFilters = {
  filters_title?: string;
  reset_filters_label?: string;
  filters: TopicFilterRow[];
  hubdb_table_id: string;
};

/** Support Portal: grid/list toggle labels (UI may still use hardcoded copy; types cover CMS JSON if present). */
export type TopicFiltersWithViewAs = TopicFilters & {
  view_as_label?: string;
  grid_label?: string;
  list_label?: string;
};

/** Hemoglobin Portal / Variants Library: optional apply CTA label when filters defer URL updates. */
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

export type AdditionalSettings = {
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
};
