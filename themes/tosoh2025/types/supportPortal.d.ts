export type Matches = { [id in keyof SupportPortalRowForFilter['values']]: boolean };
export type ColumnId = keyof SupportPortalRowForFilter['values'];
export type FilterWithOptions = Record<ColumnId, ColumnItem[]>;

export type SupportPortalRowForFilter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: string;
  name: string;
  values: {
    stringColumn?: string;
    multiSelectColumn?: ColumnItem[];
    selectColumn?: ColumnItem;
  };
  isSoftEditable: false;
  childTableId: string;
};

export type SupportPortalItem = {
  deactivate: false;
  document_category: [
    {
      value: string;
      label: string;
    },
  ];
  document_type: [
    {
      value: string;
      label: string;
    },
  ];
  document_url: string;
  duration?: null;
  image: {
    alt_text: string;
    width: number;
    url: string;
    height: number;
  };
  internal_name: string;
  name: string;
  product_family: [
    {
      value: string;
      label: string;
    },
  ];
  product_type: [
    {
      value: string;
      label: string;
    },
  ];
  search_terms: string;
  visibility: {
    value: string;
    label: string;
  };
  wistia_cached_url?: string;
  wistia_video_url?: string;
  hs_path: string;
};

export type SupportPortalSearchItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: string;
  name: string;
  values: {
    search_terms: string;
    product_family: {
      id: string;
      name: string;
      label: string;
      type: string;
      createdAt: string;
      createdByUserId: number;
      updatedAt: string;
      updatedByUserId: number;
      order: number;
    }[];

    product_type: {
      id: string;
      name: string;
      label: string;
      type: string;
      createdAt: string;
      createdByUserId: number;
      updatedAt: string;
      updatedByUserId: number;
      order: number;
    }[];
    internal_name: string;
    visibility: {
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
    document_category: {
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
    name: string;
    wistia_cached_url: string;
    wistia_video_url: string;
    document_type: {
      id: string;
      name: string;
      label: string;
      type: string;
      createdAt: string;
      createdByUserId: number;
      updatedAt: string;
      updatedByUserId: number;
      order: number;
    }[];
    deactivate: boolean;
  };
  childTableId: string;
  isSoftEditable: boolean;
};
