import type { Search, TopicFilters } from '../../types/fields';
import { USE_HARDCODED_IDS } from './constants';
import { updateUrl } from './urlUtils';

export const isUpcoming = (date: number) => {
  const now = new Date();
  const dateEvent = date ? new Date(date) : null;

  if (!dateEvent) return false;
  if (dateEvent) {
    if (now < dateEvent) return true;
  }
};

export const isPast = (date: number) => {
  const now = new Date();
  const dateEvent = date ? new Date(date) : null;

  if (!dateEvent) return false;
  if (dateEvent) {
    if (now > dateEvent) return true;
  }
};

export const getFilter = (topic_filters: TopicFilters['filters'], columnId: string) => {
  return topic_filters?.find((filter) => filter?.hubdb_column_id === columnId);
};

export const constructFilterParams = (availableFilters: string[], customFilter?: {}) => {
  const params = new URLSearchParams(window.location.search);
  let objWithFilters: any = {};
  const allFilters = [...availableFilters];
  allFilters?.map((filter: any) => {
    const value = params?.get(filter) || '';
    objWithFilters[filter] = value ? encodeURIComponent(value) : '';
  });
  return { ...objWithFilters, ...(customFilter || {}) };
};

export const constructRangePmFilters = (topicFilters: TopicFilters['filters']) => {
  const params = new URLSearchParams(window.location.search);
  const rangePmFilters: Array<{
    columnId: string;
    comparison: string;
    value: number;
  }> = [];

  topicFilters?.forEach((filter) => {
    if (filter.type === 'range-pm') {
      const urlValue = params.get(filter.hubdb_column_id);

      if (urlValue && !isNaN(Number(urlValue))) {
        const numericValue = Number(urlValue);
        const tolerance = filter.tolerance || 0;

        // Create range filters based on the value and tolerance
        if (tolerance > 0) {
          // If tolerance is specified, create a range filter
          rangePmFilters.push({
            columnId: filter.hubdb_column_id,
            comparison: 'gte',
            value: numericValue - tolerance,
          });
          rangePmFilters.push({
            columnId: filter.hubdb_column_id,
            comparison: 'lte',
            value: numericValue + tolerance,
          });
        } else {
          // If no tolerance, create an exact match filter
          rangePmFilters.push({
            columnId: filter.hubdb_column_id,
            comparison: 'eq',
            value: numericValue,
          });
        }
      }
    }
  });

  return rangePmFilters;
};

const clearExtraColumnIds = (extraColumnIds: string[] | any[]) => {
  if (!extraColumnIds || extraColumnIds?.length === 0) return [];
  return extraColumnIds?.filter((columnId) => columnId !== '');
};

export const getFilterColumnIds = (
  topicFilters: TopicFilters['filters'],
  mode: 'all' | 'numeric' | 'non-numeric' = 'all',
  extraColumnIds?: string[]
) => {
  const filteredExtraColumnIds = clearExtraColumnIds(extraColumnIds || []);

  if (mode === 'all') {
    return [
      ...topicFilters?.map((filter) => filter?.hubdb_column_id),
      ...(filteredExtraColumnIds || []),
    ];
  } else if (mode === 'numeric') {
    let numericFilters = topicFilters
      ?.filter((filter) => filter?.type === 'range-pm')
      ?.map((filter) => filter?.hubdb_column_id);
    return [...numericFilters, ...(filteredExtraColumnIds || [])];
  } else if (mode === 'non-numeric') {
    let nonNumericFilters = topicFilters
      ?.filter((filter) => filter?.type !== 'range-pm')
      ?.map((filter) => filter?.hubdb_column_id);
    return [...nonNumericFilters, ...(filteredExtraColumnIds || [])];
  }
};

const parseAfterHubfsRegex = (url: string): string | null => {
  const match = url?.match(/hubfs\/(.*)$/);
  return match ? match[1] : null;
};

export const constructCDNUrl = (url: string, width: number = 330): string => {
  if (url) {
    return `https://19644636.fs1.hubspotusercontent-na1.net/hub/19644636/hubfs/${parseAfterHubfsRegex(
      url
    )}?width=${width}`;
  }
  return '';
};

export const onTagClick = (name: string, value: string) => {
  updateUrl({
    target: { name: name, value: value },
  } as unknown as Event);
};

export const removeHtmlTags = (value: string) => {
  return value?.replace(/<[^>]+>/g, ' ');
};

export const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 120, behavior });
  }
};

export const setupFilterTitle = (column: string) =>
  column?.replace(/_/g, ' ')?.replace(/\b\w/g, (c) => c?.toUpperCase());

export const parseSearchColumnId = (search: Search) => {
  return search && search?.enable_search ? search?.hubdb_column_id : '';
};

export const getFiltersTableId = (hardcodedTableId: string, searchTableId: string) => {
  return USE_HARDCODED_IDS ? hardcodedTableId : searchTableId;
};
