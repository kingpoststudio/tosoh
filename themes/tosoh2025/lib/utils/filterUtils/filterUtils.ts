import type { ColumnId, ColumnItem, SupportPortalRowForFilter } from '../../../types/hubdb';

// Types for better type safety
type FilterValue = string | number | ColumnItem | ColumnItem[];
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

// Extract tolerance configuration from filter definitions
export const extractToleranceConfig = (filterDefinitions: any[]): Record<string, number> => {
  const toleranceConfig: Record<string, number> = {};

  filterDefinitions?.forEach((filter) => {
    if (filter.hubdb_column_id && typeof filter.tolerance === 'number') {
      toleranceConfig[filter.hubdb_column_id] = filter.tolerance;
    }
  });

  return toleranceConfig;
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

const isNumericColumn = (value: FilterValue): value is number => {
  return typeof value === 'number';
};

// Core matching logic (enhanced to support checkbox comma-separated values and numeric tolerance)
export const checkColumnValueMatch = (
  columnValue: FilterValue,
  filterValue: string,
  tolerance: number = 0
): boolean => {
  if (columnValue === null || columnValue === undefined || !filterValue) {
    return false;
  }

  // Handle comma-separated values for checkbox-type filters
  if (filterValue.includes(',')) {
    const filterValues = filterValue.split(',');
    return filterValues.some((val) => checkColumnValueMatch(columnValue, val.trim(), tolerance));
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

  if (isNumericColumn(columnValue)) {
    const filterValueTrimmed = filterValue.trim();
    const numericValue = parseFloat(columnValue.toString());
    const filterNumericValue = parseFloat(filterValueTrimmed);

    if (isNaN(numericValue) || isNaN(filterNumericValue)) {
      return false;
    }

    if (tolerance > 0) {
      // Range-based matching with tolerance
      const lowerBound = filterNumericValue - tolerance;
      const upperBound = filterNumericValue + tolerance;
      return numericValue >= lowerBound && numericValue <= upperBound;
    } else {
      // Exact matching when tolerance is 0
      return numericValue === filterNumericValue;
    }
  }

  return false;
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

/**
 * Tolerance-aware version of getMemoizedFilterOptionsForColumn
 */
export const getMemoizedFilterOptionsForColumnWithTolerance = (
  rows: SupportPortalRowForFilter[],
  columnId: ColumnId,
  currentFilters: FilterCriteria = {},
  toleranceConfig: Record<string, number> = {},
  cache?: FilterCache,
  customSortOrder?: Array<{ uid: string; text: string }>
): FilterOptionWithQuantity[] => {
  // Create cache key based on filter and current filter state (excluding current column)
  const filterStateKey = Object.entries(currentFilters)
    .filter(([key]) => key !== columnId)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  const toleranceKey = Object.entries(toleranceConfig)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  const cacheKey = `${columnId}-${filterStateKey}-${toleranceKey}`;

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

    // Handle different column types
    if (isMultiSelectColumn(columnValue)) {
      // For multi-select columns, process each item separately
      columnValue.forEach((item) => {
        // Find or create option for this multi-select item
        let option = filterOptions.find((opt) => opt.name === item.name);
        if (!option) {
          option = {
            ...item,
            quantity: 0,
          };
          filterOptions.push(option);
        }

        // Check if this row matches all other active filters (excluding current column) with tolerance
        const matchesOtherFilters = Object.entries(currentFilters).every(([key, value]) => {
          if (key === columnId) return true; // Skip current column
          const otherColumnValue = rowValues[key as ColumnId];
          const tolerance = toleranceConfig[key] || 0;
          return otherColumnValue
            ? checkColumnValueMatch(otherColumnValue, value, tolerance)
            : false;
        });

        if (matchesOtherFilters) {
          option.quantity += 1;
        }
      });
    } else {
      // Handle single-select and string columns
      let optionValue: string;
      if (isSelectColumn(columnValue)) {
        optionValue = columnValue.name;
      } else if (isStringColumn(columnValue)) {
        optionValue = columnValue;
      } else {
        return; // Skip unsupported column types
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

      // Check if this row matches all other active filters (excluding current column) with tolerance
      const matchesOtherFilters = Object.entries(currentFilters).every(([key, value]) => {
        if (key === columnId) return true; // Skip current column
        const otherColumnValue = rowValues[key as ColumnId];
        const tolerance = toleranceConfig[key] || 0;
        return otherColumnValue ? checkColumnValueMatch(otherColumnValue, value, tolerance) : false;
      });

      if (matchesOtherFilters) {
        option.quantity += 1;
      }
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
