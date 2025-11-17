import {
  choiceField,
  booleanField,
  groupField,
  imageField,
  richTextField,
  textField,
} from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    booleanField('enable_headline', 'Enable Headline', {
      default: true,
    }),
    groupField('headline', 'Headline', {
      children: [
        richTextField('eyebrow', 'Eyebrow', {
          enabled_features: contentBlockRtfFeatures,
        }),
        richTextField('title', 'Title', {
          enabled_features: contentBlockRtfFeatures,
        }),
        richTextField('content', 'Content', {
          enabled_features: contentBlockRtfFeatures,
        }),
      ],
      visibility: {
        controlling_field_path: 'enable_headline',
        controlling_value_regex: true,
        operator: 'EQUAL',
      },
    }),
    groupField('grid_rows', 'Grid Rows', {
      children: [
        groupField('lab_buttons', 'Lab Buttons', {
          children: [
            textField('button_label', 'Label'),
            imageField('image', 'Image', {
              required: true,
            }),

            choiceField('bracket_color', 'Bracket Color', {
              choices: [
                ['fill-imperial-red', 'Imperial Red'],
                ['fill-prussian-blue', 'Prussian Blue'],
                ['fill-midnight-green', 'Midnight Green'],
                ['fill-black-charcoal', 'Black Charcoal'],
              ],
              default: 'fill-imperial-red',
              required: true,
            }),

            choiceField('size', 'Size', {
              choices: [
                ['small', 'Small'],
                ['medium', 'Medium'],
                ['large', 'Large'],
              ],
              default: 'medium',
              required: true,
            }),
          ],
          occurrence: {
            min: null,
            max: null,
          },
        }),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),
    booleanField('display_footnote', 'Display Footnote', {
      default: false,
    }),
    richTextField('footnote', 'Footnote', {
      enabled_features: contentBlockRtfFeatures,
      visibility: {
        controlling_field_path: 'display_footnote',
        controlling_value_regex: true,
        operator: 'EQUAL',
      },
    }),
  ];
};

export default generateFields;
