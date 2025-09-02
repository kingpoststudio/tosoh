import { groupField } from 'hs-fieldkit';
import { presetPaddingFields } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    groupField('padding_settings', 'Padding Settings', {
      children: [...presetPaddingFields],
    }),
  ];
};

export default generateFields;
