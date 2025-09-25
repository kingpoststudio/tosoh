import type { TopicFilters } from '../../types/fields';

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
  allFilters?.map((filter: any) => (objWithFilters[filter] = params?.get(filter) || ''));
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

export const getFilterColumnIds = (
  topicFilters: TopicFilters['filters'],
  mode: 'all' | 'numeric' | 'non-numeric' = 'all',
  extraColumnIds?: string[]
) => {
  if (mode === 'all') {
    return [...topicFilters.map((filter) => filter.hubdb_column_id), ...(extraColumnIds || [])];
  } else if (mode === 'numeric') {
    return topicFilters
      .filter((filter) => filter.type === 'range-pm')
      .map((filter) => filter.hubdb_column_id);
  } else if (mode === 'non-numeric') {
    return topicFilters
      .filter((filter) => filter.type !== 'range-pm')
      .map((filter) => filter.hubdb_column_id);
  }
};
