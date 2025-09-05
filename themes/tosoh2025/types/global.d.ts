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
    };
    hsVideoApi?: any;
  }
}

export {};
