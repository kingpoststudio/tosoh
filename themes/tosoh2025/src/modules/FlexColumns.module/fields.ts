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
} from 'hs-fieldkit';
import {
  alignmentChoices,
  animationSettingsGroup,
  constructFieldValues,
  contentBlockRtfFeatures,
  justifyChoices,
  linkVariantChoices,
  paddingFields,
  presetPaddingFields,
  sizeChoices,
  textAlignmentChoices,
  themeColorChoices,
  widthChoices,
} from '../../../lib/utils/fieldUtils';

const generateFormDialogFields = () => [
  booleanField('is_dialog_form', 'Contain form within a dialog?', {
    inline_help_text:
      "If checked, the form will be contained within a dialog. The dialog can be opened with a button that appears just below the form's title.",
  }),
  textField('form_dialog_title', 'Form Dialog Title', {
    default: 'Form Dialog Title',
    visibility: {
      controlling_field: 'columns.form.is_dialog_form',
      controlling_value_regex: true,
      operator: 'EQUAL',
    },
  }),

  textField('form_dialog_button_label', 'Form dialog button label', {
    default: 'Click to open dialog',
    visibility: {
      controlling_field: 'columns.form.is_dialog_form',
      controlling_value_regex: true,
      operator: 'EQUAL',
    },
  }),
];

const generateVideoFields = () => [
  groupField('video', 'Video', {
    children: [
      choiceField('video_host', 'Video Host', {
        choices: [
          ['hubspot', 'HubSpot'],
          ['wistia', 'Wistia'],
        ],
        default: 'hubspot',
        visibility: {
          controlling_field: 'columns.type',
          controlling_value_regex: 'video',
          operator: 'EQUAL',
        },
      }),

      videoField('video', 'Video', {
        show_advanced_options: false,
        visibility_rules: 'ADVANCED',
        advanced_visibility: {
          boolean_operator: 'AND',
          criteria: [
            {
              controlling_field: 'columns.type',
              controlling_value_regex: 'video',
              operator: 'EQUAL',
            },
            {
              controlling_field: 'columns.video.video_host',
              controlling_value_regex: 'hubspot',
              operator: 'EQUAL',
            },
          ],
        },
      }),
      textField('wistia_cached_url', 'Wistia cached URL', {
        visibility_rules: 'ADVANCED',
        advanced_visibility: {
          boolean_operator: 'AND',
          criteria: [
            {
              controlling_field: 'columns.type',
              controlling_value_regex: 'video',
              operator: 'EQUAL',
            },
            {
              controlling_field: 'columns.video.video_host',
              controlling_value_regex: 'wistia',
              operator: 'EQUAL',
            },
          ],
        },
      }),
    ],
  }),
];

const generateContainerSettings = (presetPadding = false, visibilityPath = '') => [
  choiceField('bg_color', 'Background color', {
    choices: constructFieldValues('bg', themeColorChoices),
    inline_help_text: 'Sets the background color for the entire module.',
  }),
  choiceField('text_color', 'Text color', {
    choices: constructFieldValues('text', themeColorChoices),
    default: 'text-default',
    inline_help_text: 'Sets the text color for the entire module.',
  }),
  choiceField('gap', 'Gap between columns', {
    choices: constructFieldValues('gap', sizeChoices),
    default: 'gap-md',
    inline_help_text: 'Controls the spacing between columns.',
  }),
  choiceField('justify', 'Justification (horizontal)', {
    choices: constructFieldValues('justify', justifyChoices),
    inline_help_text: 'Controls the x-axis justification of all content within the module or tab.',
    visibility: {
      controlling_field_path: `${visibilityPath}.overflow_scroll_x`,
      controlling_value_regex: 'false',
      operator: 'EQUAL',
    },
  }),
  booleanField('overflow_scroll_x', 'Enable horizontal scrolling?', {
    default: false,
    inline_help_text:
      'When enabled, columns will scroll horizontally on mobile devices instead of stacking vertically.',
  }),
  booleanField('is_reversed_mobile', 'Reverse columns on mobile?', {
    inline_help_text: 'Reverses the order of columns on mobile devices.',
    visibility: {
      controlling_field_path: `${visibilityPath}.overflow_scroll_x`,
      controlling_value_regex: 'false',
      operator: 'EQUAL',
    },
  }),
  ...(presetPadding ? presetPaddingFields : paddingFields),
];

const tabGroupSettingsGroup = groupField('tab_group_settings', 'Tab Group Settings', {
  children: [
    booleanField('is_enabled', 'Enable tab groups?', {
      default: false,
      inline_help_text:
        'If enabled, the columns will be grouped into tabs. This is useful for when you want to organize content into different sections.',
    }),
    groupField('tab_groups', 'Tab groups', {
      occurrence: {},
      children: [
        textField('group_id', 'Group ID', {
          inline_help_text:
            'Provide a unique ID for the tab group. This will be used to determine which columns will be placed within the tab groups.',
        }),
        textField('group_label', 'Group label'),
        groupField('tab_settings', 'Tab Settings', {
          children: generateContainerSettings(false, 'tab_group_settings.tab_groups.tab_settings'),
        }),
      ],
      visibility: {
        controlling_field_path: 'tab_group_settings.is_enabled',
        controlling_value_regex: 'true',
        operator: 'EQUAL',
      },
    }),
  ],
});

