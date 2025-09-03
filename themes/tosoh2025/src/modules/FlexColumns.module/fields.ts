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
  urlField,
  videoField,
} from 'hs-fieldkit';
import {
  alignmentChoices,
  animationSettingsGroup,
  constructFieldValues,
  contentBlockRtfFeatures,
  linkVariantChoices,
  offsetFields,
  paddingFields,
  presetPaddingFields,
  revealSettingsGroup,
  sizeChoices,
  textAlignmentChoices,
  themeColorChoices,
} from '../../../lib/utils/fieldUtils';

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
    choices: [
      ['justify-start', 'Start'],
      ['justify-center', 'Center'],
      ['justify-end', 'End'],
      ['justify-between', 'Between'],
      ['justify-around', 'Around'],
      ['justify-evenly', 'Evenly'],
    ],
    default: 'justify-center',
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
  children: generateContainerSettings(true, 'module_settings'),
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

    choiceField('column_size', 'Column size', {
      choices: constructFieldValues('w', sizeChoices),
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
    ...offsetFields,
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
            ['media', 'Media'],
            ['form', 'Form'],
            ['spacer', 'Spacer'],
            ['rtf', 'Richtext'],
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

        /* Media */
        groupField('media', 'Media', {
          inline_help_text:
            'A media block that allows you to add a shaped image or video with a caption.',
          children: [
            choiceField('type', 'Media type', {
              choices: [
                ['image', 'Image'],
                ['stacked_images', 'Stacked Images'],
                ['hs_video', 'Video (HubSpot)'],
                ['video', 'Video (External)'],
              ],
              default: 'image',
              inline_help_text:
                'Choose whether to display an image, a HiArc pattern, a HubSpot video hosted locally, or an external video URL.',
            }),
            imageField('image', 'Image', {
              visibility: {
                controlling_field_path: 'columns.media.type',
                controlling_value_regex: 'image',
                operator: 'EQUAL',
              },
              inline_help_text: 'Upload or select an image to display.',
            }),

            booleanField('is_image_contained', 'Is image contained?', {
              inline_help_text:
                'If enabled, the image will be contained within the column, otherwise it will fill the column width.',
              visibility: {
                controlling_field_path: 'columns.media.type',
                controlling_value_regex: 'image',
                operator: 'EQUAL',
              },
            }),
            groupField('stacked_images', 'Stacked Images', {
              children: [imageField('image', 'Image')],
              visibility: {
                controlling_field_path: 'columns.media.type',
                controlling_value_regex: 'stacked_images',
                operator: 'EQUAL',
              },
              occurrence: {
                default: 2,
                min: 2,
                max: 2,
              },
              inline_help_text: 'Upload or select an 2 images to display.',
            }),
            videoField('hs_video', 'Video (HubSpot)', {
              visibility: {
                controlling_field_path: 'columns.media.type',
                controlling_value_regex: 'hs_video',
                operator: 'EQUAL',
              },
            }),
            textField('video', 'Video (External)', {
              visibility: {
                controlling_field_path: 'columns.media.type',
                controlling_value_regex: 'video',
                operator: 'EQUAL',
              },
              inline_help_text: 'Enter the URL of the external video to display.',
            }),
          ],
          visibility: {
            controlling_field_path: 'columns.type',
            controlling_value_regex: 'media',
            operator: 'EQUAL',
          },
        }),

        /* Form */
        groupField('form', 'Form', {
          inline_help_text:
            'A form block that allows you to add a form with a title and description.',
          children: [
            urlField('meeting_url', 'Meeting Url', {
              inline_help_text:
                'Meeting link to which the user will be redirected after form submission.',
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
        revealSettingsGroup,
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
