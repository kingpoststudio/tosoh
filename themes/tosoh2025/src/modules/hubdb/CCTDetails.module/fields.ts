import { richTextField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
  ];
};

export default generateFields;