const moduleSettingsGroup = groupField('module_settings', 'Module Settings', {
  children: [
    booleanField('has_grid_accent', 'Has grid accent?', {
      inline_help_text:
        'If enabled, a grid accent will appear in the background, like the one shown in the footer.',
    }),

    choiceField('grid_accent_color', 'Grid accent color', {
      choices: [
        ['dark', 'Dark'],
        ['light', 'Light'],
      ],
      inline_help_text: 'Sets the color of the grid accent.',
    }),

    booleanField('carousel_is_enabled', 'Enable carousel?', {
      inline_help_text: 'If enabled, the columns will be displayed in a carousel.',
    }),

    textField('custom_id', 'Module Id', {
      inline_help_text:
        'Optionally provide a unique ID for this module. This can be used for anchor link navigation (e.g., scrolling to this section when a link is clicked elsewhere on the page).',
    }),
    ...generateContainerSettings(true, 'module_settings'),
  ],
});

/* Column Settings */
const columnSettingsGroup = groupField('column_settings', 'Column Settings', {
  children: [
    numberField('flex_factor', 'Flex factor', {
      default: 0,
      min: 0,
      max: 8,
      step: 1,
      inline_help_text:
        'Determines the relative width of the column compared to others. Think of it like dividing a pie - if one column has flex factor 2 and another has flex factor 1, the first column will be twice as wide as the second. <strong>If flex factor is set to 0, you will be able to set a fixed width for the column.</strong>',
    }),
    booleanField('is_rounded', 'Is rounded?', {
      default: false,
      inline_help_text: 'If enabled, the column will have rounded corners.',
    }),
    booleanField('match_tallest_column', 'Match tallest column?', {
      default: false,
      inline_help_text:
        'If enabled, the column will be the same height as the tallest column. By doing that you will lose the ability to align the column content vertically.',
    }),
    choiceField('column_size', 'Column size', {
      choices: constructFieldValues('w', widthChoices),
      visibility: {
        controlling_field_path: 'columns.column_settings.flex_factor',
        controlling_value_regex: 0,
        operator: 'EQUAL',
      },
    }),
    choiceField('align', 'Alignment (vertical)', {
      choices: constructFieldValues('self', alignmentChoices),
      default: 'self-center',
      inline_help_text: 'Controls the y-axis alignment of content within the column.',
    }),
    choiceField('justify', 'Justification (horizontal)', {
      choices: constructFieldValues('justify-self', alignmentChoices),
      default: 'justify-self-start',
      inline_help_text: 'Controls the x-axis justification of content within the column.',
    }),
    choiceField('bg_color', 'Background color', {
      choices: constructFieldValues('bg', themeColorChoices),
      inline_help_text: 'Sets the background color for this column.',
    }),
    choiceField('text_color', 'Text color', {
      choices: constructFieldValues('text', themeColorChoices),
      inline_help_text: 'Sets the text color for this column.',
    }),
    choiceField('border_color', 'Border color', {
      choices: constructFieldValues('border', themeColorChoices),
      default: 'border-transparent',
      inline_help_text: 'Sets the border color for this column.',
    }),

    ...paddingFields,
  ],
});

