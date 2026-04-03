import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createPortalState, type PortalStateConfig } from './createPortalState.svelte';

vi.mock('../services/fetchTableRows', () => ({
  fetchTableRows: vi.fn(),
}));

vi.mock('../utils/urlUtils', () => ({
  getPaginationParams: vi.fn(() => ({ limit: 12, pagination: 1, offset: 0 })),
}));

vi.mock('../utils/utils', () => ({
  constructFilterParams: vi.fn((_filters, _opts) => ({ mocked: 'filters' })),
  constructRangePmFilters: vi.fn(() => []),
  getFilterColumnIds: vi.fn((_filters, _mode, _extra) => ['col_a', 'col_b']),
  parseSearchColumnIds: vi.fn(() => []),
  getFiltersTableId: vi.fn((prodId, _contentId) => prodId),
}));

import { fetchTableRows } from '../services/fetchTableRows';
import { getPaginationParams } from '../utils/urlUtils';
import {
  constructFilterParams,
  constructRangePmFilters,
  getFilterColumnIds,
  parseSearchColumnIds,
  getFiltersTableId,
} from '../utils/utils';

const mockedFetchTableRows = vi.mocked(fetchTableRows);
const mockedGetPaginationParams = vi.mocked(getPaginationParams);
const mockedConstructFilterParams = vi.mocked(constructFilterParams);
const mockedConstructRangePmFilters = vi.mocked(constructRangePmFilters);
const mockedGetFilterColumnIds = vi.mocked(getFilterColumnIds);
const mockedParseSearchColumnIds = vi.mocked(parseSearchColumnIds);
const mockedGetFiltersTableId = vi.mocked(getFiltersTableId);

const baseConfig: PortalStateConfig = {
  formId: 'test-form',
  content: {
    title: 'Portal Title',
    eyebrow: 'Eyebrow Text',
    description: 'A description',
    search: { enable_search: true },
    topic_filters: {
      filters: [
        { filter_label: 'Type', hubdb_column_id: 'type', type: 'dropdown' },
        { filter_label: 'RT', hubdb_column_id: 'rt_min', type: 'range-pm', tolerance: 1 },
      ],
      hubdb_table_id: 'content-table-123',
    },
  },
  prodTableId: 'prod-table-456',
  properties: 'name,type,url',
};

