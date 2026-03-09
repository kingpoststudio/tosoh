import type {
  Search,
  TopicFilters,
  TopicFiltersWithApplyButton,
  TopicFiltersWithViewAs,
  ErrorFields,
  AdditionalConfSettings,
} from './fields';
import type { CCTComparisons, CCTInstruments, CCTComparison, Link } from './hubdb';
import { HubSpotMenu } from './hubspot';

export type FilterType = 'dropdown' | 'checkbox' | 'range-pm';

declare global {
  interface Window {
    Tosoh: {
      TranslatedContent?: {
        variants: {
          ab: false;
          absoluteUrl: string;
          approvalStatus: null;
          archived: boolean;
          archivedInDashboard: boolean;
          audienceAccess: string;
          authorName: string | null;
          businessUnitId: string | null;
          campaign: string | null;
          campaignName: string | null;
          created: number;
          currentState: 'PUBLISHED';
          htmlTitle: string;
          id: number;
          language: string;
          mab: false;
          masterId: number;
          name: string;
          password: string | null;
          previewKey: string;
          publicAccessRules: [];
          publicAccessRulesEnabled: false;
          publishDate: number;
          published: boolean;
          resolvedDomain: string;
          securityState: string;
          slug: string;
          state: string;
          teamPerms: [];
          themePath: string | null;
          updated: number;
          updatedById: number;
        }[];
        currentLanguage: string;
      };

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
        topic_filters: TopicFiltersWithViewAs;
        card_configuration: {
          download_label: string;
          view_label: string;
        };
        type: 'module';
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
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
          language_label: string;
        };
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
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
        topic_filters: TopicFiltersWithApplyButton;
        card_configuration: {
          view_details_label: string;
          download_label: string;
          also_known_as_label: string;
          mutation_type_label: string;
          mutation_description_label: string;
          migration_zone_label: string;
          variant_details_label: string;
          property_label: string;
          value_label: string;
          table_configuration: {
            variant_name_label: string;
            hgvs_name_label: string;
            mutation_label: string;
            mutation_description_label: string;
            heterozygote_clinical_presentation_label: string;
            heterozygote_laboratory_findings_label: string;
            heterozygote_comments_label: string;
            homozygote_clinical_presentation_label: string;
            homozygote_laboratory_findings_label: string;
            homozygote_comments_label: string;
            ethnicity_label: string;
            additional_comments_label: string;
            instrument_label: string;
            percent_min_max_label: string;
            rt_min_label: string;
            rt_max_label: string;
            migration_in_window_label: string;
            references_label: string;
          };
        };
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
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
        topic_filters: TopicFiltersWithApplyButton;
        card_configuration: {
          property_label: string;
          value_label: string;
          attachments_label: string;
          attachments_description: string;
          table_configuration: {
            sex_label: string;
            patient_dob_label: string;
            ethnicity_label: string;
            history_label: string;
            anomaly_label: string;
            blood_count_label: string;
            hemoglobin_status_label: string;
            other_label: string;
            diagnosis_label: string;
            other_diagnosis_label: string;
            advice_label: string;
          };
        };
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
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
        card_configuration: {
          view_details_label: string;
        };
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
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
        error_card: ErrorFields;
        additional_conf_settings: AdditionalConfSettings;
      };
      CCT: {
        filtersSidebarTitle: string;
        productLineTitle: string;
        tosohInstrumentTitle: string;
        competitorInstrumentTitle: string;
        printColumnsTitle: string;
        printButtonLabel: string;
        detailsButtonLabel: string;
        submitASuggestionButtonLabel: string;
        cctDetailsPath: Link;
        submitASuggestionPath: Link;
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
        docxLogo: {
          src: string;
          alt: string;
        };
      };
      CCTDetails: {
        comparisonRows: CCTComparisons;
        resetButtonLabel: string;
        selectCategoryPlaceholder: string;
        searchPlaceholder: string;
        firstPartOfMatchesText: string;
        secondPartOfMatchesText: string;
      };
    };
    hsVideoApi?: any;
  }
}

export {};
