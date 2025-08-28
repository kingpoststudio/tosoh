import { HubSpotMenu } from './hubspot';

declare global {
  interface Window {
    Tosoh?: {
      Header?: {
        mainNavigationMenu?: HubSpotMenu;
      };
      SupportPortalContent?: {
        filters?: string;
        search?: {
          title?: string;
          hubdb_table_id?: string;
          hubdb_column_id?: string;
        };
        title: string;
        description: string;
      };
    };
    hsVideoApi?: any;
  }
}

export type ThemeColor = 'petrol' | 'cream' | 'lime' | 'sand' | 'white' | 'black';

export type Size = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

export {};
