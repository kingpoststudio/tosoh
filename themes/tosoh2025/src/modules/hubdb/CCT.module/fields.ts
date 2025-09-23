import { choiceField, richTextField, textField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    choiceField('access_level', 'Access Level', {
      choices: [
        ['all', 'All'],
        ['hplc', 'HPLC'],
        ['cl', 'CL'],
        ['aia_cl', 'AIA-CL'],
      ],
      default: 'all',
    }),
    textField('title', 'Title'),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('no_instrument_selected_message', 'No instrument selected message', {
      enabled_features: contentBlockRtfFeatures,
      default: 'Please select a Tosoh Product to start',
    }),
    richTextField('no_tosoh_instrument_selected_message', 'No Tosoh instrument selected message', {
      enabled_features: contentBlockRtfFeatures,
      default: 'Please select a Tosoh instrument',
    }),
    richTextField(
      'no_competitor_instrument_selected_message',
      'No competitor instrument selected message',
      {
        enabled_features: contentBlockRtfFeatures,
        default: 'Please select a competitor instrument',
      }
    ),
  ];
};

export default generateFields;
