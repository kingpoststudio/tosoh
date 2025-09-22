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
  ];
};

export default generateFields;
