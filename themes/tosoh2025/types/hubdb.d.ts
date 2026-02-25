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

export type Link = {
  no_follow: boolean;
  open_in_new_tab: boolean;
  rel: string;
  sponsored: boolean;
  url: {
    content_id: string | null;
    href: string;
    href_with_scheme: string;
    type: string;
  };
};
