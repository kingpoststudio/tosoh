export type PortaleEmogiobineItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  path: string;
  name: string;
  values: {
    summary: string;
    anomaly: string;
    blood_count: string;
    patient_dob: number;
    ethnicity: string;
    advice: string;
    other_diagnosis: string;
    attachment_1: {
      url: string;
      width: number;
      height: number;
      altText: string;
      type: string;
    };
    attachment_2: {
      url: string;
      width: number;
      height: number;
      altText: string;
      type: string;
    };
    attachment_3: {
      url: string;
      width: number;
      height: number;
      altText: string;
      type: string;
    };
    attachment_4: {
      url: string;
      width: number;
      height: number;
      altText: string;
      type: string;
    };
    sex: {
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
    diagnosis: string;
    history: string;
    hemoglobin_status: string;
    other: string;
  };
  childTableId: string;
  isSoftEditable: boolean;
};