const generateFields = () => {
  return [
    groupField('columns', 'Columns', {
      children: [
        /* Tab Group ID: required if tab groups are enabled. */
        textField('tab_group_id', 'Tab group ID', {
          inline_help_text:
            'This field value must match the "Group ID" value in the "Tabs" section. This will determine where the column will be placed within the tab groups; if the value doesn\'t match any group ID, the column content will not appear.',
          visibility: {
            controlling_field_path: 'tab_group_settings.is_enabled',
            controlling_value_regex: 'true',
            operator: 'EQUAL',
          },
        }),
        choiceField('type', 'Column type', {
          choices: [
            ['content', 'Content'],
            ['image', 'Image'],
            ['accordions', 'Accordions'],
            ['video', 'Video'],
            ['form', 'Form'],
            ['spacer', 'Spacer'],
            ['rtf', 'Richtext'],
            ['navigation_list', 'Navigation List'],
          ],
          inline_help_text: 'Select the type of content to display in this column.',
        }),

        /* Content */
        groupField('content', 'Content', {
          inline_help_text:
            'A content block provides a pre-structured layout for displaying text, images, links and more.',
          children: [
            choiceField('text_align', 'Text Alignment', {
              choices: constructFieldValues('text', textAlignmentChoices),
              default: 'text-left',
              inline_help_text: 'Controls the alignment of content within this column.',
            }),
            choiceField('horizontal_align', 'Horizontal Alignment', {
              choices: constructFieldValues('items', alignmentChoices),
              default: 'items-start',
              inline_help_text:
                'Controls the horizontal alignment of content within this content block.',
            }),
            richTextField('eyebrow', 'Eyebrow', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text:
                'Optional short text above the title, often used for labeling or categorization.',
            }),
            richTextField('title', 'Title', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Main heading for this content block.',
            }),
            richTextField('description', 'Description', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Descriptive text providing more details about this content block.',
            }),
            booleanField('is_cta', 'Is link a CTA?', {
              inline_help_text: 'Enable if the link should be styled as a call-to-action button.',
            }),
            ctaField('cta', 'CTA', {
              visibility: {
                controlling_field_path: 'columns.content.is_cta',
                controlling_value_regex: 'true',
                operator: 'EQUAL',
              },
              inline_help_text: 'Configure the call-to-action button for this content block.',
            }),
            linkField('link', 'Link', {
              visibility: {
                controlling_field_path: 'columns.content.is_cta',
                controlling_value_regex: 'false',
                operator: 'EQUAL',
              },
              inline_help_text: 'Add a standard link for this content block.',
            }),
            textField('link_label', 'Link label', {
              default: 'Learn More',
              visibility: {
                controlling_field_path: 'columns.content.is_cta',
                controlling_value_regex: 'false',
                operator: 'EQUAL',
              },
              inline_help_text: 'Text to display for the link.',
            }),
            choiceField('link_variant', 'Link variant', {
              choices: linkVariantChoices,
              default: 'button',
              visibility: {
                controlling_field_path: 'columns.content.is_cta',
                controlling_value_regex: 'false',
                operator: 'EQUAL',
              },
              inline_help_text:
                'Choose the style of the link. You can select between a button or a text link.',
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'content',
            operator: 'EQUAL',
          },
        }),

        /* Image */
        groupField('image', 'Image', {
          inline_help_text: 'Allows you to add an image.',
          children: [
            choiceField('type', 'Image Type', {
              choices: [['single', 'Single']],
              default: 'single',
            }),
            imageField('image', 'Image', {
              visibility: {
                controlling_field_path: 'columns.image.type',
                controlling_value_regex: 'single',
                operator: 'EQUAL',
              },
              inline_help_text: 'Upload or select an image to display.',
            }),

            booleanField('is_image_contained', 'Is image contained?', {
              inline_help_text:
                'If enabled, the image will be contained within the column, otherwise it will fill the column width.',
              visibility: {
                controlling_field_path: 'columns.type',
                controlling_value_regex: 'image',
                operator: 'EQUAL',
              },
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'image',
            operator: 'EQUAL',
          },
        }),

        /* Video Fields */
        ...generateVideoFields(),

        /* Accordion */
        groupField('accordions', 'Accordions', {
          children: [
            richTextField('button_content', 'Button Content', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Content to display in the button of the accordion.',
            }),
            richTextField('reveal_content', 'Reveal Content', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Content to display in the reveal of the accordion.',
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'accordions',
            operator: 'EQUAL',
          },
          occurrence: {},
        }),

        /* Form */
        groupField('form', 'Form', {
          inline_help_text:
            'A form block that allows you to add a form with a title and description.',
          children: [
            ...generateFormDialogFields(),
            choiceField('theme', 'Theme', {
              choices: [
                ['', 'Default'],
                ['light', 'Light'],
              ],
              inline_help_text: 'Select the theme for the form.',
            }),
            richTextField('eyebrow', 'Eyebrow', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Optional short text above the form title.',
            }),
            richTextField('title', 'Title', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Main heading for the form.',
            }),
            richTextField('description', 'Description', {
              enabled_features: contentBlockRtfFeatures,
              inline_help_text: 'Descriptive text providing more details about the form.',
            }),
            formField('form', 'Form', {
              inline_help_text: 'Select or configure the form to display in this column.',
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'form',
            operator: 'EQUAL',
          },
        }),

        /* Navigation List */
        groupField('navigation_list', 'Navigation List', {
          inline_help_text:
            'A navigation list block allows you to add a list of links to display in this column.',
          children: [textField('title', 'Title'), linkField('link', 'Link')],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'navigation_list',
            operator: 'EQUAL',
          },
          occurrence: {
            min: 0,
            max: null,
          },
        }),

        /* Richtext */
        groupField('richtext', 'Richtext', {
          inline_help_text:
            'A richtext block allows you to add custom-formatted text content. This is a powerful way to present information in a flexible format, but it could be less structured than other options. NOTE: This is not a WYSIWYG editor, so you may step outside the boundaries of the design system.',
          children: [
            richTextField('content', 'Content', {
              inline_help_text: 'Enter the rich text content for this block.',
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'rtf',
            operator: 'EQUAL',
          },
        }),
        columnSettingsGroup,
        animationSettingsGroup,
      ],
      occurrence: {
        sorting_label_field: 'columns.type',
      },
    }),

    moduleSettingsGroup,
    tabGroupSettingsGroup,
  ];
};

export default generateFields;
