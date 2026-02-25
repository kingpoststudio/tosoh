import {
  groupField,
  hubDbTableField,
  linkField,
  richTextField,
  textField,
  urlField,
} from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    hubDbTableField('cct_instruments_table_id', 'CCT Instruments Table', {
      inline_help_text: 'The hubDB table that contains the CCT details data.',
      required: true,
    }),
    hubDbTableField('cct_comparison_table_id', 'CCT Comparison Table', {
      inline_help_text: 'The hubDB table that contains the CCT comparison data.',
      required: true,
    }),

    groupField('dynamic_content_settings', 'Dynamic Content Settings', {
      children: [
        textField('details_title', 'Details Title', {
          default: 'Details for',
        }),
        textField('versus_text', 'Versus Text', {
          default: 'versus',
        }),
        textField('first_part_of_matches_text', 'First Part of Matches Text', {
          default: 'of ',
        }),
        textField('second_part_of_matches_text', 'Second Part of Matches Text', {
          default: ' matches',
        }),
        textField('search_placeholder', 'Search Placeholder', {
          default: 'Search in table...',
        }),
        textField('select_category_placeholder', 'Select Category Placeholder', {
          default: 'Select Category',
        }),
        textField('reset_button_label', 'Reset Button Label', {
          default: 'Reset',
        }),
      ],
    }),
    linkField('return_to_main_screen_path', 'Return to CCT Tool Path', {
      inline_help_text: 'The URL to the main CCT Tool screen.',
      required: true,
      default: {
        url: {
          content_id: null,
          type: 'INTERNAL',
          href: '/cct',
        },
      },
    }),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('no_data_message', 'No data message', {
      enabled_features: contentBlockRtfFeatures,
      default: 'No comparison data available - missing instrument parameters',
    }),
    richTextField('return_to_main_screen_message', 'Return to main screen message', {
      enabled_features: contentBlockRtfFeatures,
      default: 'Return to main screen',
    }),
  ];
};

export default generateFields;
