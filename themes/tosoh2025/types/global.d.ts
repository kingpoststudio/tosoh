import type { CCTComparisons, CCTInstruments, CCTComparison } from './hubdb';
import { HubSpotMenu } from './hubspot';

type FilterType = 'dropdown' | 'checkbox' | 'range-pm';

declare global {
  interface Window {
    Tosoh: {
      Header?: {
        mainNavigationMenu?: HubSpotMenu;
      };
      SupportPortalContent: {
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
        search: {
          hubdb_column_id: string;
          hubdb_table_id: number;
          is_access_level_filter_enabled: boolean;
          title: string;
          typeahead_enabled: boolean;
        };
        title: string;
        topic_filters: TopicFilters;

        type: 'module';
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
        search: {
          hubdb_column_id: string;
          title: string;
          typeahead_enabled: boolean;
          hubdb_table_id: number;
        };
        title: string;
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

        search: {
          hubdb_column_id: string;
          title: string;
          typeahead_enabled: boolean;
          hubdb_table_id: number;
        };
        title: string;
        topic_filters: TopicFilters;
      };
      WebinarListings: {
        tableId: string;
        preselectedLanguage: string;
        upcomingSectionEyebrow: string;
        upcomingSectionTitle: string;
        pastSectionEyebrow: string;
        pastSectionTitle: string;
        search: {
          isSearchEnabled: boolean;
          searchInputPlaceholder: string;
          searchHubdbColumnId: string;
        };
        filters: {
          areFiltersEnabled: boolean;
          dropdownFilters: {
            hubdb_column_id: string;
            dropdown_filter_placeholder: string;
          }[];
        };
        filterByTopic: string;
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
      };
      CCTDetails: {
        comparisonRows: CCTComparisons;
      };
    };
    hsVideoApi?: any;
  }
}

export {};