describe('createPortalState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetPaginationParams.mockReturnValue({ limit: 12, pagination: 1, offset: 0 });
    mockedConstructFilterParams.mockReturnValue({ mocked: 'filters' } as any);
    mockedConstructRangePmFilters.mockReturnValue([]);
    mockedGetFilterColumnIds.mockReturnValue(['col_a', 'col_b'] as any);
    mockedParseSearchColumnIds.mockReturnValue([]);
    mockedGetFiltersTableId.mockReturnValue('prod-table-456' as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('static config parsing from content', () => {
    it('should extract title, eyebrow, and description', () => {
      const state = createPortalState(baseConfig);

      expect(state.title).toBe('Portal Title');
      expect(state.eyebrow).toBe('Eyebrow Text');
      expect(state.description).toBe('A description');
    });

    it('should extract searchEnabled from content.search.enable_search', () => {
      const state = createPortalState(baseConfig);
      expect(state.searchEnabled).toBe(true);
    });

    it('should handle content being null without throwing', () => {
      const state = createPortalState({ ...baseConfig, content: null });

      expect(state.title).toBeUndefined();
      expect(state.eyebrow).toBeUndefined();
      expect(state.description).toBeUndefined();
      expect(state.searchEnabled).toBeUndefined();
    });

    it('should handle content being undefined without throwing', () => {
      const state = createPortalState({ ...baseConfig, content: undefined });

      expect(state.title).toBeUndefined();
      expect(state.eyebrow).toBeUndefined();
      expect(state.description).toBeUndefined();
      expect(state.searchEnabled).toBeUndefined();
    });

    it('should handle content.topic_filters being undefined', () => {
      const state = createPortalState({
        ...baseConfig,
        content: { ...baseConfig.content, topic_filters: undefined },
      });

      expect(state.topicFilters).toEqual([]);
    });

    it('should handle content.search being undefined', () => {
      const state = createPortalState({
        ...baseConfig,
        content: { ...baseConfig.content, search: undefined },
      });

      expect(state.searchEnabled).toBeUndefined();
      expect(mockedParseSearchColumnIds).toHaveBeenCalledWith(undefined);
    });

    it('should pass through formId and content as-is', () => {
      const state = createPortalState(baseConfig);

      expect(state.formId).toBe('test-form');
      expect(state.content).toBe(baseConfig.content);
    });
  });

  describe('table ID resolution', () => {
    it('should call getFiltersTableId with prodTableId and content table id', () => {
      createPortalState(baseConfig);

      expect(mockedGetFiltersTableId).toHaveBeenCalledWith(
        'prod-table-456',
        'content-table-123'
      );
    });

    it('should pass undefined when content.topic_filters is missing', () => {
      createPortalState({ ...baseConfig, content: null });

      expect(mockedGetFiltersTableId).toHaveBeenCalledWith('prod-table-456', undefined);
    });
  });

  describe('filter column ID extraction', () => {
    it('should call getFilterColumnIds with non-numeric mode', () => {
      createPortalState(baseConfig);

      expect(mockedGetFilterColumnIds).toHaveBeenCalledWith(
        baseConfig.content.topic_filters.filters,
        'non-numeric',
        []
      );
    });

    it('should expose topicFilters from content', () => {
      const state = createPortalState(baseConfig);
      expect(state.topicFilters).toBe(baseConfig.content.topic_filters.filters);
    });

    it('should expose nonNumericFilters from getFilterColumnIds result', () => {
      mockedGetFilterColumnIds.mockReturnValue(['dropdown_col'] as any);
      const state = createPortalState(baseConfig);
      expect(state.nonNumericFilters).toEqual(['dropdown_col']);
    });

    it('should default nonNumericFilters to empty array when getFilterColumnIds returns undefined', () => {
      mockedGetFilterColumnIds.mockReturnValue(undefined as any);
      const state = createPortalState(baseConfig);
      expect(state.nonNumericFilters).toEqual([]);
    });
  });

  describe('constructBody (tested via fetchData)', () => {
    it('should include base fields in the fetch body', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({
          tableId: 'prod-table-456',
          properties: 'name,type,url',
          limit: 12,
          pagination: 1,
          offset: 0,
          filters: { mocked: 'filters' },
          numericComparisonFilters: [],
        })
      );
    });

    it('should include sort when defined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState({ ...baseConfig, sort: 'name__asc' });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ sort: 'name__asc' })
      );
    });

    it('should not include sort when undefined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      const body = mockedFetchTableRows.mock.calls[0][0];
      expect(body).not.toHaveProperty('sort');
    });

    it('should include isActivated when defined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState({ ...baseConfig, isActivated: true });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ isActivated: true })
      );
    });

    it('should not include isActivated when undefined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      const body = mockedFetchTableRows.mock.calls[0][0];
      expect(body).not.toHaveProperty('isActivated');
    });

    it('should include accessLevel when defined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState({ ...baseConfig, accessLevel: 'Customer' });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ accessLevel: 'Customer' })
      );
    });

    it('should not include accessLevel when undefined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      const body = mockedFetchTableRows.mock.calls[0][0];
      expect(body).not.toHaveProperty('accessLevel');
    });

    it('should include all optional fields when all are defined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState({
        ...baseConfig,
        sort: 'date__desc',
        isActivated: false,
        accessLevel: 'Partner',
      });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: 'date__desc',
          isActivated: false,
          accessLevel: 'Partner',
        })
      );
    });

    it('should merge extraNumericFilters with rangePmFilters', async () => {
      const extraFilters = [{ columnId: 'extra', comparison: 'gte', value: 10 }];
      const rangePm = [{ columnId: 'rt_min', comparison: 'lte', value: 5 }];

      mockedConstructRangePmFilters.mockReturnValue(rangePm as any);
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });

      const state = createPortalState({
        ...baseConfig,
        extraNumericFilters: () => extraFilters,
      });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({
          numericComparisonFilters: [...extraFilters, ...rangePm],
        })
      );
    });

    it('should handle extraNumericFilters being undefined', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ numericComparisonFilters: [] })
      );
    });

    it('should handle extraNumericFilters returning empty array', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState({
        ...baseConfig,
        extraNumericFilters: () => [],
      });
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ numericComparisonFilters: [] })
      );
    });

    it('should pass filterParamOptions to constructFilterParams', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const opts = { custom: 'option' };
      const state = createPortalState({ ...baseConfig, filterParamOptions: opts });
      await state.fetchData();

      expect(mockedConstructFilterParams).toHaveBeenCalledWith(
        expect.anything(),
        opts
      );
    });

    it('should use getPaginationParams with default constants', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(mockedGetPaginationParams).toHaveBeenCalledWith(12, 1);
    });

    it('should respect custom pagination from URL', async () => {
      mockedGetPaginationParams.mockReturnValue({ limit: 24, pagination: 3, offset: 48 });
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(mockedFetchTableRows).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 24, pagination: 3, offset: 48 })
      );
    });
  });

  describe('fetchData - success', () => {
    it('should populate tableRows and totalItems from response', async () => {
      const mockResults = [{ id: 1 }, { id: 2 }];
      mockedFetchTableRows.mockResolvedValue({ results: mockResults, total: 42 });

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.tableRows).toEqual(mockResults);
      expect(state.totalItems).toBe(42);
    });

    it('should set isLoading to false after successful fetch', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.isLoading).toBe(false);
    });

    it('should default to empty results when fetchTableRows returns null', async () => {
      mockedFetchTableRows.mockResolvedValue(null as any);

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.tableRows).toEqual([]);
      expect(state.totalItems).toBe(0);
    });

    it('should default to empty results when fetchTableRows returns undefined', async () => {
      mockedFetchTableRows.mockResolvedValue(undefined as any);

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.tableRows).toEqual([]);
      expect(state.totalItems).toBe(0);
    });

    it('should not set hasError on success', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.hasError).toBe(false);
    });
  });

  describe('fetchData - error', () => {
    it('should set hasError to true when fetchTableRows throws', async () => {
      mockedFetchTableRows.mockRejectedValue(new Error('Network error'));

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.hasError).toBe(true);
    });

    it('should set isLoading to false after error', async () => {
      mockedFetchTableRows.mockRejectedValue(new Error('Server error'));

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.isLoading).toBe(false);
    });

    it('should not update tableRows on error', async () => {
      mockedFetchTableRows.mockResolvedValueOnce({ results: [{ id: 'existing' }], total: 1 });

      const state = createPortalState(baseConfig);
      await state.fetchData();
      expect(state.tableRows).toEqual([{ id: 'existing' }]);

      mockedFetchTableRows.mockRejectedValueOnce(new Error('fail'));
      await state.fetchData();

      expect(state.tableRows).toEqual([{ id: 'existing' }]);
    });
  });

  describe('reloadData', () => {
    it('should reset hasError to false before fetching', async () => {
      mockedFetchTableRows.mockRejectedValueOnce(new Error('first fail'));
      const state = createPortalState(baseConfig);
      await state.fetchData();
      expect(state.hasError).toBe(true);

      mockedFetchTableRows.mockResolvedValueOnce({ results: [], total: 0 });
      state.reloadData();
      expect(state.hasError).toBe(false);
    });

    it('should call fetchData again', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [], total: 0 });
      const state = createPortalState(baseConfig);

      state.reloadData();
      await vi.waitFor(() => {
        expect(mockedFetchTableRows).toHaveBeenCalledTimes(1);
      });
    });

    it('should recover from error state on successful reload', async () => {
      mockedFetchTableRows.mockRejectedValueOnce(new Error('fail'));
      const state = createPortalState(baseConfig);
      await state.fetchData();
      expect(state.hasError).toBe(true);

      mockedFetchTableRows.mockResolvedValueOnce({ results: [{ id: 'new' }], total: 1 });
      await state.reloadData();

      expect(state.hasError).toBe(false);
      expect(state.tableRows).toEqual([{ id: 'new' }]);
      expect(state.totalItems).toBe(1);
    });
  });

  describe('reactive getters and setters', () => {
    it('should return initial state values', () => {
      const state = createPortalState(baseConfig);

      expect(state.tableRows).toEqual([]);
      expect(state.totalItems).toBe(0);
      expect(state.hasError).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should allow setting hasError via setter', () => {
      const state = createPortalState(baseConfig);

      state.hasError = true;
      expect(state.hasError).toBe(true);

      state.hasError = false;
      expect(state.hasError).toBe(false);
    });

    it('should reflect state changes from fetchData through getters', async () => {
      mockedFetchTableRows.mockResolvedValue({ results: [{ x: 1 }], total: 99 });

      const state = createPortalState(baseConfig);
      await state.fetchData();

      expect(state.tableRows).toEqual([{ x: 1 }]);
      expect(state.totalItems).toBe(99);
    });
  });

  describe('searchColumnIds', () => {
    it('should call parseSearchColumnIds with content.search', () => {
      createPortalState(baseConfig);
      expect(mockedParseSearchColumnIds).toHaveBeenCalledWith(baseConfig.content.search);
    });

    it('should expose the result of parseSearchColumnIds', () => {
      mockedParseSearchColumnIds.mockReturnValue(['search_col'] as any);
      const state = createPortalState(baseConfig);
      expect(state.searchColumnIds).toEqual(['search_col']);
    });
  });
});
