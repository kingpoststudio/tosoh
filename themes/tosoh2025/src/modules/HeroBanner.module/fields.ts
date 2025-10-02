import { choiceField, imageField, richTextField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    choiceField('banner_type', 'Type', {
      choices: [
        ['simple', 'Simple'],
        ['double_image', 'Double Image'],
      ],
      default: 'simple',
    }),
    imageField('bg', 'Background Image'),

    imageField('left_image', 'Left image', {
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'double_image',
        operator: 'EQUAL',
      },
    }),
    imageField('right_image', 'Right image', {
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'double_image',
        operator: 'EQUAL',
      },
    }),
    richTextField('title', 'Title', {
      enabled_features: contentBlockRtfFeatures,
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'simple',
        operator: 'EQUAL',
      },
    }),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'simple',
        operator: 'EQUAL',
      },
    }),
  ];
};

export default generateFields;
