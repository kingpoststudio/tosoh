import { choiceField, imageField, richTextField, textField } from 'hs-fieldkit';
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
    imageField('docx_logo', 'Document Logo', {
      inline_help_text: 'The logo to display in the document header.',
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
