import { describe, it, expect } from 'vitest';
import {
  parseUrlFilters,
  checkColumnValueMatch,
  checkRowMatchesFilters,
  extractFilterOptions,
  filterRowsByUrlParams,
  createFilterFunction,
} from './filterUtils.refactored';

// Test data
const hplcProductFamily = {
  id: '1',
  name: 'HPLC Applications',
  label: 'HPLC Applications',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
} as const;

const aiaClProductFamily = {
  id: '2',
  name: 'AIA-CL',
  label: 'AIA-CL',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
} as const;

const pdfDocumentType = {
  id: '3',
  name: 'PDF',
  label: 'PDF',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
} as const;

const videoDocumentType = {
  id: '4',
  name: 'Video',
  label: 'Video',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
} as const;

const mockRows = [
  {
    values: {
      product_family: [hplcProductFamily],
      document_type: pdfDocumentType,
      title: 'HPLC Analysis Guide',
    },
  },
  {
    values: {
      product_family: [aiaClProductFamily],
      document_type: videoDocumentType,
      title: 'AIA-CL Training Video',
    },
  },
  {
    values: {
      product_family: [hplcProductFamily, aiaClProductFamily],
      document_type: pdfDocumentType,
      title: 'Combined Product Manual',
    },
  },
] as any;

describe('parseUrlFilters', () => {
  it('should parse URL search parameters into filter criteria', () => {
    const searchString = '?product_family=HPLC%20Applications&document_type=PDF';
    const result = parseUrlFilters(searchString);

    expect(result).toEqual({
      product_family: 'HPLC Applications',
      document_type: 'PDF',
    });
  });

  it('should return empty object for empty search string', () => {
    const result = parseUrlFilters('');
    expect(result).toEqual({});
  });
});

describe('checkColumnValueMatch', () => {
  it('should match multiselect column values', () => {
    const columnValue = [hplcProductFamily, aiaClProductFamily];
    const result = checkColumnValueMatch(columnValue, 'HPLC Applications');
    expect(result).toBe(true);
  });

  it('should match select column values', () => {
    const result = checkColumnValueMatch(pdfDocumentType, 'PDF');
    expect(result).toBe(true);
  });

  it('should match string column values (case insensitive)', () => {
    const result = checkColumnValueMatch('HPLC Analysis Guide', 'hplc');
    expect(result).toBe(true);
  });

  it('should return false for non-matching values', () => {
    const result = checkColumnValueMatch(pdfDocumentType, 'Video');
    expect(result).toBe(false);
  });

  it('should handle empty values gracefully', () => {
    expect(checkColumnValueMatch('', 'test')).toBe(false);
    expect(checkColumnValueMatch('test', '')).toBe(false);
    expect(checkColumnValueMatch(null as any, 'test')).toBe(false);
  });
});

describe('checkRowMatchesFilters', () => {
  it('should return true when row matches all filters', () => {
    const rowValues = mockRows[0].values;
    const filters = {
      product_family: 'HPLC Applications',
      document_type: 'PDF',
    };

    const result = checkRowMatchesFilters(rowValues, filters);
    expect(result).toBe(true);
  });

  it('should return false when row does not match all filters', () => {
    const rowValues = mockRows[1].values;
    const filters = {
      product_family: 'HPLC Applications', // Row has AIA-CL
      document_type: 'Video',
    };

    const result = checkRowMatchesFilters(rowValues, filters);
    expect(result).toBe(false);
  });

  it('should return true for empty filters', () => {
    const rowValues = mockRows[0].values;
    const result = checkRowMatchesFilters(rowValues, {});
    expect(result).toBe(true);
  });
});

describe('extractFilterOptions', () => {
  it('should extract and sort all unique filter options', () => {
    const result = extractFilterOptions(mockRows);

    expect(result).toEqual({
      product_family: [aiaClProductFamily, hplcProductFamily], // Sorted alphabetically
      document_type: [pdfDocumentType, videoDocumentType], // Sorted alphabetically
    });
  });

  it('should handle empty rows array', () => {
    const result = extractFilterOptions([]);
    expect(result).toEqual({});
  });
});

describe('filterRowsByUrlParams', () => {
  it('should filter rows based on URL parameters', () => {
    const searchString = '?product_family=HPLC%20Applications';
    const result = filterRowsByUrlParams(mockRows, searchString);

    // Should return rows that contain HPLC Applications
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(mockRows[0]);
    expect(result[1]).toEqual(mockRows[2]);
  });

  it('should return all rows when no filters are present', () => {
    const result = filterRowsByUrlParams(mockRows, '');
    expect(result).toHaveLength(3);
  });

  it('should handle multiple filters', () => {
    const searchString = '?product_family=AIA-CL&document_type=Video';
    const result = filterRowsByUrlParams(mockRows, searchString);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(mockRows[1]);
  });
});

describe('createFilterFunction', () => {
  it('should create a filter function with predefined search parameters', () => {
    const searchString = '?product_family=HPLC%20Applications';
    const filterFunction = createFilterFunction(searchString);
    const result = filterFunction(mockRows);

    expect(result).toHaveLength(2);
  });
});
