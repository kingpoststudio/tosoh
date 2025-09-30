import type { ColumnId, ColumnItem, SupportPortalRowForFilter } from '../../../types/hubdb';

// Types for better type safety
type FilterValue = string | ColumnItem | ColumnItem[];
export type FilterCriteria = Record<string, string>;
type FilterOptions = Partial<Record<ColumnId, ColumnItem[]>>;

// Types for quantity-based filtering
export interface FilterOptionWithQuantity extends ColumnItem {
  quantity: number;
}
export type FilterOptionsWithQuantity = Partial<Record<ColumnId, FilterOptionWithQuantity[]>>;

// Cache type for memoized filter options
export type FilterCache = Map<string, FilterOptionWithQuantity[]>;

// Utility functions for URL handling (dependency injection friendly)
export const parseUrlFilters = (searchString: string = window.location.search): FilterCriteria => {
  const params = new URLSearchParams(searchString);
  const filters: FilterCriteria = {};

  params.forEach((value, key) => {
    filters[key] = value;
  });

  return filters;
};

// Column type detection utilities
const isMultiSelectColumn = (value: FilterValue): value is ColumnItem[] => {
  return Array.isArray(value) && value.length > 0;
};

const isSelectColumn = (value: FilterValue): value is ColumnItem => {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'name' in value;
};

const isStringColumn = (value: FilterValue): value is string => {
  return typeof value === 'string' && value.length > 0;
};

// Core matching logic (enhanced to support checkbox comma-separated values)
export const checkColumnValueMatch = (columnValue: FilterValue, filterValue: string): boolean => {
  if (!columnValue || !filterValue) {
    return false;
  }

  // Handle comma-separated values for checkbox-type filters
  if (filterValue.includes(',')) {
    const filterValues = filterValue.split(',');
    return filterValues.some((val) => checkColumnValueMatch(columnValue, val.trim()));
  }

  if (isMultiSelectColumn(columnValue)) {
    return columnValue.some((item) => item.name === filterValue);
  }

  if (isSelectColumn(columnValue)) {
    return columnValue.name === filterValue;
  }

  if (isStringColumn(columnValue)) {
    return columnValue.toLowerCase().includes(filterValue.toLowerCase());
  }

  return false;
};

// Simplified row matching
export const checkRowMatchesFilters = (
  rowValues: SupportPortalRowForFilter['values'],
  filters: FilterCriteria
): boolean => {
  return Object.entries(filters).every(([columnId, filterValue]) => {
    const columnValue = rowValues[columnId as ColumnId];
    return columnValue ? checkColumnValueMatch(columnValue, filterValue) : false;
  });
};

// Extract unique filter options from rows
export const extractFilterOptions = (rows: SupportPortalRowForFilter[]): FilterOptions => {
  const filterOptions: FilterOptions = {};

  rows.forEach((row) => {
    const rowValues = row?.values || row;

    Object.entries(rowValues).forEach(([columnId, columnValue]) => {
      const typedColumnId = columnId as ColumnId;

      if (!filterOptions[typedColumnId]) {
        filterOptions[typedColumnId] = [];
      }

      if (isMultiSelectColumn(columnValue)) {
        columnValue.forEach((item) => {
          if (!filterOptions[typedColumnId]?.some((existing) => existing.name === item.name)) {
            filterOptions[typedColumnId]?.push(item);
          }
        });
      } else if (isSelectColumn(columnValue)) {
        if (!filterOptions[typedColumnId]?.some((existing) => existing.name === columnValue.name)) {
          filterOptions[typedColumnId]?.push(columnValue);
        }
      }
    });
  });

  // Sort all filter options alphabetically
  Object.values(filterOptions).forEach((options) => {
    options?.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });

  return filterOptions;
};

