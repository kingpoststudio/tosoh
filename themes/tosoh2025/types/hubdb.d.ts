export type Matches = { [id in keyof SupportPortalRowForFilter['values']]: boolean };
export type ColumnId = keyof SupportPortalRowForFilter['values'];
export type FilterWithOptions = Record<ColumnId, ColumnItem[]>;

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

export type WebinarListingsItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: null;
  name: string;
  values: {
    date: number;
    stop_time: string;
    presenter_2_image: {
      url: string;
      width: number;
      height: number;
      altText: string;
      fileId: number;
      type: string;
    };
    webinar_subtext: string;
    priority: number;
    presenter_2_location: string;
    start_time: string;
    cta_label: string;
    presenter_2_name: string;
    webinar_title: string;
    presenter_1_name: string;
    presenter_1_location: string;
    presenter_1_title: string;
    presenter_1_image: {
      url: string;
      width: number;
      height: number;
      altText: string;
      fileId: number;
      type: string;
    };
    presenter_3_name: string;
    presenter_3_location: string;
    presenter_3_title: string;
    presenter_3_image: {
      url: string;
      width: number;
      height: number;
      altText: string;
      fileId: number;
      type: string;
    };
    language: {
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

    registration_page_url: string;
    presenter_2_title: string;
  };
  isSoftEditable: false;
  childTableId: '0';
};

export type CCTOption = {
  createdAt: number;
  createdByUserId: number;
  id: number;
  isHubspotDefined: boolean;
  label: string;
  labelTranslations: Record<string, any>;
  name: string;
  order: number;
  type: 'option';
  updatedAt: number;
  updatedByUserId: number;
};

export type CCTInstrument = {
  clinicians: string;
  company: CCTOption;
  country_of_origin: CCTOption;
  deactivate: number;
  hs_child_table_id: number;
  hs_created_at: number;
  hs_created_by_user_id: number;
  hs_deleted_at: number;
  hs_id: number;
  hs_initial_published_at: number;
  hs_is_edited: boolean;
  hs_published_at: number;
  hs_updated_at: number;
  hs_updated_by_user_id: number;
  laboratory_manager_benefits: string;
  laboratory_staff_benefits: string;
  procurement_managers_benefits: string;
  product_line?: CCTOption;
  product_name: string;
};

export type CCTInstruments = {
  limit: number;
  message: string | null;
  objects: CCTInstrument[];
  offset: number;
  total: number;
  totalCount: number;
};

export type CCTInstrumentForFilter = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: string;
  name: string;
  values: {
    clinicians: string;
    company: CCTOption;
    country_of_origin: CCTOption;
    deactivate: number;
    laboratory_manager_benefits: string;
    laboratory_staff_benefits: string;
    procurement_managers_benefits: string;
    product_line?: CCTOption;
    product_name: string;
  };
  isSoftEditable: boolean;
  childTableId: string;
};

export type CCTMatches = { [id in keyof CCTInstrumentForFilter['values']]: boolean };
export type CCTColumnId = keyof CCTInstrumentForFilter['values'];
export type CCTFilterWithOptions = Record<CCTColumnId, CCTOption[]>;

export type CCTForeignId = {
  id: number;
  isPublished: boolean;
  name: string;
  type: 'foreignid';
};

export type CCTComparison = {
  category: CCTOption;
  clinician: string;
  competitor_instrument_id: CCTForeignId[];
  hs_child_table_id: number;
  hs_created_at: number;
  hs_created_by_user_id: number;
  hs_deleted_at: number;
  hs_id: number;
  hs_initial_published_at: number;
  hs_is_edited: boolean;
  hs_path: string;
  hs_published_at: number;
  hs_updated_at: number;
  hs_updated_by_user_id: number;
  lab_manager: string;
  lab_technician: string;
  procurement_manager: string;
  status: CCTOption;
  tosoh_instrument_id: CCTForeignId[];
};

export type CCTComparisons = {
  limit: number;
  message: string | null;
  objects: CCTComparison[];
  offset: number;
  total: number;
  totalCount: number;
};

export type CCTComparisonFilterWithOptions = Record<CCTComparisonColumnId, CCTOption[]>;
