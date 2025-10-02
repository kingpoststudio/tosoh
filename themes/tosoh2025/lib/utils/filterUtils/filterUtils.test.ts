import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { extractToleranceConfig, parseUrlFilters, checkColumnValueMatch } from './filterUtils';
import type { TopicFilters } from '../../../types/fields';

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

const mockFilterDefinitions: TopicFilters['filters'] = [
  {
    filter_label: 'Product Family',
    hubdb_column_id: 'product_family',
    type: 'dropdown',
  },
  {
    filter_label: 'Retention Time',
    hubdb_column_id: 'rt_min',
    min: 0,
    max: 10,
    tolerance: 1,
    type: 'range-pm',
  },
  {
    filter_label: 'Retention Max',
    hubdb_column_id: 'rt_max',
    min: 0,
    max: 10,
    tolerance: 1,
    type: 'range-pm',
  },
];

describe('parseUrlFilters', () => {
  beforeEach(() => {
    // Mock window.location for tests that need it
    const mockLocation = {
      search: '',
      href: 'http://localhost/',
      origin: 'http://localhost',
      pathname: '/',
      hash: '',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      protocol: 'http:',
    };
    vi.stubGlobal('window', { location: mockLocation });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it('should return from window.location.search if no search string is provided', () => {
    window.location.search = '?product_family=HPLC%20Applications&document_type=PDF';
    const result = parseUrlFilters();
    expect(result).toEqual({
      product_family: 'HPLC Applications',
      document_type: 'PDF',
    });
  });
});

describe('extractToleranceConfig', () => {
  it('should extract tolerance config from filter definitions', () => {
    const result = extractToleranceConfig(mockFilterDefinitions);
    expect(result).toEqual({
      rt_min: 1,
      rt_max: 1,
    });
  });
});

describe('checkColumnValueMatch', () => {
  describe('when handling null, undefined, or empty values', () => {
    it('should return false when column value is null', () => {
      const result = checkColumnValueMatch(null as any, 'test');
      expect(result).toBe(false);
    });

    it('should return false when column value is undefined', () => {
      const result = checkColumnValueMatch(undefined as any, 'test');
      expect(result).toBe(false);
    });

    it('should return false when filter value is empty string', () => {
      const result = checkColumnValueMatch('some value', '');
      expect(result).toBe(false);
    });

    it('should return false when both column and filter values are empty', () => {
      const result = checkColumnValueMatch(null as any, '');
      expect(result).toBe(false);
    });
  });

  describe('when handling comma-separated filter values', () => {
    it('should match when at least one comma-separated value matches', () => {
      const result = checkColumnValueMatch('HPLC Applications', 'AIA-CL,HPLC Applications,Other');
      expect(result).toBe(true);
    });

    it('should return false when none of the comma-separated values match', () => {
      const result = checkColumnValueMatch('HPLC Applications', 'AIA-CL,Other,Another');
      expect(result).toBe(false);
    });

    it('should trim whitespace from comma-separated values', () => {
      const result = checkColumnValueMatch(
        'HPLC Applications',
        'AIA-CL, HPLC Applications , Other'
      );
      expect(result).toBe(true);
    });

    it('should work with multi-select columns and comma-separated filter values', () => {
      const result = checkColumnValueMatch(
        [hplcProductFamily, aiaClProductFamily],
        'HPLC Applications,Other'
      );
      expect(result).toBe(true);
    });
  });

  describe('when handling multi-select columns', () => {
    it('should return true when filter value matches one item in multi-select column', () => {
      const result = checkColumnValueMatch([hplcProductFamily], 'HPLC Applications');
      expect(result).toBe(true);
    });

    it('should return true when filter value matches any item in multi-select column', () => {
      const result = checkColumnValueMatch([hplcProductFamily, aiaClProductFamily], 'AIA-CL');
      expect(result).toBe(true);
    });

    it('should return false when filter value does not match any item in multi-select column', () => {
      const result = checkColumnValueMatch([hplcProductFamily, aiaClProductFamily], 'Non-existent');
      expect(result).toBe(false);
    });

    it('should return false for empty multi-select array', () => {
      const result = checkColumnValueMatch([], 'HPLC Applications');
      expect(result).toBe(false);
    });
  });

  describe('when handling single-select columns', () => {
    it('should return true when filter value matches select column name', () => {
      const result = checkColumnValueMatch(pdfDocumentType, 'PDF');
      expect(result).toBe(true);
    });

    it('should return false when filter value does not match select column name', () => {
      const result = checkColumnValueMatch(pdfDocumentType, 'Video');
      expect(result).toBe(false);
    });

    it('should perform exact match (case-sensitive) for select columns', () => {
      const result = checkColumnValueMatch(pdfDocumentType, 'pdf');
      expect(result).toBe(false);
    });
  });

  describe('when handling string columns', () => {
    it('should return true when filter value is a substring of column value', () => {
      const result = checkColumnValueMatch('HPLC Analysis Guide', 'Analysis');
      expect(result).toBe(true);
    });

    it('should perform case-insensitive matching for strings', () => {
      const result = checkColumnValueMatch('HPLC Analysis Guide', 'analysis');
      expect(result).toBe(true);
    });

    it('should return true when filter value matches entire string', () => {
      const result = checkColumnValueMatch('HPLC', 'HPLC');
      expect(result).toBe(true);
    });

    it('should return false when filter value is not found in column value', () => {
      const result = checkColumnValueMatch('HPLC Analysis Guide', 'Video');
      expect(result).toBe(false);
    });

    it('should handle mixed case searches', () => {
      const result = checkColumnValueMatch('HPlC AnAlYsIs GuIdE', 'ANALYSIS GUIDE');
      expect(result).toBe(true);
    });
  });

  describe('when handling numeric columns without tolerance', () => {
    it('should return true when numeric values match exactly', () => {
      const result = checkColumnValueMatch(5, '5');
      expect(result).toBe(true);
    });

    it('should return true when numeric values match exactly (with tolerance=0)', () => {
      const result = checkColumnValueMatch(5, '5', 0);
      expect(result).toBe(true);
    });

    it('should return false when numeric values do not match', () => {
      const result = checkColumnValueMatch(5, '6');
      expect(result).toBe(false);
    });

    it('should handle decimal numbers', () => {
      const result = checkColumnValueMatch(5.5, '5.5');
      expect(result).toBe(true);
    });

    it('should return false for non-matching decimal numbers', () => {
      const result = checkColumnValueMatch(5.5, '5.6');
      expect(result).toBe(false);
    });

    it('should return false when filter value is not a valid number', () => {
      const result = checkColumnValueMatch(5, 'not-a-number');
      expect(result).toBe(false);
    });

    it('should return false when column value is not a valid number', () => {
      const result = checkColumnValueMatch('not-a-number', '5');
      expect(result).toBe(false);
    });

    it('should handle numeric strings as column values', () => {
      const result = checkColumnValueMatch('5', '5');
      expect(result).toBe(true);
    });
  });

  describe('when handling numeric columns with tolerance', () => {
    it('should return true when value is within tolerance range (lower bound)', () => {
      const result = checkColumnValueMatch(4.5, '5', 1);
      expect(result).toBe(true);
    });

    it('should return true when value is within tolerance range (upper bound)', () => {
      const result = checkColumnValueMatch(5.5, '5', 1);
      expect(result).toBe(true);
    });

    it('should return true when value equals lower bound', () => {
      const result = checkColumnValueMatch(4, '5', 1);
      expect(result).toBe(true);
    });

    it('should return true when value equals upper bound', () => {
      const result = checkColumnValueMatch(6, '5', 1);
      expect(result).toBe(true);
    });

    it('should return false when value is below tolerance range', () => {
      const result = checkColumnValueMatch(3.9, '5', 1);
      expect(result).toBe(false);
    });

    it('should return false when value is above tolerance range', () => {
      const result = checkColumnValueMatch(6.1, '5', 1);
      expect(result).toBe(false);
    });

    it('should handle larger tolerance values', () => {
      const result = checkColumnValueMatch(2.5, '5', 2.5);
      expect(result).toBe(true);
    });

    it('should handle decimal tolerance values', () => {
      const result = checkColumnValueMatch(5.3, '5', 0.5);
      expect(result).toBe(true);
    });

    it('should work with negative numbers and tolerance', () => {
      const result = checkColumnValueMatch(-4.5, '-5', 1);
      expect(result).toBe(true);
    });

    it('should work with zero value and tolerance', () => {
      const result = checkColumnValueMatch(0.5, '0', 1);
      expect(result).toBe(true);
    });
  });

  describe('edge cases and special scenarios', () => {
    it('should handle filter value with extra whitespace', () => {
      const result = checkColumnValueMatch(5, '  5  ', 0);
      expect(result).toBe(true);
    });

    it('should handle zero as column value', () => {
      const result = checkColumnValueMatch(0, '0');
      expect(result).toBe(true);
    });

    it('should handle negative numbers without tolerance', () => {
      const result = checkColumnValueMatch(-5, '-5');
      expect(result).toBe(true);
    });

    it('should differentiate between string "0" and numeric 0', () => {
      const result = checkColumnValueMatch('Product 0 Guide', '0');
      expect(result).toBe(true);
    });
  });
});
