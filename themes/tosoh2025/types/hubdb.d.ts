export type ColumnItem = {
  id: string;
  name: string;
  label: string;
  type: string;
  createdAt: string;
  createdByUserId: number;
  updatedAt: string;
  updatedByUserId: number;
  order: number;
};

export type ColumnId =
  | keyof SupportPortalRowForFilter['values']
  | keyof HemoglobinVariantsLibraryItem['values']
  | keyof WebinarListingsItem['values']
  | keyof PortaleEmogiobineItem['values']
  | keyof CCTComparison['values']
  | keyof CCTInstrumentForFilter['values']
  | string;

export type FilterWithOptions = Record<ColumnId, ColumnItem[]>;
