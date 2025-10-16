import { groupField, imageField, linkField, textField } from 'hs-fieldkit';
import { presetPaddingFieldsBase, presetPaddingFields } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    textField('title', 'Title'),
    groupField('speakers', 'Speakers', {
      children: [
        imageField('img', 'Image'),
        textField('speaker_name', 'Name'),
        textField('workplace', 'Workplace'),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),

    groupField('card_settings', 'Card Settings', {
      children: [...presetPaddingFieldsBase],
    }),

    groupField('module_settings', 'Module Settings', {
      children: [...presetPaddingFields],
    }),
  ];
};

export default generateFields;
