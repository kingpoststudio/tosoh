import type { ColumnId, ColumnItem, Matches, SupportPortalRowForFilter } from '../../types/hubdb';

export const doesRowColumnContainValueFromUrl = (
  row: SupportPortalRowForFilter['values'],
  columnId: keyof SupportPortalRowForFilter['values']
) => {
  const params = new URLSearchParams(window.location.search);
  let paramValueWithColumnId = params?.get(columnId);
  let doesContain = false;

  if (!row || !columnId) {
    return doesContain;
  }

  if (!row?.[columnId]) {
    return doesContain;
  }

  if (!paramValueWithColumnId) {
    return doesContain;
  }

  const isMultiselectColumn =
    row?.[columnId] && Array.isArray(row[columnId]) && row[columnId]?.length > 0;
  const isStringColumn =
    row[columnId] && typeof row[columnId] === 'string' && row[columnId]?.length > 0;
  const isSelectColumn =
    row[columnId] &&
    typeof row[columnId] !== 'string' &&
    !Array.isArray(row[columnId]) &&
    row?.[columnId]?.name;

  if (isMultiselectColumn) {
    let column = row[columnId] as SupportPortalRowForFilter['values']['multiSelectColumn'];

    column?.map((selection) => {
      if (!doesContain) {
        return (doesContain = selection?.name === paramValueWithColumnId);
      }
    });
  }

  if (isStringColumn) {
    let column = row[columnId] as SupportPortalRowForFilter['values']['stringColumn'];
    const stringToSearchAgainst = column?.toLowerCase();
    const urlValueToLowerCase = paramValueWithColumnId?.toLowerCase();

    if (!doesContain) {
      return (doesContain = stringToSearchAgainst?.includes(urlValueToLowerCase) || false);
    }
  }

  if (isSelectColumn) {
    let column = row[columnId] as SupportPortalRowForFilter['values']['selectColumn'];

    if (!doesContain) {
      return (doesContain = column?.name === paramValueWithColumnId);
    }
  }

  return doesContain;
};

const getAllAvailalbeFiltersFromAllRows = (rows: SupportPortalRowForFilter[]) => {
  let allFilters: Record<ColumnId, SupportPortalRowForFilter['values'][]> | {} = {};

  rows.forEach((row) => {
    const rowValues = row?.values;

    Object.keys(rowValues)?.forEach((columnName) => {
      let columnId = columnName as ColumnId;

      if (!(columnId in allFilters)) {
        (allFilters as any)[columnId] = [];
      }
    });
  });

  return allFilters;
};

const matchValuesWithColumnNames = (
  rows: SupportPortalRowForFilter[],
  allEmptyAvailableFilters: Record<ColumnId, any[]>
): Record<ColumnId, SupportPortalRowForFilter['values'][]> => {
  const allFilters = { ...allEmptyAvailableFilters };

  rows.forEach((row) => {
    const rowValues = row?.values;

    Object.keys(rowValues)?.map((colummnName) => {
      const columnId = colummnName as ColumnId;
      const isMultiselectColumn = Array.isArray((rowValues as any)[columnId]);
      const isSelectColumn = (rowValues as any)[columnId]?.name;

      if (isMultiselectColumn) {
        const arrayWithOptions = (rowValues as any)[columnId];

        if (arrayWithOptions && arrayWithOptions.length > 0) {
          arrayWithOptions?.map((multiSelectOption: ColumnItem) => {
            const doesValueInColumnIdExists = allFilters[columnId]?.some(
              (existingValue: any) => existingValue?.name === multiSelectOption?.name
            );

            if (!doesValueInColumnIdExists) {
              allFilters[columnId].push(multiSelectOption);
            }
          });
        }
      }

      //object types
      if (isSelectColumn) {
        const doesValueInColumnIdExists = allFilters[columnId]?.some(
          (option: any) => option?.name === (rowValues as any)[columnId]?.name
        );

        if (!doesValueInColumnIdExists) {
          allFilters[columnId].push((rowValues as any)[columnId]);
        }
      }
    });
  });

  return allFilters;
};

export const parseFilterOptions = (rows: SupportPortalRowForFilter[]) => {
  let columnsIdsWithAllTheirAvailableValues:
    | Record<ColumnId, SupportPortalRowForFilter['values'][]>
    | {} = {};

  if (rows && rows?.length > 0) {
    const emptyFilters = getAllAvailalbeFiltersFromAllRows(rows);

    if (Object?.keys?.(emptyFilters)?.length > 0) {
      const allEmptyFilters = emptyFilters as Record<ColumnId, []>;
      columnsIdsWithAllTheirAvailableValues = matchValuesWithColumnNames(rows, allEmptyFilters);
    }
  }

  return columnsIdsWithAllTheirAvailableValues;
};

export const doesMatchContainAllTheFiltersFromUrl = (
  matches: Matches,
  filtersFromFields: ColumnId[]
) => {
  const params = new URLSearchParams(window.location.search);

  const activeFiltersBasedOnUrl = filtersFromFields?.filter((columnId) => {
    if (params.get(columnId as any)) {
      return true;
    }
    return false;
  });

  let hasAllTheNeccessaryFilters = true;

  let rowMatches = Object?.keys(matches)?.map((columnId) => columnId) || [];

  activeFiltersBasedOnUrl?.forEach((requiredColumnId) => {
    if (!rowMatches?.some((v) => v === requiredColumnId)) {
      hasAllTheNeccessaryFilters = false;
    }
  });

  return hasAllTheNeccessaryFilters;
};

const doesMatchAllColumnIds = (matches: Matches, filtersFromFields: ColumnId[]) => {
  let matchesAll = true;

  if (matches && Object?.keys(matches)) {
    if (!doesMatchContainAllTheFiltersFromUrl(matches, filtersFromFields)) {
      matchesAll = false;
    }

    Object?.keys(matches)?.map((columnId) => {
      const doesRequiredFilterExistInMatches = columnId in matches;
      const isRequiredFilterFullfiled = (matches as Matches)[columnId as ColumnId];

      if (!doesRequiredFilterExistInMatches || !isRequiredFilterFullfiled) {
        matchesAll = false;
      }
    });
  }

  return matchesAll;
};

export const filterRows = (allRows: SupportPortalRowForFilter[], filtersFromFields: ColumnId[]) => {
  const filteredRows = allRows.filter((row: SupportPortalRowForFilter) => {
    let areActiveFiltersMatchingRow: Matches = {};

    const rowValues = row.values;
    Object.keys(rowValues)?.map((columnKey: any) => {
      let columnId = columnKey as keyof SupportPortalRowForFilter['values'];

      const params = new URLSearchParams(window.location.search);

      let doesColumnIdExistInUrl = params?.get(columnId);

      if (doesColumnIdExistInUrl) {
        areActiveFiltersMatchingRow[columnId] = false;

        if (!areActiveFiltersMatchingRow[columnId]) {
          areActiveFiltersMatchingRow[columnId] = doesRowColumnContainValueFromUrl(
            rowValues,
            columnId
          );
        }
      }
    });

    return doesMatchAllColumnIds(areActiveFiltersMatchingRow, filtersFromFields);
  });

  return filteredRows;
};
