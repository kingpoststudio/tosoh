export type HemoglobinVariantsLibraryItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: string;
  name: string;
  displayIndex: number;
  values: {
    aka: string;

    variant_image: {
      url: string;
      width: number;
      height: number;
      altText: string;
      type: string;
    };

    heterozygote_clinical_presentation: string;
    rt_min: number;
    comments: string;
    references: string;
    ethnicity: string;
    mutation_description: string;
    variant_name: string;
    instrument: {
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
    document_url: string;
    heterozygote_comments: string;
    heterozygote_laboratory_findings: string;
    rt_max: number;
    mutation: {
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
    homozygote_clinical_presentation: string;
    homozygote_laboratory_findings: string;
    homozygote_comments: string;
    area_under_peak: string;
    window: {
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
    hgvs_name: string;
  };
  childTableId: string;
  isSoftEditable: boolean;
};