// Extract filter options with quantities (mimics getMemoizedFilterOptions behavior)
export const extractFilterOptionsWithQuantity = (
  rows: SupportPortalRowForFilter[],
  currentFilters: FilterCriteria = {},
  excludeColumnId?: ColumnId
): FilterOptionsWithQuantity => {
  const filterOptions: FilterOptionsWithQuantity = {};

  // First, collect all unique filter options for each column
  rows.forEach((row) => {
    const rowValues = row?.values || row;

    Object.entries(rowValues).forEach(([columnId, columnValue]) => {
      const typedColumnId = columnId as ColumnId;

      // Skip the column we're currently filtering (like excluding current filter accessor)
      if (excludeColumnId && typedColumnId === excludeColumnId) {
        return;
      }

      if (!filterOptions[typedColumnId]) {
        filterOptions[typedColumnId] = [];
      }

      if (isMultiSelectColumn(columnValue)) {
        columnValue.forEach((item) => {
          let existingOption = filterOptions[typedColumnId]?.find(
            (existing) => existing.name === item.name
          );
          if (!existingOption) {
            existingOption = { ...item, quantity: 0 };
            filterOptions[typedColumnId]?.push(existingOption);
          }
        });
      } else if (isSelectColumn(columnValue)) {
        let existingOption = filterOptions[typedColumnId]?.find(
          (existing) => existing.name === columnValue.name
        );
        if (!existingOption) {
          existingOption = { ...columnValue, quantity: 0 };
          filterOptions[typedColumnId]?.push(existingOption);
        }
      }
    });
  });

  // Now calculate quantities based on how many rows match other active filters
  rows.forEach((row) => {
    const rowValues = row?.values || row;

    // Check if this row matches all other active filters (excluding the current column)
    const otherFilters = Object.entries(currentFilters).filter(([key]) =>
      excludeColumnId ? key !== excludeColumnId : true
    );

    const matchesOtherFilters = otherFilters.every(([columnId, filterValue]) => {
      const columnValue = rowValues[columnId as ColumnId];
      return columnValue ? checkColumnValueMatch(columnValue, filterValue) : false;
    });

    if (matchesOtherFilters) {
      // Increment quantity for all filter options present in this row
      Object.entries(rowValues).forEach(([columnId, columnValue]) => {
        const typedColumnId = columnId as ColumnId;

        if (excludeColumnId && typedColumnId === excludeColumnId) {
          return;
        }

        if (isMultiSelectColumn(columnValue)) {
          columnValue.forEach((item) => {
            const option = filterOptions[typedColumnId]?.find(
              (existing) => existing.name === item.name
            );
            if (option) {
              option.quantity += 1;
            }
          });
        } else if (isSelectColumn(columnValue)) {
          const option = filterOptions[typedColumnId]?.find(
            (existing) => existing.name === columnValue.name
          );
          if (option) {
            option.quantity += 1;
          }
        }
      });
    }
  });

  // Sort all filter options alphabetically (default sorting)
  Object.values(filterOptions).forEach((options) => {
    options?.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  });

  return filterOptions;
};

// Main filtering function
export const filterRowsByUrlParams = (
  rows: SupportPortalRowForFilter[],
  searchString?: string,
  validFilterColumns?: string[]
): SupportPortalRowForFilter[] => {
  const allUrlFilters = parseUrlFilters(searchString);

  // Filter out only the valid column filters, excluding pagination, limit, etc.
  const filters: Record<string, string> = {};
  Object.entries(allUrlFilters).forEach(([key, value]) => {
    if (
      validFilterColumns?.includes(key) ||
      (!validFilterColumns && !['pagination', 'limit', 'offset'].includes(key))
    ) {
      filters[key] = value;
    }
  });

  if (Object.keys(filters).length === 0) {
    return rows;
  }

  return rows.filter((row) => {
    const rowValues = row?.values || row;
    return checkRowMatchesFilters(rowValues, filters);
  });
};

