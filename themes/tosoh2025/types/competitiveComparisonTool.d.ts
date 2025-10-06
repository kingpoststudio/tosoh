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
  product_line: CCTOption;
  category: CCTOption;
  clinician: string;
  competitor_instrument_name: CCTForeignId[];
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
  tosoh_instrument_name: CCTForeignId[];
};

export type CCTComparisons = {
  limit: number;
  message: string | null;
  objects: CCTComparison[];
  offset: number;
  total: number;
  totalCount: number;
};

export type CCTComparisonColumnId = keyof CCTComparison;
export type CCTComparisonFilterWithOptions = Record<CCTComparisonColumnId, CCTOption[]>;
