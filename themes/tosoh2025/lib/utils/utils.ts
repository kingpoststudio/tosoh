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

export const constructFilterParams = (availableFilters: string[]) => {
  const params = new URLSearchParams(window.location.search);
  let objWithFilters: any = {};
  const allFilters = [...availableFilters];
  allFilters?.map((filter: any) => (objWithFilters[filter] = params?.get(filter) || ''));
  return { ...objWithFilters };
};
