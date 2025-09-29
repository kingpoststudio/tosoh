import { beforeAll, afterAll, describe, it, expect, vi } from 'vitest';
import {
  doesMatchAllColumnIds,
  doesMatchContainAllTheFiltersFromUrl,
  doesRowColumnContainValueFromUrl,
  filterRows,
  getAllAvailalbeFiltersFromAllRows,
  matchValuesWithColumnNames,
  parseFilterOptions,
  sortFilterValuesAlphabetically,
} from './filterUtils';

Object.defineProperty(globalThis, 'window', {
  value: {
    location: {
      search: '',
    },
  },
  writable: true,
});

const HplcProductFamily = {
  id: '1',
  name: 'HPLC Applications',
  label: 'HPLC Applications',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
};

const aiaClProductFamily = {
  id: '1',
  name: 'AIA-CL',
  label: 'AIA-CL',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
};

const pdfDocumentType = {
  id: '2',
  name: 'PDF',
  label: 'PDF',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
};
const videoDocumentType = {
  id: '2',
  name: 'video',
  label: 'video',
  type: 'option',
  createdAt: '2023-01-01T00:00:00.000Z',
  createdByUserId: 1,
  updatedAt: '2023-01-01T00:00:00.000Z',
  updatedByUserId: 1,
  order: 1,
};

afterAll(() => {
  window.location.search = '';
});

