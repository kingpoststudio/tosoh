import type { ColumnId, LabelValue, Matches, SupportPortalRowForFilter } from '../../types/hubdb';

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
    row?.[columnId]?.label;

  if (isMultiselectColumn) {
    let column = row[columnId] as SupportPortalRowForFilter['values']['multiSelectColumn'];

    column?.map((selection) => {
      if (!doesContain) {
        return (doesContain = selection?.label === paramValueWithColumnId);
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
      return (doesContain = column?.label === paramValueWithColumnId);
    }
  }

  return doesContain;
};

export const parseFilterOptions = (rows: SupportPortalRowForFilter[]) => {
  let columnsIdsWithAllTheirAvailableValues: Record<string, any> = {};

  if (rows && rows?.length > 0) {
    rows.forEach((row) => {
      const rowValues = row?.values;

      Object.keys(rowValues)?.map((colummnId) => {
        if ((rowValues as any)[colummnId] && Array.isArray((rowValues as any)[colummnId])) {
          return (columnsIdsWithAllTheirAvailableValues[colummnId] = []);
        }

        if ((rowValues as any)[colummnId] && (rowValues as any)[colummnId]?.label) {
          return (columnsIdsWithAllTheirAvailableValues[colummnId] = []);
        }
      });
    });

    rows.forEach((row) => {
      const rowValues = row?.values;

      Object.keys(rowValues)?.map((colummnId) => {
        //array types
        if (Array.isArray((rowValues as any)[colummnId])) {
          const arrayWithOptions = (rowValues as any)[colummnId] as LabelValue[];

          if (arrayWithOptions && arrayWithOptions.length > 0) {
            arrayWithOptions?.map((option) => {
              const doesValueInColumnIdExists = columnsIdsWithAllTheirAvailableValues[
                colummnId
              ]?.some((existingValue: LabelValue) => existingValue.label === option?.label);

              if (!doesValueInColumnIdExists) {
                columnsIdsWithAllTheirAvailableValues[colummnId].push(option);
              }
            });
          }
        }

        //object types
        if ((rowValues as any)[colummnId]?.label) {
          const doesValueInColumnIdExists = columnsIdsWithAllTheirAvailableValues[colummnId]?.some(
            (option: any) => option.label === (rowValues as any)[colummnId]?.label
          );

          if (!doesValueInColumnIdExists) {
            columnsIdsWithAllTheirAvailableValues[colummnId].push((rowValues as any)[colummnId]);
          }
        }
      });
    });
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
        //init in matches with false as default
        areActiveFiltersMatchingRow[columnId] = false;

        //if is not matching
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
