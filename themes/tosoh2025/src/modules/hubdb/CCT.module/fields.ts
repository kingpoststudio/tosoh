import {
  choiceField,
  groupField,
  hubDbTableField,
  imageField,
  richTextField,
  textField,
  urlField,
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
    hubDbTableField('cct_instruments_table_id', 'CCT Instruments Table', {
      inline_help_text: 'The hubDB table that contains the CCT instruments data.',
      required: true,
    }),

    groupField('dynamic_path_settings', 'Dynamic Path Settings', {
      inline_help_text:
        'These settings will be used to generate the dynamic paths for the CCT details page, submit a suggestion page, and the Tosoh column name and the competitor column name.',
      children: [
        urlField('cct_details_path', 'Path to CCT Details', {
          inline_help_text:
            'The URL to the CCT details page. For example: https://www.example.com/cct-details.',
          required: true,
        }),
        urlField('submit_a_suggestion_path', 'Submit a Suggestion Path', {
          inline_help_text:
            'The URL to the submit a suggestion page. For example: https://www.example.com/submit-a-suggestion.',
          required: true,
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
