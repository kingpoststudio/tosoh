import { describe, it, expect } from 'vitest';
import { parseUrlFilters } from './filterUtils';

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
