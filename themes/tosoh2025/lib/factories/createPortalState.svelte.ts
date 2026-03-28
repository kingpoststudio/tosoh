import {
  constructFilterParams,
  constructRangePmFilters,
  getFilterColumnIds,
  parseSearchColumnIds,
  getFiltersTableId,
} from '../utils/utils';
import { fetchTableRows } from '../services/fetchTableRows';
import { defaultItemsLimit, defaultPagination } from '../utils/constants';
import { getPaginationParams } from '../utils/urlUtils';

export interface PortalStateConfig {
  formId: string;
  content: any;
  prodTableId: string | number;
  properties: string;
  sort?: string;
  isActivated?: boolean;
  accessLevel?: string;
  extraNumericFilters?: () => any[];
  filterParamOptions?: Record<string, any>;
}

export function createPortalState(config: PortalStateConfig) {
  const {
    formId,
    content,
    prodTableId,
    properties,
    sort,
    isActivated,
    accessLevel,
    extraNumericFilters,
    filterParamOptions,
  } = config;

  const topicFilters = content?.topic_filters?.filters || [];
  const tableId = getFiltersTableId(prodTableId, content?.topic_filters?.hubdb_table_id);
  const searchColumnIds = parseSearchColumnIds(content?.search);
  const nonNumericFilters = getFilterColumnIds(topicFilters, 'non-numeric', searchColumnIds) || [];

  const title = content?.title;
  const eyebrow = content?.eyebrow;
  const description = content?.description;
  const searchEnabled = content?.search?.enable_search;

  let tableRows: any = $state([]);
  let totalItems = $state(0);
  let hasError = $state(false);
  let isLoading = $state(false);

  const constructBody = () => {
    const { limit, pagination, offset } = getPaginationParams(defaultItemsLimit, defaultPagination);
    const extra = extraNumericFilters?.() || [];
    const rangePmFilters = constructRangePmFilters(topicFilters);

    return {
      tableId,
      properties,
      limit,
      pagination,
      offset,
      filters: constructFilterParams(nonNumericFilters, filterParamOptions),
      numericComparisonFilters: [...extra, ...rangePmFilters],
      ...(sort !== undefined && { sort }),
      ...(isActivated !== undefined && { isActivated }),
      ...(accessLevel !== undefined && { accessLevel }),
    };
  };

  const fetchData = async () => {
    try {
      isLoading = true;
      const data = await fetchTableRows(constructBody());
      const { results, total } = data ?? { results: [], total: 0 };
      tableRows = results;
      totalItems = total;
    } catch (error) {
      hasError = true;
    } finally {
      isLoading = false;
    }
  };

  const reloadData = () => {
    hasError = false;
    fetchData();
  };

  return {
    get tableRows() {
      return tableRows;
    },
    get totalItems() {
      return totalItems;
    },
    get hasError() {
      return hasError;
    },
    set hasError(value: boolean) {
      hasError = value;
    },
    get isLoading() {
      return isLoading;
    },
    title,
    eyebrow,
    description,
    searchEnabled,
    topicFilters,
    searchColumnIds,
    nonNumericFilters,
    content,
    formId,
    fetchData,
    reloadData,
  };
}

export type PortalState = ReturnType<typeof createPortalState>;
