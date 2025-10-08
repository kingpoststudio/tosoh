import {
  choiceField,
  booleanField,
  groupField,
  imageField,
  richTextField,
  textField,
  numberField,
  formField,
  urlField,
} from 'hs-fieldkit';
import { breadCrumbField, contentBlockRtfFeatures } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    choiceField('product_type', 'Product Type', {
      choices: [
        ['consumable', 'Consumable'],
        ['instrument', 'Instrument'],
      ],
    }),
    breadCrumbField,
    groupField('images', 'Images', {
      children: [imageField('image', 'Image')],
      occurrence: {
        min: 1,
        max: null,
      },
    }),

    richTextField('eyebrow', 'Eyebrow', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('title', 'Title', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    textField('part_no', 'Part No'),
    textField('short_description', 'Short Description'),
    groupField('key_features', 'Key Features', {
      children: [textField('key_value', 'Key Value')],
      occurrence: {
        min: 0,
        max: null,
      },
    }),
    groupField('pick_sizes', 'Pick Sizes', {
      children: [
        numberField('pick_size_value', 'Pick Size Value', {
          step: 1,
          min: 1,
          max: null,
        }),
      ],
      occurrence: {
        min: 0,
        max: null,
      },
    }),
    formField('form', 'Form'),
    urlField('download_brochure_url', 'Download Brochure URL', {
      visibility: {
        controlling_field: 'product_type',
        controlling_value_regex: 'instrument',
        operator: 'EQUAL',
      },
    }),
  ];
};

export default generateFields;
