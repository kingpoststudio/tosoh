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
