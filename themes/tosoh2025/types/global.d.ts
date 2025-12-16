import type { Search, TopicFilters } from './fields';
import type { CCTComparisons, CCTInstruments, CCTComparison } from './hubdb';
import { HubSpotMenu } from './hubspot';

export type FilterType = 'dropdown' | 'checkbox' | 'range-pm';

declare global {
  interface Window {
    Tosoh: {
      Header?: {
        mainNavigationMenu?: HubSpotMenu;
        auxiliaryMenu?: HubSpotMenu;
        menuJustification?: 'center' | 'end';
      };

      SupportPortalContent: {
        force_list_view: boolean;
        access_level: 'Customer' | 'Distributor' | 'Internal';
        breadcrumbs: {
          title: string;
          url: {
            content_id: string | null;
            href: string;
            href_with_scheme: string;
            type: string;
          };
        }[];

        description: string;
        display_video_download: boolean;
        search: Search;
        title: string;
        topic_filters: TopicFilters;

        type: 'module';
      };
      SupportPortalDocsContent: {
        access_level: 'Customer' | 'Distributor' | 'Internal';
        document_type: 'ifu' | 'sds' | 'cofa';
        breadcrumbs: {
          title: string;
          url: {
            content_id: string | null;
            href: string;
            href_with_scheme: string;
            type: string;
          };
        }[];
        description: string;
        default_language: string;
        search: Search;
        title: string;
        topic_filters: TopicFilters;
        card_fields: {
          above_title: string;
          title: string;
          subtitle_1: string;
          subtitle_2: string;
          subtitle_3: string;
          subtitle_4: string;
        };
      };
      HemoglobinVariantsLibraryContent: {
        breadcrumbs: {
          title: string;
          url: {
            content_id: string | null;
            href: string;
            href_with_scheme: string;
            type?: string;
          };
        }[];
        eyebrow: string;
        title: string;
        search: Search;
        title: string;
        topic_filters: TopicFilters;
      };
      HemoglobinPortalContent: {
        breadcrumbs: {
          title: string;
          url: {
            content_id: string | null;
            href: string;
            href_with_scheme: string;
            type: string;
          };
        }[];
        search: Search;
        title: string;
        description: string;
        eyebrow: string;
        topic_filters: TopicFilters;
      };
      KioskDocumentsContent: {
        description: string;
        email_form: {
          form_id: null;
        };
        gated_form: {
          form_id: null;
        };
        gated_form_email: {
          form_id: null;
        };

        search: Search;
        title: string;
        topic_filters: TopicFilters;
      };
      WebinarListings: {
        advanced: {
          filter_by_topic: string;
        };
        hubdb_table_id: number;
        past_section_eyebrow: string;
        past_section_title: string;
        preselected_language: string;
        search: Search;
        topic_filters: TopicFilters;
        upcoming_section_eyebrow: string;
        upcoming_section_title: string;
      };
      CCT: {
        activeCompetitorInstruments: {
          name: string;
          label: string;
          sufficient_data_status: 'sufficient_data' | 'non_sufficient_data';
        }[];
        allInstruments: CCTInstruments;
        allProductLines: CCTInstruments['objects'][0]['product_line'][];
        instrumentsBasedOnProductLine: CCTInstruments['objects'][0]['product_name'][];
        tosohInstrument?: CCTInstruments['objects'][0];
        competitorInstrument?: CCTInstruments['objects'][0];
        comparisonRows: CCTComparisons | CCTComparison[];
      };
      CCTDetails: {
        comparisonRows: CCTComparisons;
      };
    };
    hsVideoApi?: any;
  }
}

export {};