describe('doesRowColumnContainValueFromUrl(rowValues, columnId)', () => {
  const multiselectColumnId = 'product_family' as any;
  const selectColumnId = 'document_type' as any;
  const stringColumnId = 'title' as any;
  const mockRowValues = {
    product_family: [
      {
        id: '1',
        name: 'HPLC Applications',
        label: 'HPLC Applications',
        type: 'option',
        createdAt: '2023-01-01T00:00:00.000Z',
        createdByUserId: 1,
        updatedAt: '2023-01-01T00:00:00.000Z',
        updatedByUserId: 1,
        order: 1,
      },
    ],

    document_type: {
      id: '2',
      name: 'PDF',
      label: 'PDF',
      type: 'option',
      createdAt: '2023-01-01T00:00:00.000Z',
      createdByUserId: 1,
      updatedAt: '2023-01-01T00:00:00.000Z',
      updatedByUserId: 1,
      order: 1,
    },
    title: 'Test Title',
  } as any;

  window.location.search =
    '?product_family=HPLC%20Applications&document_type=PDF&title=Test%20Title';

  it('should return true if the row contains the column with the value from the url and the type of column is multiselect', () => {
    const result = doesRowColumnContainValueFromUrl(mockRowValues, multiselectColumnId);
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('should return true if the row contains the column with the value from the url and the type of column is select', () => {
    const result = doesRowColumnContainValueFromUrl(mockRowValues, selectColumnId);
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('should return true if the row contains the column with the value from the url and the type of column is string', () => {
    const result = doesRowColumnContainValueFromUrl(mockRowValues, stringColumnId);
    expect(typeof result).toBe('boolean');
    expect(result).toBe(true);
  });

  it('should return false if the row does not contain the column with the value from the url', () => {
    // Test with a different URL parameter
    window.location.search = '?product_family=NonExistent';

    const result = doesRowColumnContainValueFromUrl(mockRowValues, multiselectColumnId);
    expect(result).toBe(false);
  });

  it('should return false if no URL parameter is provided', () => {
    window.location.search = '';

    const result = doesRowColumnContainValueFromUrl(mockRowValues, multiselectColumnId);
    expect(result).toBe(false);
  });

  it(`should return false if row does not contain the columnId`, () => {
    const result = doesRowColumnContainValueFromUrl(mockRowValues, 'non_existent_column_id' as any);
    expect(result).toBe(false);
  });
});

describe('getAllAvailalbeFiltersFromAllRows(rows)', () => {
  const mockRows = [
    {
      values: {
        product_family: [
          {
            id: '1',
            name: 'HPLC Applications',
            label: 'HPLC Applications',
            type: 'option',
            createdAt: '2023-01-01T00:00:00.000Z',
            createdByUserId: 1,
            updatedAt: '2023-01-01T00:00:00.000Z',
            updatedByUserId: 1,
            order: 1,
          },
        ],

        document_type: {
          id: '2',
          name: 'PDF',
          label: 'PDF',
          type: 'option',
          createdAt: '2023-01-01T00:00:00.000Z',
          createdByUserId: 1,
          updatedAt: '2023-01-01T00:00:00.000Z',
          updatedByUserId: 1,
          order: 1,
        },
        title: 'Test Title',
      },
    },
    {
      values: {
        product_category: [
          {
            id: '1',
            name: 'HPLC Applications',
            label: 'HPLC Applications',
            type: 'option',
            createdAt: '2023-01-01T00:00:00.000Z',
            createdByUserId: 1,
            updatedAt: '2023-01-01T00:00:00.000Z',
            updatedByUserId: 1,
            order: 1,
          },
        ],

        document_type: {
          id: '2',
          name: 'PDF',
          label: 'PDF',
          type: 'option',
          createdAt: '2023-01-01T00:00:00.000Z',
          createdByUserId: 1,
          updatedAt: '2023-01-01T00:00:00.000Z',
          updatedByUserId: 1,
          order: 1,
        },
        title: 'Test Title',
      },
    },
  ];

  it('should return all the available filters from all the rows', () => {
    const result = getAllAvailalbeFiltersFromAllRows(mockRows as any);

    expect(result).toEqual({
      product_family: [],
      document_type: [],
      title: [],
      product_category: [],
    });
  });
});

describe('matchValuesWithColumnNames(rows, allEmptyAvailableFilters)', () => {
  const mockRows = [
    {
      values: {
        product_family: [HplcProductFamily],
        document_type: pdfDocumentType,
      },
    },
    {
      values: {
        product_family: [aiaClProductFamily],
        document_type: videoDocumentType,
      },
    },
  ] as any;

  const mockAllEmptyAvailableFilters = {
    product_family: [],
    document_type: [],
  } as any;
  it('should populate the allEmptyAvailableFilters with the values from the rows', () => {
    const result = matchValuesWithColumnNames(mockRows, mockAllEmptyAvailableFilters);
    expect(result).toEqual({
      product_family: [HplcProductFamily, aiaClProductFamily],
      document_type: [pdfDocumentType, videoDocumentType],
    });
  });
});

describe('sortFilterValuesAlphabetically(allFilters)', () => {
  it('should sort the filter values alphabetically', () => {
    const mockAllFilters = {
      product_family: [HplcProductFamily, aiaClProductFamily],
      document_type: [pdfDocumentType, videoDocumentType],
    } as any;

    sortFilterValuesAlphabetically(mockAllFilters);

    expect(mockAllFilters).toEqual({
      product_family: [aiaClProductFamily, HplcProductFamily],
      document_type: [pdfDocumentType, videoDocumentType],
    });
  });
});

describe('parseFilterOptions(rows)', () => {
  const mockRows = [
    {
      values: {
        product_family: [HplcProductFamily],
        document_type: pdfDocumentType,
      },
    },
    {
      values: {
        product_family: [aiaClProductFamily],
        document_type: videoDocumentType,
      },
    },
    {
      values: {
        product_family: [HplcProductFamily],
        document_type: pdfDocumentType,
      },
    },
    {
      values: {
        product_family: [HplcProductFamily],
        document_type: videoDocumentType,
      },
    },
  ] as any;

  it('should return the filter options', () => {
    const result = parseFilterOptions(mockRows);
    expect(result).toEqual({
      product_family: [aiaClProductFamily, HplcProductFamily],
      document_type: [pdfDocumentType, videoDocumentType],
    });
  });
});

describe('doesMatchContainAllTheFiltersFromUrl(matches, filtersFromFields)', () => {
  const mockFiltersFromFields = ['product_family', 'document_type'] as any;

  it('should return true if the match contains all the active filters from the fields', () => {
    window.location.search = '?product_family=HPLC%20Applications&document_type=PDF';

    const mockMatches = {
      product_family: true,
      document_type: true,
    } as any;
    const result = doesMatchContainAllTheFiltersFromUrl(mockMatches, mockFiltersFromFields);
    expect(result).toBe(true);
  });

  it('should return false if the match does not contain all the active filters from the fields', () => {
    window.location.search = '?product_family=HPLC%20Applications&document_type=PDF';

    const mockMatches = {
      document_type: true,
    } as any;
    const result = doesMatchContainAllTheFiltersFromUrl(mockMatches, mockFiltersFromFields);
    expect(result).toBe(false);
  });

  it('should return true if no active filters are present in the URL', () => {
    window.location.search = '';

    const mockMatches = {} as any;
    const result = doesMatchContainAllTheFiltersFromUrl(mockMatches, mockFiltersFromFields);
    expect(result).toBe(true);
  });

  it('should return true if only one filter is active in URL and present in matches', () => {
    window.location.search = '?product_family=HPLC%20Applications';

    const mockMatches = {
      product_family: true,
    } as any;
    const result = doesMatchContainAllTheFiltersFromUrl(mockMatches, mockFiltersFromFields);
    expect(result).toBe(true);
  });
});

describe('doesMatchAllColumnIds(matches, filtersFromFields)', () => {
  const mockFiltersFromFields = ['product_family', 'document_type'] as any;

  it('should return true if the match contains all the active filters from the fields', () => {
    const mockMatches = {
      product_family: true,
      document_type: true,
    } as any;
    const result = doesMatchAllColumnIds(mockMatches, mockFiltersFromFields);
    expect(result).toBe(true);
  });

  it('should return false if the match does not contain all the active filters from the fields', () => {
    const mockMatches = {
      document_type: true,
    } as any;
    const result = doesMatchAllColumnIds(mockMatches, mockFiltersFromFields);
    expect(result).toBe(false);
  });
});

describe('filterRows(allRows, filtersFromFields)', () => {
  const mockRows = [
    {
      values: {
        product_family: [HplcProductFamily],
        document_type: pdfDocumentType,
      },
    },

    {
      values: {
        product_family: [aiaClProductFamily],
        document_type: videoDocumentType,
      },
    },
  ] as any;

  it('should return the filtered rows', () => {
    window.location.search = '?product_family=HPLC%20Applications';

    const mockFiltersFromFields = ['product_family', 'document_type'] as any;
    const result = filterRows(mockRows, mockFiltersFromFields);
    expect(result).toEqual([mockRows[0]]);
  });
});
