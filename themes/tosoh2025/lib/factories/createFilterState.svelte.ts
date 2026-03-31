import type { TopicFilters } from '../../types/fields';
import type { ColumnId, FilterWithOptions } from '../../types/hubdb';
import {
  extractFilterOptions,
  parseUrlFilters,
  extractToleranceConfig,
  type FilterCriteria,
  createFilterCache,
  clearFilterCache,
  getMemoizedFilterOptionsForColumnWithTolerance,
  type FilterCache,
} from '../utils/filterUtils/filterUtils';
import { setClearParams, setSearchParams, updateUrlFromCheckbox } from '../utils/urlUtils';
import { getTableFilterOptions } from '../services/fetchTableFilterOptions';
import { getFilterColumnIds, getFiltersTableId, parseSearchColumnIds } from '../utils/utils';
import { resetPaginationAndFetchDataEvent } from '../utils/paginationAndLimitUtils';
import { resetFormEvent, updateFormEvent } from '../utils/formManager';

export interface FilterStateConfig {
  formId: string;
  topicFilters: TopicFilters['filters'];
  prodTableId: string | number;
  filtersTableIdOverride?: string;
  searchFromFields: any;
  accessLevel?: string;
  isActivated?: boolean;
  skipOnSkeleton?: boolean;
}

export function createFilterState(config: FilterStateConfig) {
  const {
    formId,
    topicFilters,
    prodTableId,
    filtersTableIdOverride,
    searchFromFields,
    accessLevel,
    isActivated,
    skipOnSkeleton = false,
  } = config;

  const searchColumnIds = parseSearchColumnIds(searchFromFields);
  const filtersArray = getFilterColumnIds(topicFilters, 'all', searchColumnIds) || [];
  const filtersTableId = getFiltersTableId(prodTableId, filtersTableIdOverride as string);
  const toleranceConfig = extractToleranceConfig(topicFilters || []);

  let allAvailableFiltersWithTheirOptions: FilterWithOptions | {} = $state({});
  let isLoading = $state(false);
  let hasError = $state(false);

  let filterOptionsCache: FilterCache = createFilterCache();
  let rawData: any[] = [];
  let filterDebounceTimeout: ReturnType<typeof setTimeout> | undefined;

  const debouncedFilterUpdate = () => {
    clearTimeout(filterDebounceTimeout);
    filterDebounceTimeout = setTimeout(() => {
      if (rawData.length > 0) {
        updateFilterOptionsBasedOnCurrentUrl(rawData);
      }
    }, 300);
  };

  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    if (target.type === 'checkbox') {
      updateUrlFromCheckbox(event);
    } else if (target.type === 'number') {
      return;
    } else {
      setSearchParams({
        [target.name]: target.value,
      });
    }
    debouncedFilterUpdate();

    updateFormEvent(formId);
    resetPaginationAndFetchDataEvent();
  };

  const clearParams = () => {
    if (filtersArray?.length > 0) {
      setClearParams(filtersArray as string[]);
    }
  };

  const onResetForSearch = (searchCb: () => void) => {
    clearParams();
    resetFormEvent(formId);
    searchCb();

    if (rawData.length > 0) {
      updateFilterOptionsBasedOnCurrentUrl(rawData);
    }

    resetPaginationAndFetchDataEvent();
  };

  const onReset = () => {
    clearParams();
    clearFilterCache(filterOptionsCache);

    if (rawData.length > 0) {
      updateFilterOptionsBasedOnCurrentUrl(rawData);
    }

    resetFormEvent(formId);

    resetPaginationAndFetchDataEvent();
  };

  const fetchInitialData = async () => {
    if (skipOnSkeleton) return;
    isLoading = true;
    hasError = false;

    try {
      const body: any = {
        filters: filtersArray,
        tableId: filtersTableId,
      };
      if (accessLevel !== undefined) body.accessLevel = accessLevel;
      if (isActivated !== undefined) body.isActivated = isActivated;

      const data = await getTableFilterOptions(body);

      if (data?.error) {
        hasError = true;
        return;
      }

      if (data?.length > 0) {
        rawData = data;
        updateFilterOptionsBasedOnCurrentUrl(data);
      } else {
        rawData = [];
      }
    } catch (error) {
      hasError = true;
      console.warn('Failed to fetch filter options:', error);
    } finally {
      isLoading = false;
    }
  };

  const updateFilterOptionsBasedOnCurrentUrl = (data: any) => {
    if (!data || data.length === 0) {
      allAvailableFiltersWithTheirOptions = {};
      return;
    }

    try {
      const allUrlParams = parseUrlFilters();

      const currentFilters: FilterCriteria = {};
      Object.entries(allUrlParams).forEach(([key, value]) => {
        if (filtersArray?.includes(key as ColumnId)) {
          currentFilters[key] = value;
        }
      });

      const options: any = {};

      filtersArray.forEach((columnId: ColumnId) => {
        if (searchColumnIds?.includes(columnId as string)) return;

        const columnOptions = getMemoizedFilterOptionsForColumnWithTolerance(
          data,
          columnId,
          currentFilters,
          toleranceConfig,
          filterOptionsCache
        );

        options[columnId] = columnOptions;
      });

      allAvailableFiltersWithTheirOptions = options;
    } catch (error) {
      console.error('Error updating filter options:', error);
      allAvailableFiltersWithTheirOptions = extractFilterOptions(data);
    }
  };

  const destroy = () => {
    clearTimeout(filterDebounceTimeout);
    clearFilterCache(filterOptionsCache);
  };

  return {
    get allOptions() {
      return allAvailableFiltersWithTheirOptions;
    },
    get isLoading() {
      return isLoading;
    },
    get hasError() {
      return hasError;
    },
    filtersArray,
    searchColumnIds,
    topicFilters,
    onChange,
    onReset,
    onResetForSearch,
    fetchInitialData,
    debouncedFilterUpdate,
    destroy,
  };
}

export type FilterState = ReturnType<typeof createFilterState>;
