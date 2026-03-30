import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createFilterState, type FilterStateConfig } from './createFilterState.svelte';

vi.mock('../utils/filterUtils/filterUtils', () => ({
  extractFilterOptions: vi.fn(() => ({ fallback: [] })),
  parseUrlFilters: vi.fn(() => ({})),
  extractToleranceConfig: vi.fn(() => ({})),
  createFilterCache: vi.fn(() => new Map()),
  clearFilterCache: vi.fn(),
  getMemoizedFilterOptionsForColumnWithTolerance: vi.fn(() => []),
}));

vi.mock('../utils/urlUtils', () => ({
  setClearParams: vi.fn(),
  setSearchParams: vi.fn(),
  updateUrlFromCheckbox: vi.fn(),
}));

vi.mock('../services/fetchTableFilterOptions', () => ({
  getTableFilterOptions: vi.fn(),
}));

vi.mock('../utils/utils', () => ({
  getFilterColumnIds: vi.fn(() => ['product_family', 'document_type']),
  getFiltersTableId: vi.fn((prodId) => prodId),
  parseSearchColumnIds: vi.fn(() => []),
}));

vi.mock('../utils/paginationAndLimitUtils', () => ({
  resetPaginationAndFetchDataEvent: vi.fn(),
}));

vi.mock('../utils/formManager', () => ({
  resetFormEvent: vi.fn(),
  updateFormEvent: vi.fn(),
}));

import {
  extractFilterOptions,
  parseUrlFilters,
  extractToleranceConfig,
  createFilterCache,
  clearFilterCache,
  getMemoizedFilterOptionsForColumnWithTolerance,
} from '../utils/filterUtils/filterUtils';
import { setClearParams, setSearchParams, updateUrlFromCheckbox } from '../utils/urlUtils';
import { getTableFilterOptions } from '../services/fetchTableFilterOptions';
import { getFilterColumnIds, getFiltersTableId, parseSearchColumnIds } from '../utils/utils';
import { resetPaginationAndFetchDataEvent } from '../utils/paginationAndLimitUtils';
import { resetFormEvent, updateFormEvent } from '../utils/formManager';

const mockedGetTableFilterOptions = vi.mocked(getTableFilterOptions);
const mockedSetClearParams = vi.mocked(setClearParams);
const mockedSetSearchParams = vi.mocked(setSearchParams);
const mockedUpdateUrlFromCheckbox = vi.mocked(updateUrlFromCheckbox);
const mockedGetFilterColumnIds = vi.mocked(getFilterColumnIds);
const mockedGetFiltersTableId = vi.mocked(getFiltersTableId);
const mockedParseSearchColumnIds = vi.mocked(parseSearchColumnIds);
const mockedResetPaginationAndFetchDataEvent = vi.mocked(resetPaginationAndFetchDataEvent);
const mockedResetFormEvent = vi.mocked(resetFormEvent);
const mockedUpdateFormEvent = vi.mocked(updateFormEvent);
const mockedParseUrlFilters = vi.mocked(parseUrlFilters);
const mockedExtractFilterOptions = vi.mocked(extractFilterOptions);
const mockedExtractToleranceConfig = vi.mocked(extractToleranceConfig);
const mockedClearFilterCache = vi.mocked(clearFilterCache);
const mockedGetMemoized = vi.mocked(getMemoizedFilterOptionsForColumnWithTolerance);
const mockedCreateFilterCache = vi.mocked(createFilterCache);

const topicFilters = [
  { filter_label: 'Product Family', hubdb_column_id: 'product_family', type: 'dropdown' as const },
  { filter_label: 'Document Type', hubdb_column_id: 'document_type', type: 'dropdown' as const },
];

const baseConfig: FilterStateConfig = {
  formId: 'filter-form',
  topicFilters,
  prodTableId: 'prod-123',
  searchFromFields: null,
};

