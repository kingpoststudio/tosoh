import {
  choiceField,
  groupField,
  imageField,
  richTextField,
  textField,
  numberField,
  formField,
  linkField,
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

    groupField('content_configuration', 'Content Configuration', {
      children: [
        textField('pack_size_label', 'Pack Size Label', {
          default: 'Pack Size:',
        }),
        textField('quantity_label', 'Quantity Label', {
          default: 'Qty:',
        }),
        textField('request_quote_button_label', 'Request Quote Button Label', {
          default: 'Request a Quote',
        }),
        textField('download_brochure_button_label', 'Download Brochure Button Label', {
          default: 'Download Brochure',
        }),
      ],
    }),

    groupField('part_no_group', 'Part No Group', {
      children: [
        textField('part_no_label', 'Part No Label', {
          default: 'Part No:',
        }),
        textField('part_no_value', 'Part No Value'),
      ],
    }),
    groupField('short_description_group', 'Short Description Group', {
      children: [
        textField('short_description_label', 'Short Description Label', {
          default: 'Short Description:',
        }),
        textField('short_description_value', 'Short Description Value'),
      ],
    }),
    groupField('key_features_group', 'Key Features Group', {
      children: [
        textField('title', 'Key Features Title', {
          default: 'Key Features',
        }),
        richTextField('features_content', 'Key Features Content', {
          enabled_features: contentBlockRtfFeatures,
        }),
      ],
    }),
    groupField('pack_sizes', 'Pack Sizes', {
      children: [
        numberField('pack_size_value', 'Pack Size Value', {
          step: 1,
          min: 1,
          max: null,
          required: true,
          default: 1,
        }),
      ],
      occurrence: {
        min: 0,
        max: null,
      },
    }),
    formField('form', 'Form'),
    linkField('download_brochure_url', 'Download Brochure URL', {
      visibility: {
        controlling_field: 'product_type',
        controlling_value_regex: 'instrument',
        operator: 'EQUAL',
      },
    }),
  ];
};

export default generateFields;
