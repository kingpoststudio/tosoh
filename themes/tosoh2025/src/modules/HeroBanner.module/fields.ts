import { choiceField, imageField, richTextField } from 'hs-fieldkit';

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
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'simple',
        operator: 'EQUAL',
      },
    }),
    richTextField('description', 'Description', {
      visibility: {
        controlling_field: 'banner_type',
        controlling_value_regex: 'simple',
        operator: 'EQUAL',
      },
    }),
  ];
};

export default generateFields;