// Get filter options with quantities for a specific column (similar to getMemoizedFilterOptions)
export const getFilterOptionsWithQuantityForColumn = (
  rows: SupportPortalRowForFilter[],
  columnId: ColumnId,
  currentFilters: FilterCriteria = {},
  searchString?: string
): FilterOptionWithQuantity[] => {
  // Parse URL filters if searchString provided, otherwise use currentFilters
  const filters = searchString ? parseUrlFilters(searchString) : currentFilters;

  // Get all filter options with quantities, excluding the current column
  const allFilterOptions = extractFilterOptionsWithQuantity(rows, filters, columnId);

  // Return options for the specific column, or empty array if none
  return allFilterOptions[columnId] || [];
};

// Convenience function to get quantities for all columns at once
export const getAllFilterOptionsWithQuantity = (
  rows: SupportPortalRowForFilter[],
  currentFilters: FilterCriteria = {},
  searchString?: string
): FilterOptionsWithQuantity => {
  // Parse URL filters if searchString provided, otherwise use currentFilters
  const filters = searchString ? parseUrlFilters(searchString) : currentFilters;

  return extractFilterOptionsWithQuantity(rows, filters);
};

// Legacy function names for backward compatibility (if needed)
export const getAllAvailableFiltersFromAllRows = (rows: SupportPortalRowForFilter[]) => {
  const options = extractFilterOptions(rows);
  const emptyFilters: Partial<Record<ColumnId, any[]>> = {};

  Object.keys(options).forEach((columnId) => {
    emptyFilters[columnId as ColumnId] = [];
  });

  return emptyFilters;
};

export const parseFilterOptions = extractFilterOptions;
export const filterRows = filterRowsByUrlParams;

// Enhanced filtering functions that exactly mimic product catalog behavior

/**
 * Gets filter options with memoization to avoid redundant calculations.
 * Mimics the product catalog's getMemoizedFilterOptions function exactly.
 *
 * @param rows - Array of rows to filter
 * @param columnId - The column to get options for
 * @param currentFilters - Current filter state
 * @param cache - Optional cache map for memoization
 * @param customSortOrder - Optional array for custom sorting (e.g., product types)
 */
