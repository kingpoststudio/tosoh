import { hubDbTableField, richTextField, urlField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    hubDbTableField('cct_details_table_id', 'CCT Details Table', {
      inline_help_text: 'The hubDB table that contains the CCT details data.',
      required: true,
    }),
    urlField('return_to_main_screen_path', 'Return to CCT Tool Path', {
      inline_help_text: 'The URL to the main CCT Tool screen.',
      required: true,
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
