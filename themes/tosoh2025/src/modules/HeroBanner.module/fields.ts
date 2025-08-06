import { booleanField, choiceField, ctaField, imageField, linkField, numberField, richTextField, textField } from 'hs-fieldkit';
import { contentBlockRtfFeatures, themeColorChoices, decorationSettingsGroup } from '../../../utils/fieldUtils';

const generateFields = () => {
  return [
    booleanField('is_condensed', 'Condense the banner?', { inline_help_text: 'If enabled, the banner\'s height will be reduced. This is useful for smaller amounts of content.' }),
    booleanField('is_decorated', 'Show line decoration?', { inline_help_text: 'If enabled, a decorative line will be shown below the title and across the banner.' }),
    choiceField('bg_color', 'Background Color', { choices: themeColorChoices }),
    richTextField('eyebrow', 'Eyebrow', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('title', 'Title', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    booleanField('is_cta', 'Is link a CTA?'),
    ctaField('cta', 'CTA',
      {
        visibility: {
          controlling_field: 'is_cta',
          controlling_value_regex: 'true',
          operator: 'EQUAL',
        },
      }),
    linkField('link', 'Link',
      {
        visibility: {
          controlling_field: 'is_cta',
          controlling_value_regex: 'false',
          operator: 'EQUAL',
        },
      }),
    textField('link_label', 'Link Label',
      {
        default: 'Learn More',
        visibility: {
          controlling_field: 'is_cta',
          controlling_value_regex: 'false',
          operator: 'EQUAL',
        },
      }),
    booleanField('is_pattern', 'Use a pattern instead of an image?', {
      inline_help_text: 'If enabled, a pattern will be used instead of an image.',
      default: false,
    }),
    imageField('image', 'Image', {
      visibility: {
        controlling_field: 'is_pattern',
        controlling_value_regex: 'false',
        operator: 'EQUAL',
      },
      inline_help_text: 'The image will be displayed on the right side of the banner.',
    }),
    choiceField('pattern', 'Pattern', {
      choices: [
        ["emerger", "Emerger"],
        ["stacker", "Stacker"],
        ["reflector", "Reflector"],
        ["tilter", "Tilter"],
        ["revealer", "Revealer"],
        ["unfurler", "Unfurler"],
        ["flipper", "Flipper"]
      ],
      visibility: {
        controlling_field: 'is_pattern',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      },
    }),
    choiceField('pattern_color', 'Pattern Color', {
      choices: [
        ["lime", "Lime"],
        ["petrol", "Petrol"],
        ["rust", "Rust"],
        ["teal", "Teal"],
      ],
      visibility: {
        controlling_field: 'is_pattern',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      },
      default: 'lime',
    }),
    numberField('pattern_scale', 'Pattern Scale', {
      min: 0.25,
      max: 3,
      step: 0.25,
      default: 1,
      visibility: {
        controlling_field: 'is_pattern',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      },
    }),
    choiceField('image_variant', 'Image Variant', {
      choices: [
        ["circle-top", "Circle (top)"],
        ["circle-bottom", "Circle (bottom)"],
        ["pill", "Pill"],
        ["square", "Square"],
      ],
    }),
    booleanField('is_share_displayed', 'Display Share toolbar?', { inline_help_text: 'If enabled, a share toolbar will be displayed in the banner.' }),
    decorationSettingsGroup,
  ];
};

export default generateFields;