describe('createFilterState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockedGetFilterColumnIds.mockReturnValue(['product_family', 'document_type'] as any);
    mockedGetFiltersTableId.mockReturnValue('prod-123' as any);
    mockedParseSearchColumnIds.mockReturnValue([]);
    mockedExtractToleranceConfig.mockReturnValue({});
    mockedCreateFilterCache.mockReturnValue(new Map() as any);
    mockedParseUrlFilters.mockReturnValue({});
    mockedGetMemoized.mockReturnValue([]);
    mockedExtractFilterOptions.mockReturnValue({ fallback: [] } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('static config parsing', () => {
    it('should compute filtersArray from topicFilters using getFilterColumnIds with all mode', () => {
      createFilterState(baseConfig);

      expect(mockedGetFilterColumnIds).toHaveBeenCalledWith(topicFilters, 'all', []);
    });

    it('should expose filtersArray from getFilterColumnIds result', () => {
      mockedGetFilterColumnIds.mockReturnValue(['col_x', 'col_y'] as any);
      const state = createFilterState(baseConfig);
      expect(state.filtersArray).toEqual(['col_x', 'col_y']);
    });

    it('should default filtersArray to empty array when getFilterColumnIds returns undefined', () => {
      mockedGetFilterColumnIds.mockReturnValue(undefined as any);
      const state = createFilterState(baseConfig);
      expect(state.filtersArray).toEqual([]);
    });

    it('should compute searchColumnIds from searchFromFields', () => {
      const searchFields = { enable_search: true, hubdb_column_ids: [{ hubdb_column_id: 's1' }] };
      createFilterState({ ...baseConfig, searchFromFields: searchFields });

      expect(mockedParseSearchColumnIds).toHaveBeenCalledWith(searchFields);
    });

    it('should expose searchColumnIds', () => {
      mockedParseSearchColumnIds.mockReturnValue(['search_col'] as any);
      const state = createFilterState(baseConfig);
      expect(state.searchColumnIds).toEqual(['search_col']);
    });

    it('should resolve filtersTableId from prodTableId and override', () => {
      createFilterState({ ...baseConfig, filtersTableIdOverride: 'override-id' });

      expect(mockedGetFiltersTableId).toHaveBeenCalledWith('prod-123', 'override-id');
    });

    it('should extract toleranceConfig from topicFilters', () => {
      createFilterState(baseConfig);
      expect(mockedExtractToleranceConfig).toHaveBeenCalledWith(topicFilters);
    });

    it('should handle null topicFilters by passing empty array to extractToleranceConfig', () => {
      createFilterState({ ...baseConfig, topicFilters: null as any });
      expect(mockedExtractToleranceConfig).toHaveBeenCalledWith([]);
    });

    it('should expose topicFilters as-is', () => {
      const state = createFilterState(baseConfig);
      expect(state.topicFilters).toBe(topicFilters);
    });
  });

  describe('fetchInitialData - happy path', () => {
    it('should call getTableFilterOptions with filters and tableId', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalledWith({
        filters: ['product_family', 'document_type'],
        tableId: 'prod-123',
      });
    });

    it('should include accessLevel in body when defined', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState({ ...baseConfig, accessLevel: 'Customer' });
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalledWith(
        expect.objectContaining({ accessLevel: 'Customer' })
      );
    });

    it('should not include accessLevel in body when undefined', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      const body = mockedGetTableFilterOptions.mock.calls[0][0];
      expect(body).not.toHaveProperty('accessLevel');
    });

    it('should include isActivated in body when defined', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState({ ...baseConfig, isActivated: true });
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalledWith(
        expect.objectContaining({ isActivated: true })
      );
    });

    it('should not include isActivated in body when undefined', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      const body = mockedGetTableFilterOptions.mock.calls[0][0];
      expect(body).not.toHaveProperty('isActivated');
    });

    it('should include both accessLevel and isActivated when both are defined', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState({
        ...baseConfig,
        accessLevel: 'Partner',
        isActivated: false,
      });
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalledWith(
        expect.objectContaining({ accessLevel: 'Partner', isActivated: false })
      );
    });

    it('should set isLoading to false after success', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([{ values: {} }]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.isLoading).toBe(false);
    });

    it('should set hasError to false at start', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.hasError).toBe(false);
    });

    it('should process data and update allOptions when data has items', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);
      mockedGetMemoized.mockReturnValue([{ name: 'HPLC', quantity: 1 }] as any);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(mockedGetMemoized).toHaveBeenCalled();
      expect(state.allOptions).toBeDefined();
    });

    it('should handle empty data array', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.hasError).toBe(false);
    });
  });

  describe('fetchInitialData - error paths', () => {
    it('should set hasError when response has error property', async () => {
      mockedGetTableFilterOptions.mockResolvedValue({ error: 'something went wrong' });
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.hasError).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should set hasError when getTableFilterOptions throws', async () => {
      mockedGetTableFilterOptions.mockRejectedValue(new Error('Network failure'));
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.hasError).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(warnSpy).toHaveBeenCalledWith('Failed to fetch filter options:', expect.any(Error));

      warnSpy.mockRestore();
    });

    it('should set isLoading to false in finally block on error', async () => {
      mockedGetTableFilterOptions.mockRejectedValue(new Error('fail'));
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchInitialData - skipOnSkeleton', () => {
    it('should return immediately without fetching when skipOnSkeleton is true', async () => {
      const state = createFilterState({ ...baseConfig, skipOnSkeleton: true });
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).not.toHaveBeenCalled();
      expect(state.isLoading).toBe(false);
    });

    it('should fetch normally when skipOnSkeleton is false', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState({ ...baseConfig, skipOnSkeleton: false });
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalled();
    });

    it('should default skipOnSkeleton to false', async () => {
      mockedGetTableFilterOptions.mockResolvedValue([]);
      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(mockedGetTableFilterOptions).toHaveBeenCalled();
    });
  });

  describe('onChange - event handling', () => {
    const createMockEvent = (type: string, name: string, value: string): Event => {
      return {
        target: { type, name, value, checked: true } as HTMLInputElement,
      } as unknown as Event;
    };

    it('should call updateUrlFromCheckbox for checkbox inputs', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('checkbox', 'product_family', 'HPLC');

      state.onChange(event);

      expect(mockedUpdateUrlFromCheckbox).toHaveBeenCalledWith(event);
      expect(mockedSetSearchParams).not.toHaveBeenCalled();
    });

    it('should return early for number inputs without calling updateFormEvent', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('number', 'rt_min', '5');

      state.onChange(event);

      expect(mockedUpdateUrlFromCheckbox).not.toHaveBeenCalled();
      expect(mockedSetSearchParams).not.toHaveBeenCalled();
      expect(mockedUpdateFormEvent).not.toHaveBeenCalled();
      expect(mockedResetPaginationAndFetchDataEvent).not.toHaveBeenCalled();
    });

    it('should call setSearchParams for text inputs', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('text', 'search_query', 'HPLC');

      state.onChange(event);

      expect(mockedSetSearchParams).toHaveBeenCalledWith({ search_query: 'HPLC' });
    });

    it('should call setSearchParams for select inputs', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('select-one', 'product_family', 'AIA-CL');

      state.onChange(event);

      expect(mockedSetSearchParams).toHaveBeenCalledWith({ product_family: 'AIA-CL' });
    });

    it('should trigger updateFormEvent and resetPaginationAndFetchDataEvent for checkbox', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('checkbox', 'product_family', 'HPLC');

      state.onChange(event);

      expect(mockedUpdateFormEvent).toHaveBeenCalledWith('filter-form');
      expect(mockedResetPaginationAndFetchDataEvent).toHaveBeenCalled();
    });

    it('should trigger updateFormEvent and resetPaginationAndFetchDataEvent for text', () => {
      const state = createFilterState(baseConfig);
      const event = createMockEvent('text', 'search', 'test');

      state.onChange(event);

      expect(mockedUpdateFormEvent).toHaveBeenCalledWith('filter-form');
      expect(mockedResetPaginationAndFetchDataEvent).toHaveBeenCalled();
    });

    it('should return early when event.target is null', () => {
      const state = createFilterState(baseConfig);
      const event = { target: null } as unknown as Event;

      state.onChange(event);

      expect(mockedUpdateUrlFromCheckbox).not.toHaveBeenCalled();
      expect(mockedSetSearchParams).not.toHaveBeenCalled();
      expect(mockedUpdateFormEvent).not.toHaveBeenCalled();
    });
  });

  describe('debouncedFilterUpdate', () => {
    it('should not call updateFilterOptionsBasedOnCurrentUrl when rawData is empty', () => {
      const state = createFilterState(baseConfig);

      state.debouncedFilterUpdate();
      vi.advanceTimersByTime(300);

      expect(mockedGetMemoized).not.toHaveBeenCalled();
    });

    it('should update filter options after 300ms when rawData exists', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();
      vi.clearAllMocks();

      state.debouncedFilterUpdate();
      vi.advanceTimersByTime(299);
      expect(mockedGetMemoized).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockedGetMemoized).toHaveBeenCalled();
    });

    it('should debounce multiple rapid calls - only last one fires', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();
      vi.clearAllMocks();

      state.debouncedFilterUpdate();
      vi.advanceTimersByTime(100);
      state.debouncedFilterUpdate();
      vi.advanceTimersByTime(100);
      state.debouncedFilterUpdate();
      vi.advanceTimersByTime(300);

      // getMemoized is called once per columnId (2 columns), but only one batch
      const callCount = mockedGetMemoized.mock.calls.length;
      expect(callCount).toBe(2); // once per column in filtersArray
    });
  });

  describe('onReset', () => {
    it('should call setClearParams when filtersArray has items', () => {
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedSetClearParams).toHaveBeenCalledWith(['product_family', 'document_type']);
    });

    it('should not call setClearParams when filtersArray is empty', () => {
      mockedGetFilterColumnIds.mockReturnValue([] as any);
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedSetClearParams).not.toHaveBeenCalled();
    });

    it('should call clearFilterCache', () => {
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedClearFilterCache).toHaveBeenCalled();
    });

    it('should call resetFormEvent with formId', () => {
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedResetFormEvent).toHaveBeenCalledWith('filter-form');
    });

    it('should call resetPaginationAndFetchDataEvent', () => {
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedResetPaginationAndFetchDataEvent).toHaveBeenCalled();
    });

    it('should update filter options when rawData exists', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();
      vi.clearAllMocks();

      state.onReset();

      expect(mockedGetMemoized).toHaveBeenCalled();
    });

    it('should not update filter options when rawData is empty', () => {
      const state = createFilterState(baseConfig);
      state.onReset();

      expect(mockedGetMemoized).not.toHaveBeenCalled();
    });
  });

  describe('onResetForSearch', () => {
    it('should call clearParams', () => {
      const state = createFilterState(baseConfig);
      state.onResetForSearch(() => {});

      expect(mockedSetClearParams).toHaveBeenCalledWith(['product_family', 'document_type']);
    });

    it('should call resetFormEvent with formId', () => {
      const state = createFilterState(baseConfig);
      state.onResetForSearch(() => {});

      expect(mockedResetFormEvent).toHaveBeenCalledWith('filter-form');
    });

    it('should execute the provided searchCb', () => {
      const state = createFilterState(baseConfig);
      const searchCb = vi.fn();

      state.onResetForSearch(searchCb);

      expect(searchCb).toHaveBeenCalledOnce();
    });

    it('should call resetPaginationAndFetchDataEvent', () => {
      const state = createFilterState(baseConfig);
      state.onResetForSearch(() => {});

      expect(mockedResetPaginationAndFetchDataEvent).toHaveBeenCalled();
    });

    it('should update filter options when rawData exists', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();
      vi.clearAllMocks();

      state.onResetForSearch(() => {});

      expect(mockedGetMemoized).toHaveBeenCalled();
    });

    it('should not update filter options when rawData is empty', () => {
      const state = createFilterState(baseConfig);
      state.onResetForSearch(() => {});

      expect(mockedGetMemoized).not.toHaveBeenCalled();
    });
  });

  describe('updateFilterOptionsBasedOnCurrentUrl (tested indirectly)', () => {
    it('should set allOptions to empty object when data is null', async () => {
      mockedGetTableFilterOptions.mockResolvedValue(null as any);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.allOptions).toEqual({});
    });

    it('should skip search column IDs when building options', async () => {
      mockedParseSearchColumnIds.mockReturnValue(['product_family'] as any);
      mockedGetFilterColumnIds.mockReturnValue(['product_family', 'document_type'] as any);

      const mockData = [{ values: { product_family: [{ name: 'HPLC' }], document_type: { name: 'PDF' } } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      // product_family is in searchColumnIds so getMemoized should only be called for document_type
      const columnArgs = mockedGetMemoized.mock.calls.map((c) => c[1]);
      expect(columnArgs).not.toContain('product_family');
      expect(columnArgs).toContain('document_type');
    });

    it('should only include URL params that match filtersArray in currentFilters', async () => {
      mockedParseUrlFilters.mockReturnValue({
        product_family: 'HPLC',
        unrelated_param: 'value',
      } as any);

      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      const filterArg = mockedGetMemoized.mock.calls[0][2];
      expect(filterArg).toHaveProperty('product_family', 'HPLC');
      expect(filterArg).not.toHaveProperty('unrelated_param');
    });

    it('should fall back to extractFilterOptions when processing throws', async () => {
      mockedGetMemoized.mockImplementation(() => {
        throw new Error('processing error');
      });
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(mockedExtractFilterOptions).toHaveBeenCalledWith(mockData);
      expect(state.allOptions).toEqual({ fallback: [] });

      errorSpy.mockRestore();
    });
  });

  describe('destroy', () => {
    it('should clear filter cache', () => {
      const state = createFilterState(baseConfig);
      state.destroy();

      expect(mockedClearFilterCache).toHaveBeenCalled();
    });

    it('should clear pending debounce timeout', async () => {
      const mockData = [{ values: { product_family: [{ name: 'HPLC' }] } }];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();
      vi.clearAllMocks();

      state.debouncedFilterUpdate();
      state.destroy();

      vi.advanceTimersByTime(500);
      expect(mockedGetMemoized).not.toHaveBeenCalled();
    });
  });

  describe('reactive state', () => {
    it('should return initial state values', () => {
      const state = createFilterState(baseConfig);

      expect(state.allOptions).toEqual({});
      expect(state.isLoading).toBe(false);
      expect(state.hasError).toBe(false);
    });

    it('should reflect isLoading and hasError after fetch error', async () => {
      mockedGetTableFilterOptions.mockRejectedValue(new Error('fail'));
      vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.hasError).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should update allOptions after successful fetch with data', async () => {
      const mockData = [
        { values: { product_family: [{ name: 'HPLC' }], document_type: { name: 'PDF' } } },
      ];
      mockedGetTableFilterOptions.mockResolvedValue(mockData);
      mockedGetMemoized.mockReturnValue([{ name: 'HPLC', quantity: 1 }] as any);

      const state = createFilterState(baseConfig);
      await state.fetchInitialData();

      expect(state.allOptions).toHaveProperty('product_family');
      expect(state.allOptions).toHaveProperty('document_type');
    });
  });
});