export const getMemoizedFilterOptionsForColumn = (
  rows: SupportPortalRowForFilter[],
  columnId: ColumnId,
  currentFilters: FilterCriteria = {},
  cache?: FilterCache,
  customSortOrder?: Array<{ uid: string; text: string }>
): FilterOptionWithQuantity[] => {
  // Create cache key based on filter and current filter state (excluding current column)
  const filterStateKey = Object.entries(currentFilters)
    .filter(([key]) => key !== columnId)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  const cacheKey = `${columnId}-${filterStateKey}`;

  // Return cached result if available
  if (cache?.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const filterOptions: FilterOptionWithQuantity[] = [];

  // Collect all unique filter options and calculate quantities
  rows.forEach((row) => {
    const rowValues = row?.values || row;
    const columnValue = rowValues[columnId];

    if (!columnValue) return;

    // Get the value to use for this option
    let optionValue: string;
    if (isSelectColumn(columnValue)) {
      optionValue = columnValue.name;
    } else if (isStringColumn(columnValue)) {
      optionValue = columnValue;
    } else {
      return; // Skip multi-select for individual column processing
    }

    // Find or create option
    let option = filterOptions.find((opt) => opt.name === optionValue);
    if (!option) {
      if (isSelectColumn(columnValue)) {
        option = {
          ...columnValue,
          quantity: 0,
        };
      } else {
        // For string columns, create a minimal ColumnItem structure
        option = {
          id: optionValue,
          name: optionValue,
          label: optionValue,
          type: 'string',
          createdAt: new Date().toISOString(),
          createdByUserId: 0,
          updatedAt: new Date().toISOString(),
          updatedByUserId: 0,
          order: 0,
          quantity: 0,
        };
      }
      filterOptions.push(option);
    }

    // Check if this row matches all other active filters (excluding current column)
    const matchesOtherFilters = Object.entries(currentFilters).every(([key, value]) => {
      if (key === columnId) return true; // Skip current column
      const otherColumnValue = rowValues[key as ColumnId];
      return otherColumnValue ? checkColumnValueMatch(otherColumnValue, value) : false;
    });

    if (matchesOtherFilters) {
      option.quantity += 1;
    }
  });

  // Sort filter options based on type and custom order
  if (customSortOrder && customSortOrder.length > 0) {
    filterOptions.sort((a, b) => {
      const aIndex = customSortOrder.findIndex((item) => item.uid === a.id || item.uid === a.name);
      const bIndex = customSortOrder.findIndex((item) => item.uid === b.id || item.uid === b.name);

      // If not found in custom order, put at end
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;

      return aIndex - bIndex;
    });
  } else {
    // Default sorting: alphabetical for strings, numerical for numbers
    filterOptions.sort((a, b) => {
      const aVal = a.name;
      const bVal = b.name;

      // If both are numbers, sort numerically
      if (!isNaN(Number(aVal)) && !isNaN(Number(bVal))) {
        return Number(aVal) - Number(bVal);
      }

      // Otherwise sort alphabetically
      return aVal < bVal ? -1 : 1;
    });
  }

  // Cache the result
  if (cache) {
    cache.set(cacheKey, filterOptions);
  }

  return filterOptions;
};

/**
 * Enhanced version of extractFilterOptionsWithQuantity that supports caching
 * and custom sorting like the product catalog.
 */
export const extractFilterOptionsWithQuantityEnhanced = (
  rows: SupportPortalRowForFilter[],
  currentFilters: FilterCriteria = {},
  cache?: FilterCache,
  customSortOrders?: Record<ColumnId, Array<{ uid: string; text: string }>>
): FilterOptionsWithQuantity => {
  const filterOptions: FilterOptionsWithQuantity = {};

  // Get all unique column IDs
  const columnIds = new Set<ColumnId>();
  rows.forEach((row) => {
    const rowValues = row?.values || row;
    Object.keys(rowValues).forEach((key) => columnIds.add(key as ColumnId));
  });

  // Get filter options for each column
  columnIds.forEach((columnId) => {
    const customSort = customSortOrders?.[columnId];
    filterOptions[columnId] = getMemoizedFilterOptionsForColumn(
      rows,
      columnId,
      currentFilters,
      cache,
      customSort
    );
  });

  return filterOptions;
};

/**
 * Filters rows based on current filter criteria, exactly like product catalog's filterActiveProducts.
 * Returns both filtered rows and updated filter options with quantities.
 */
export const filterRowsWithQuantities = (
  allRows: SupportPortalRowForFilter[],
  currentFilters: FilterCriteria = {},
  cache?: FilterCache,
  customSortOrders?: Record<ColumnId, Array<{ uid: string; text: string }>>
): {
  filteredRows: SupportPortalRowForFilter[];
  filterOptions: FilterOptionsWithQuantity;
} => {
  // Filter rows based on current criteria
  const filteredRows = allRows.filter((row) => {
    const rowValues = row?.values || row;
    return Object.entries(currentFilters).every(([columnId, filterValue]) => {
      const columnValue = rowValues[columnId as ColumnId];
      return columnValue ? checkColumnValueMatch(columnValue, filterValue) : false;
    });
  });

  // Get filter options with quantities based on all rows (not just filtered ones)
  const filterOptions = extractFilterOptionsWithQuantityEnhanced(
    allRows,
    currentFilters,
    cache,
    customSortOrders
  );

  return { filteredRows, filterOptions };
};

/**
 * Creates a filter cache instance for memoization
 */
export const createFilterCache = (): FilterCache => {
  return new Map<string, FilterOptionWithQuantity[]>();
};

/**
 * Clears the filter cache
 */
export const clearFilterCache = (cache: FilterCache): void => {
  cache.clear();
};

// For testing - allows dependency injection of search string
export const createFilterFunction = (searchString: string) => {
  return (rows: SupportPortalRowForFilter[]) => filterRowsByUrlParams(rows, searchString);
};
