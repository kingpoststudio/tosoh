import {
  booleanField,
  choiceField,
  ctaField,
  formField,
  groupField,
  imageField,
  linkField,
  numberField,
  richTextField,
  textField,
  videoField,
} from "hs-fieldkit";
import {
  alignmentChoices,
  animationSettingsGroup,
  decorationSettingsGroup,
  revealSettingsGroup,
  offsetFields,
  paddingFields,
  presetPaddingFields,
  contentBlockRtfFeatures,
  shapeVariantChoices,
  sizeChoices,
  themeColorChoices,
  extendedThemeColorChoices,
  linkVariantChoices,
} from "../../../utils/fieldUtils";

const generateContainerSettings = (presetPadding = false, visibilityPath = "") => [
  choiceField("bg_color", "Background color", {
    choices: themeColorChoices,
    default: "cream",
    inline_help_text: "Sets the background color for the entire module.",
  }),
  choiceField("text_color", "Text color", {
    choices: themeColorChoices,
    default: "petrol",
    inline_help_text: "Sets the text color for the entire module.",
  }),
  choiceField("gap", "Gap between columns", {
    choices: sizeChoices,
    default: "md",
    inline_help_text: "Controls the spacing between columns.",
  }),
  choiceField("justify", "Justification (horizontal)", {
    choices: [
      ["justify-start", "Start"],
      ["justify-center", "Center"],
      ["justify-end", "End"],
      ["justify-between", "Between"],
      ["justify-around", "Around"],
      ["justify-evenly", "Evenly"]
    ],
    default: "justify-center",
    inline_help_text: "Controls the x-axis justification of all content within the module or tab.",
    visibility: {
      controlling_field_path: `${visibilityPath}.overflow_scroll_x`,
      controlling_value_regex: "false",
      operator: "EQUAL",
    },
  }),
  booleanField("overflow_scroll_x", "Enable horizontal scrolling?", {
    default: false,
    inline_help_text: "When enabled, columns will scroll horizontally on mobile devices instead of stacking vertically.",
  }),
  booleanField("is_reversed_mobile", "Reverse columns on mobile?", {
    inline_help_text: "Reverses the order of columns on mobile devices.",
    visibility: {
      controlling_field_path: `${visibilityPath}.overflow_scroll_x`,
      controlling_value_regex: "false",
      operator: "EQUAL",
    }
  }),
  ...(presetPadding ? presetPaddingFields : paddingFields),
];

/* Column Settings */
const columnSettingsGroup = groupField("column_settings", "Column Settings", {
  children: [
    numberField("flex_factor", "Flex factor", {
      default: 0,
      min: 0,
      max: 8,
      step: 1,
      inline_help_text:
        "Determines the relative width of the column compared to others. Think of it like dividing a pie - if one column has flex factor 2 and another has flex factor 1, the first column will be twice as wide as the second. <strong>If flex factor is set to 0, you will be able to set a fixed width for the column.</strong>",
    }),
    choiceField("column_size", "Column size", {
      choices: sizeChoices,
      visibility: {
        controlling_field_path: "columns.column_settings.flex_factor",
        controlling_value_regex: 0,
        operator: "EQUAL",
      },
    }),
    choiceField("align", "Alignment (vertical)", {
      choices: alignmentChoices,
      default: "start",
      inline_help_text: "Controls the y-axis alignment of content within the column.",
    }),
    choiceField("justify", "Justification (horizontal)", {
      choices: alignmentChoices,
      default: "start",
      inline_help_text: "Controls the x-axis justification of content within the column.",
    }),
    choiceField("bg_color", "Background color", {
      choices: themeColorChoices,
      inline_help_text: "Sets the background color for this column.",
    }),
    choiceField("text_color", "Text color", {
      choices: themeColorChoices,
      inline_help_text: "Sets the text color for this column.",
    }),
    choiceField("border_color", "Border color", {
      choices: extendedThemeColorChoices,
      default: "transparent",
      inline_help_text: "Sets the border color for this column.",
    }),
    ...paddingFields,
    ...offsetFields,
  ],
});

