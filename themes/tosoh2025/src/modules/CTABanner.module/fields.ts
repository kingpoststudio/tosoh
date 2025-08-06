import {
  booleanField,
  choiceField,
  ctaField,
  groupField,
  linkField,
  numberField,
  richTextField,
  textField,
} from "hs-fieldkit";
import {
  alignmentChoices,
  decorationSettingsGroup,
  presetPaddingFields,
  contentBlockRtfFeatures,
  themeColorChoices,
  linkVariantChoices,
} from "../../../utils/fieldUtils";

const moduleSettingsGroup = groupField("module_settings", "Module Settings", {
  children: [
    choiceField("bg_color", "Background color", {
      choices: themeColorChoices,
      default: "cream",
      inline_help_text: "Sets the background color for the CTA banner.",
    }),
    choiceField("text_color", "Text color", {
      choices: themeColorChoices,
      default: "petrol",
      inline_help_text: "Sets the text color for the CTA banner.",
    }),
    ...presetPaddingFields,
  ],
});

const patternSettingsGroup = groupField("pattern_settings", "Pattern Settings", {
  children: [
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
    }),
    choiceField('pattern_color', 'Pattern Color', {
      choices: [
        ["lime", "Lime"],
        ["petrol", "Petrol"],
        ["rust", "Rust"],
        ["teal", "Teal"],
      ],
      default: 'lime',
    }),
    numberField('pattern_scale', 'Pattern Scale', {
      min: 0.25,
      max: 3,
      step: 0.25,
      default: 1,
    }),
  ],
});

const generateFields = () => [
  choiceField("align", "Alignment", {
    choices: alignmentChoices,
    default: "center",
    inline_help_text: "Controls the alignment of content within the CTA banner.",
  }),
  richTextField("eyebrow", "Eyebrow", {
    enabled_features: contentBlockRtfFeatures,
    inline_help_text: "Optional short text above the title, often used for labeling or categorization.",
  }),
  richTextField("title", "Title", {
    enabled_features: contentBlockRtfFeatures,
    inline_help_text: "Main heading for the CTA banner.",
  }),
  richTextField("description", "Description", {
    enabled_features: contentBlockRtfFeatures,
    inline_help_text: "Descriptive text providing more details about the CTA banner.",
  }),
  booleanField("is_cta", "Is link a CTA?", {
    default: true,
    inline_help_text: "Enable if the link should be styled as a call-to-action button.",
  }),
  ctaField("cta", "CTA", {
    visibility: {
      controlling_field_path: "is_cta",
      controlling_value_regex: "true",
      operator: "EQUAL",
    },
    inline_help_text: "Configure the call-to-action button for the CTA banner.",
  }),
  linkField("link", "Link", {
    visibility: {
      controlling_field_path: "is_cta",
      controlling_value_regex: "false",
      operator: "EQUAL",
    },
    inline_help_text: "Add a standard link for the CTA banner.",
  }),
  textField("link_label", "Link label", {
    default: "Learn More",
    visibility: {
      controlling_field_path: "is_cta",
      controlling_value_regex: "false",
      operator: "EQUAL",
    },
    inline_help_text: "Text to display for the link.",
  }),
  choiceField("link_variant", "Link variant", {
    choices: linkVariantChoices,
    default: "button",
    visibility: {
      controlling_field_path: "is_cta",
      controlling_value_regex: "false",
      operator: "EQUAL",
    },
    inline_help_text: "Choose the style of the link. You can select between a button or a text link.",
  }),
  moduleSettingsGroup,
  patternSettingsGroup,
  decorationSettingsGroup,
];

export default generateFields;
