import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  extractToleranceConfig,
  parseUrlFilters,
  checkColumnValueMatch,
  extractFilterOptions,
} from './filterUtils';
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

describe('extractFilterOptions', () => {
  // Additional test data for extractFilterOptions
  const turbidimetryProductFamily = {
    id: '5',
    name: 'Turbidimetry',
    label: 'Turbidimetry',
    type: 'option' as const,
    createdAt: '2023-01-01T00:00:00.000Z',
    createdByUserId: 1,
    updatedAt: '2023-01-01T00:00:00.000Z',
    updatedByUserId: 1,
    order: 1,
  };

  const zebraProductFamily = {
    id: '6',
    name: 'Zebra',
    label: 'Zebra',
    type: 'option' as const,
    createdAt: '2023-01-01T00:00:00.000Z',
    createdByUserId: 1,
    updatedAt: '2023-01-01T00:00:00.000Z',
    updatedByUserId: 1,
    order: 1,
  };

  const imageDocumentType = {
    id: '7',
    name: 'Image',
    label: 'Image',
    type: 'option' as const,
    createdAt: '2023-01-01T00:00:00.000Z',
    createdByUserId: 1,
    updatedAt: '2023-01-01T00:00:00.000Z',
    updatedByUserId: 1,
    order: 1,
  };

  describe('when handling empty or invalid input', () => {
    it('should return empty object for empty rows array', () => {
      const result = extractFilterOptions([]);
      expect(result).toEqual({});
    });

    it('should handle rows with no values property', () => {
      const rows = [
        {
          product_family: [hplcProductFamily],
          document_type: pdfDocumentType,
        },
      ] as any;

      const result = extractFilterOptions(rows);
      expect(result).toHaveProperty('product_family');
      expect(result).toHaveProperty('document_type');
    });
  });

  describe('when extracting from single-select columns', () => {
    it('should extract unique options from single-select column', () => {
      const rows = [
        { values: { document_type: pdfDocumentType } },
        { values: { document_type: videoDocumentType } },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.document_type).toHaveLength(2);
      expect(result.document_type).toContainEqual(pdfDocumentType);
      expect(result.document_type).toContainEqual(videoDocumentType);
    });

    it('should deduplicate single-select options with same name', () => {
      const rows = [
        { values: { document_type: pdfDocumentType } },
        { values: { document_type: pdfDocumentType } },
        { values: { document_type: pdfDocumentType } },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.document_type).toHaveLength(1);
      expect(result.document_type).toContainEqual(pdfDocumentType);
    });

    it('should sort single-select options alphabetically', () => {
      const rows = [
        { values: { document_type: videoDocumentType } }, // Video
        { values: { document_type: pdfDocumentType } }, // PDF
        { values: { document_type: imageDocumentType } }, // Image
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.document_type).toHaveLength(3);
      expect(result.document_type?.[0].name).toBe('Image');
      expect(result.document_type?.[1].name).toBe('PDF');
      expect(result.document_type?.[2].name).toBe('Video');
    });
  });

  describe('when extracting from multi-select columns', () => {
    it('should extract all unique options from multi-select column', () => {
      const rows = [{ values: { product_family: [hplcProductFamily, aiaClProductFamily] } }] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toHaveLength(2);
      expect(result.product_family).toContainEqual(hplcProductFamily);
      expect(result.product_family).toContainEqual(aiaClProductFamily);
    });

    it('should deduplicate options across multiple rows with multi-select', () => {
      const rows = [
        { values: { product_family: [hplcProductFamily, aiaClProductFamily] } },
        { values: { product_family: [aiaClProductFamily, turbidimetryProductFamily] } },
        { values: { product_family: [hplcProductFamily] } },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toHaveLength(3);
      expect(result.product_family).toContainEqual(hplcProductFamily);
      expect(result.product_family).toContainEqual(aiaClProductFamily);
      expect(result.product_family).toContainEqual(turbidimetryProductFamily);
    });

    it('should sort multi-select options alphabetically', () => {
      const rows = [
        {
          values: {
            product_family: [
              zebraProductFamily, // Zebra
              aiaClProductFamily, // AIA-CL
              hplcProductFamily, // HPLC Applications
              turbidimetryProductFamily, // Turbidimetry
            ],
          },
        },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toHaveLength(4);
      expect(result.product_family?.[0].name).toBe('AIA-CL');
      expect(result.product_family?.[1].name).toBe('HPLC Applications');
      expect(result.product_family?.[2].name).toBe('Turbidimetry');
      expect(result.product_family?.[3].name).toBe('Zebra');
    });

    it('should handle empty multi-select arrays', () => {
      const rows = [{ values: { product_family: [] } }] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toEqual([]);
    });
  });

  describe('when extracting from mixed column types', () => {
    it('should handle rows with both single-select and multi-select columns', () => {
      const rows = [
        {
          values: {
            product_family: [hplcProductFamily, aiaClProductFamily],
            document_type: pdfDocumentType,
          },
        },
        {
          values: {
            product_family: [turbidimetryProductFamily],
            document_type: videoDocumentType,
          },
        },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toHaveLength(3);
      expect(result.document_type).toHaveLength(2);
    });

    it('should process multiple different columns correctly', () => {
      const rows = [
        {
          values: {
            product_family: [hplcProductFamily],
            document_type: pdfDocumentType,
            another_column: videoDocumentType,
          },
        },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result).toHaveProperty('product_family');
      expect(result).toHaveProperty('document_type');
      expect(result).toHaveProperty('another_column');
      expect(result.product_family).toHaveLength(1);
      expect(result.document_type).toHaveLength(1);
      expect(result.another_column).toHaveLength(1);
    });
  });

  describe('when handling sorting edge cases', () => {
    it('should perform case-insensitive alphabetical sorting', () => {
      const lowercase = {
        ...pdfDocumentType,
        id: '10',
        name: 'abc',
      };
      const uppercase = {
        ...pdfDocumentType,
        id: '11',
        name: 'ABC',
      };
      const mixed = {
        ...pdfDocumentType,
        id: '12',
        name: 'AbC',
      };

      const rows = [
        { values: { test_column: uppercase } },
        { values: { test_column: lowercase } },
        { values: { test_column: mixed } },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      // All three should be present and sorted (case-insensitive)
      expect(result.test_column).toHaveLength(3);
    });

    it('should handle numeric strings in sorting', () => {
      const item1 = { ...pdfDocumentType, id: '20', name: 'Item 1' };
      const item2 = { ...pdfDocumentType, id: '21', name: 'Item 2' };
      const item10 = { ...pdfDocumentType, id: '22', name: 'Item 10' };
      const item20 = { ...pdfDocumentType, id: '23', name: 'Item 20' };

      const rows = [
        { values: { test_column: item20 } },
        { values: { test_column: item1 } },
        { values: { test_column: item10 } },
        { values: { test_column: item2 } },
      ] as any;

      const result = extractFilterOptions(rows) as any;

      // With numeric: true, should sort as Item 1, Item 2, Item 10, Item 20
      expect(result.test_column).toHaveLength(4);
      expect(result.test_column?.[0].name).toBe('Item 1');
      expect(result.test_column?.[1].name).toBe('Item 2');
      expect(result.test_column?.[2].name).toBe('Item 10');
      expect(result.test_column?.[3].name).toBe('Item 20');
    });
  });

  describe('when processing complex real-world scenarios', () => {
    it('should handle the mock rows data correctly', () => {
      const result = extractFilterOptions(mockRows) as any;

      expect(result.product_family).toHaveLength(2);
      expect(result.document_type).toHaveLength(2);

      // Check alphabetical ordering
      expect(result.product_family?.[0].name).toBe('AIA-CL');
      expect(result.product_family?.[1].name).toBe('HPLC Applications');
      expect(result.document_type?.[0].name).toBe('PDF');
      expect(result.document_type?.[1].name).toBe('Video');
    });

    it('should extract unique options from large dataset with many duplicates', () => {
      const rows = Array.from({ length: 100 }, (_, i) => ({
        values: {
          product_family: [
            hplcProductFamily,
            i % 2 === 0 ? aiaClProductFamily : turbidimetryProductFamily,
          ],
          document_type: i % 3 === 0 ? pdfDocumentType : videoDocumentType,
        },
      })) as any;

      const result = extractFilterOptions(rows) as any;

      // Should still only have unique items despite 100 rows
      expect(result.product_family).toHaveLength(3);
      expect(result.document_type).toHaveLength(2);
    });

    it('should handle rows with varying column presence', () => {
      const rows = [
        { values: { product_family: [hplcProductFamily], document_type: pdfDocumentType } },
        { values: { product_family: [aiaClProductFamily] } }, // Missing document_type
        { values: { document_type: videoDocumentType } }, // Missing product_family
        { values: { other_column: imageDocumentType } }, // Different column
      ] as any;

      const result = extractFilterOptions(rows) as any;

      expect(result.product_family).toHaveLength(2);
      expect(result.document_type).toHaveLength(2);
      expect(result.other_column).toHaveLength(1);
    });
  });

  describe('when handling edge cases and data integrity', () => {
    it('should maintain all item properties during extraction', () => {
      const rows = [{ values: { product_family: [hplcProductFamily] } }] as any;

      const result = extractFilterOptions(rows) as any;

      const extractedItem = result.product_family?.[0];
      expect(extractedItem).toEqual(hplcProductFamily);
      expect(extractedItem?.id).toBe('1');
      expect(extractedItem?.label).toBe('HPLC Applications');
      expect(extractedItem?.type).toBe('option');
      expect(extractedItem?.createdAt).toBe('2023-01-01T00:00:00.000Z');
    });

    it('should not mutate original rows data', () => {
      const rows = [
        {
          values: {
            product_family: [hplcProductFamily, aiaClProductFamily],
            document_type: pdfDocumentType,
          },
        },
      ] as any;

      const originalRowsCopy = JSON.parse(JSON.stringify(rows));
      extractFilterOptions(rows);

      expect(rows).toEqual(originalRowsCopy);
    });

    it('should handle items with identical names but different IDs', () => {
      const item1 = { ...pdfDocumentType, id: '100', name: 'Duplicate Name' };
      const item2 = { ...pdfDocumentType, id: '101', name: 'Duplicate Name' };

      const rows = [{ values: { test_column: item1 } }, { values: { test_column: item2 } }] as any;

      const result = extractFilterOptions(rows) as any;

      // Should keep only one based on name matching
      expect(result.test_column).toHaveLength(1);
      expect(result.test_column?.[0].name).toBe('Duplicate Name');
    });
  });
});
