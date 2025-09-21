import type { CCTComparisons, CCTInstruments, CCTComparison } from './hubdb';
import { HubSpotMenu } from './hubspot';

declare global {
  interface Window {
    Tosoh: {
      Header?: {
        mainNavigationMenu?: HubSpotMenu;
      };
      SupportPortalContent: {
        filters: string;
        search: {
          title?: string;
          hubdb_table_id: string;
          hubdb_column_id: string;
          is_access_level_filter_enabled: boolean;
        };
        title: string;
        description: string;
        accessLevel: 'Distributor' | 'Customer' | 'Internal';
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
        allComparisons: CCTComparisons;
        allInstruments: CCTInstruments;
        allProductLines: CCTInstruments['objects'];
      };
      CCTDetails: {
        comparisonRows: CCTComparisons;
      };
    };
    hsVideoApi?: any;
  }
}

export {};
