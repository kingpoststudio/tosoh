import type {
  CCTComparison,
  CCTComparisons,
  CCTInstrument,
  CCTInstruments,
} from '../../types/hubdb';

export const addCompanyNameToCompetitorInstrumentName = (
  allRows: CCTComparisons,
  allInstruments: CCTInstruments
) => {
  if (!allRows?.objects || !allInstruments?.objects) {
    return allRows;
  }

  // Create a map of instrument ID to company name for quick lookup
  const instrumentIdToCompanyMap = new Map();
  allInstruments.objects.forEach((instrument: CCTInstrument) => {
    instrumentIdToCompanyMap.set(instrument.hs_id, instrument.company.label);
  });

  // Process each comparison and update competitor_instrument_name
  const processedRows = allRows.objects.map((comparison: CCTComparison) => {
    const updatedComparison = { ...comparison };

    if (updatedComparison.competitor_instrument_name) {
      updatedComparison.competitor_instrument_name =
        updatedComparison.competitor_instrument_name.map((instrumentRef) => {
          const companyName = instrumentIdToCompanyMap.get(instrumentRef.id);
          if (companyName) {
            return {
              ...instrumentRef,
              label: `${companyName} : ${instrumentRef.name}`,
            };
          }
          return instrumentRef;
        });
    }

    return updatedComparison;
  });

  return {
    ...allRows,
    objects: processedRows,
  };
};
