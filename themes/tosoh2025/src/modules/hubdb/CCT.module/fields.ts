import { formField, richTextField, textField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    textField('title', 'Title'),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
  ];
};

export default generateFields;
