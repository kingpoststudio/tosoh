import {
  choiceField,
  groupField,
  imageField,
  linkField,
  richTextField,
  textField,
} from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    choiceField('access_level', 'Access Level', {
      choices: [
        ['all', 'All'],
        ['hplc', 'HPLC'],
        ['aia', 'AIA'],
        ['aia_cl', 'AIA-CL'],
      ],
      inline_help_text:
        "If you select 'All', the module will display all instruments. If you select a specific access level, the module will only display instruments with that access level.",
      default: 'all',
    }),
    groupField('dynamic_path_settings', 'Dynamic Path Settings', {
      inline_help_text:
        'These settings will be used to generate the dynamic paths for the CCT details page, submit a suggestion page, and the Tosoh column name and the competitor column name.',
      children: [
        linkField('cct_details_path', 'Path to CCT Details', {
          inline_help_text:
            'The URL to the CCT details page. For example: https://www.example.com/cct-details.',
          required: true,
          default: {
            url: {
              content_id: null,
              type: 'INTERNAL',
              href: '/cct-details',
            },
            open_in_new_tab: false,
            no_follow: false,
          },
        }),
        linkField('submit_a_suggestion_path', 'Submit a Suggestion Path', {
          inline_help_text:
            'The URL to the submit a suggestion page. For example: https://www.example.com/submit-a-suggestion.',
          required: false,
        }),
      ],
    }),

    groupField('dynamic_content_settings', 'Dynamic Content Settings', {
      children: [
        textField('filters_sidebar_title', 'Filters Sidebar Title', {
          default: 'Select',
        }),
        textField('product_line_title', 'Product Line Title', {
          default: 'Product Line',
        }),
        textField('tosoh_instrument_title', 'Tosoh Instrument Title', {
          default: 'Tosoh Instrument',
        }),
        textField('competitor_instrument_title', 'Competitor Instrument Title', {
          default: 'Competitor Instrument',
        }),
        textField('print_columns_title', 'Print Columns Title', {
          default: 'For Who (Option to print)',
        }),
        textField('print_button_label', 'Print Button Label', {
          default: 'Print',
        }),
        textField('details_button_label', 'Details Button Label', {
          default: 'Details',
        }),
        textField('submit_a_suggestion_button_label', 'Submit a Suggestion Button Label', {
          default: 'Submit a Suggestion',
        }),
      ],
    }),

    imageField('docx_logo', 'Document Logo', {
      inline_help_text: 'The logo to display in the document header.',
    }),
    textField('title', 'Title'),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('no_instrument_selected_message', 'No instrument selected message', {
      enabled_features: contentBlockRtfFeatures,
      default: 'Please select both a Tosoh and a competitor instrument to view the comparison',
    }),
  ];
};

export default generateFields;
