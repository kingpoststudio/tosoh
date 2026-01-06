import { richTextField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
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