/* Module Settings, specific to FlexColumns module */
const moduleSettingsGroup = groupField("module_settings", "Module Settings", {
  children: generateContainerSettings(true, "module_settings"),
});

/* Tab Settings */
const tabGroupSettingsGroup = groupField("tab_group_settings", "Tab Group Settings", {
  children: [
    booleanField("is_enabled", "Enable tab groups?", {
      default: false,
      inline_help_text:
        "If enabled, the columns will be grouped into tabs. This is useful for when you want to organize content into different sections.",
    }),
    groupField("tab_groups", "Tab groups", {
      occurrence: {},
      children: [
        textField("group_id", "Group ID", {
          inline_help_text:
            "Provide a unique ID for the tab group. This will be used to determine which columns will be placed within the tab groups.",
        }),
        textField("group_label", "Group label"),
        groupField("tab_settings", "Tab Settings", {
          children: generateContainerSettings(false, "tab_group_settings.tab_groups.tab_settings"),
        }),
      ],
      visibility: {
        controlling_field_path: "tab_group_settings.is_enabled",
        controlling_value_regex: "true",
        operator: "EQUAL",
      },
    }),
  ],
});


const generateFields = () => [
  groupField("columns", "Columns", {
    children: [
      /* Tab Group ID: required if tab groups are enabled. */
      textField("tab_group_id", "Tab group ID", {
        inline_help_text:
          'This field value must match the "Group ID" value in the "Tabs" section. This will determine where the column will be placed within the tab groups; if the value doesn\'t match any group ID, the column content will not appear.',
        visibility: {
          controlling_field_path: "tab_group_settings.is_enabled",
          controlling_value_regex: "true",
          operator: "EQUAL",
        },
      }),

      choiceField("type", "Column type", {
        choices: [
          ["content", "Content"],
          ["media", "Media"],
          ["quote", "Quote"],
          ["form", "Form"],
          ["shape", "Shape"],
          ["spacer", "Spacer"],
          ["rtf", "Richtext"],
        ],
        inline_help_text: "Select the type of content to display in this column.",
      }),

      /* Content */
      groupField("content", "Content", {
        inline_help_text:
          "A content block provides a pre-structured layout for displaying text, images, links and more.",
        children: [
          choiceField("align", "Alignment", {
            choices: alignmentChoices,
            default: "start",
            inline_help_text: "Controls the alignment of content within this column.",
          }),
          richTextField("eyebrow", "Eyebrow", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Optional short text above the title, often used for labeling or categorization.",
          }),
          richTextField("title", "Title", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Main heading for this content block.",
          }),
          richTextField("description", "Description", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Descriptive text providing more details about this content block.",
          }),
          booleanField("is_cta", "Is link a CTA?", {
            inline_help_text: "Enable if the link should be styled as a call-to-action button.",
          }),
          ctaField("cta", "CTA", {
            visibility: {
              controlling_field_path: "columns.content.is_cta",
              controlling_value_regex: "true",
              operator: "EQUAL",
            },
            inline_help_text: "Configure the call-to-action button for this content block.",
          }),
          linkField("link", "Link", {
            visibility: {
              controlling_field_path: "columns.content.is_cta",
              controlling_value_regex: "false",
              operator: "EQUAL",
            },
            inline_help_text: "Add a standard link for this content block.",
          }),
          textField("link_label", "Link label", {
            default: "Learn More",
            visibility: {
              controlling_field_path: "columns.content.is_cta",
              controlling_value_regex: "false",
              operator: "EQUAL",
            },
            inline_help_text: "Text to display for the link.",
          }),
          choiceField("link_variant", "Link variant", {
            choices: linkVariantChoices,
            default: "button",
            visibility: {
              controlling_field_path: "columns.content.is_cta",
              controlling_value_regex: "false",
              operator: "EQUAL",
            },
            inline_help_text: "Choose the style of the link. You can select between a button or a text link.",
          }),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "content",
          operator: "EQUAL",
        },
      }),

      /* Media */
      groupField("media", "Media", {
        inline_help_text:
          "A media block that allows you to add a shaped image or video with a caption.",
        children: [
          choiceField("type", "Media type", {
            choices: [
              ["image", "Image"],
              ["pattern", "Pattern"],
              ["hs_video", "Video (HubSpot)"],
              ["video", "Video (External)"],
            ],
            default: "image",
            inline_help_text: "Choose whether to display an image, a Tosoh pattern, a HubSpot video hosted locally, or an external video URL.",
          }),
          imageField("image", "Image", {
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "image",
              operator: "EQUAL",
            },
            inline_help_text: "Upload or select an image to display.",
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
            default: 'emerger',
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "pattern",
              operator: "EQUAL",
            },
          }),
          choiceField('pattern_color', 'Pattern Color', {
            choices: [
              ["lime", "Lime"],
              ["petrol", "Petrol"],
              ["rust", "Rust"],
              ["teal", "Teal"],
            ],
            default: 'lime',
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "pattern",
              operator: "EQUAL",
            },
          }),
          numberField('pattern_scale', 'Pattern Scale', {
            min: 0.25,
            max: 3,
            step: 0.25,
            default: 1,
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "pattern",
              operator: "EQUAL",
            },
          }),
          booleanField("is_image_contained", "Is image contained?", {
            inline_help_text:
              "If enabled, the image will be contained within the column, otherwise it will fill the column width.",
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "image",
              operator: "EQUAL",
            },
          }),
          videoField("hs_video", "Video (HubSpot)", {
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "hs_video",
              operator: "EQUAL",
            },
          }),
          textField("video", "Video (External)", {
            visibility: {
              controlling_field_path: "columns.media.type",
              controlling_value_regex: "video",
              operator: "EQUAL",
            },
            inline_help_text: "Enter the URL of the external video to display.",
          }),
          choiceField("media_shape", "Media shape", {
            choices: shapeVariantChoices,
            inline_help_text: "Select the shape or style for the media display.",
          }),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "media",
          operator: "EQUAL",
        },
      }),

      /* Quote */
      groupField("quote", "Quote", {
        inline_help_text: "A quote block that allows you to add a styled card with a quote and an author.",
        children: [
          textField("quote", "Quote"),
          textField("author", "Author"),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "quote",
          operator: "EQUAL",
        },
      }),

      /* Form */
      groupField("form", "Form", {
        inline_help_text:
          "A form block that allows you to add a form with a title and description.",
        children: [
          richTextField("eyebrow", "Eyebrow", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Optional short text above the form title.",
          }),
          richTextField("title", "Title", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Main heading for the form.",
          }),
          richTextField("description", "Description", {
            enabled_features: contentBlockRtfFeatures,
            inline_help_text: "Descriptive text providing more details about the form.",
          }),
          formField("form", "Form", {
            inline_help_text: "Select or configure the form to display in this column.",
          }),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "form",
          operator: "EQUAL",
        },
      }),

      /* Shape */
      groupField("shape", "Shape", {
        inline_help_text:
          "A shape block that allows you to add a decorative end-cap to the columns.",
        children: [
          choiceField("shape", "Shape type", {
            choices: shapeVariantChoices,
          }),
          choiceField("shape_color", "Shape color", {
            choices: themeColorChoices,
            default: "petrol",
          }),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "shape",
          operator: "EQUAL",
        },
      }),

      /* Richtext */
      groupField("richtext", "Richtext", {
        inline_help_text:
          "A richtext block allows you to add custom-formatted text content. This is a powerful way to present information in a flexible format, but it could be less structured than other options. NOTE: This is not a WYSIWYG editor, so you may step outside the boundaries of the design system.",
        children: [
          richTextField("content", "Content", {
            inline_help_text: "Enter the rich text content for this block.",
          }),
        ],
        visibility: {
          controlling_field_path: "columns.type",
          controlling_value_regex: "rtf",
          operator: "EQUAL",
        },
      }),
      columnSettingsGroup,
      animationSettingsGroup,
      decorationSettingsGroup,
      revealSettingsGroup,
    ],
    occurrence: {
      sorting_label_field: "columns.type",
    },
  }),
  moduleSettingsGroup,
  tabGroupSettingsGroup,
  decorationSettingsGroup,
];

export default generateFields;
