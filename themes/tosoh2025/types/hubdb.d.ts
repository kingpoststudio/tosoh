export type LabelValue = {
  label: string;
  value: string;
};
export type SupportPortalRowForFilter = {
  document_category: LabelValue[];
  document_type: LabelValue[];
  product_family: LabelValue[];
  product_type: LabelValue[];
  search_terms: string;
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
