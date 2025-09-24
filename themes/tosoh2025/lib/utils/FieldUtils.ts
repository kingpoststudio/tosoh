import {
  booleanField,
  choiceField,
  groupField,
  hubDbTableField,
  numberField,
  textField,
  urlField,
} from 'hs-fieldkit';

export const breadCrumbField = groupField('breadcrumbs', 'Breadcrumbs', {
  children: [
    textField('title', 'Title', {
      required: true,
    }),
    urlField('url', 'URL', {
      required: true,
    }),
  ],
  occurrence: {
    min: 0,
    max: null,
  },
});

export const topicFilters = groupField('topic_filters', 'Topic Filters', {
  children: [
    hubDbTableField('hubdb_table_id', 'Table', { required: true }),
    groupField('filters', 'Filters', {
      children: [
        textField('filter_label', 'Filter Label'),
        textField('hubdb_column_id', 'HubDB Column ID'),
        choiceField('type', 'Type', {
          id: 'filters.type',
          choices: [
            ['dropdown', 'Dropdown'],
            ['checkbox', 'Checkbox'],
            ['range-pm', 'Range (plus/minus)'],
          ],
        }),
        numberField('min', 'Minimum', {
          step: 0.01,
          display: 'text',
          type: 'number',
          inline_help_text: 'Determines the minimum value for the range inputs.',
          visibility: {
            controlling_field: 'filters.type',
            controlling_value_regex: 'range-pm',
            operator: 'EQUAL',
          },
          default: 0,
        }),
        numberField('max', 'Maximum', {
          step: 0.01,
          display: 'text',
          type: 'number',
          inline_help_text: 'Determines the maximum value for the range inputs.',
          visibility: {
            controlling_field: 'filters.type',
            controlling_value_regex: 'range-pm',
            operator: 'EQUAL',
          },
          default: 0,
        }),
        numberField('tolerance', '+/- Tolerance', {
          step: 0.01,
          display: 'text',
          type: 'number',
          inline_help_text:
            "Determines the +/- tolerance. If the tolerance is zero (0), the search will yield results that contain the user's input within an RT min/max range <em>(i.e; RT range is 2.66 and 2.74, if user enters 2.71, it will be displayed)</em>.",
          visibility: {
            controlling_field: 'filters.type',
            controlling_value_regex: 'range-pm',
            operator: 'EQUAL',
          },
          default: 1,
        }),
      ],
      occurrence: {
        min: 0,
        max: null,
      },
    }),
  ],
});

export const searchField = (extraFields: any) => {
  return groupField('search', 'Search', {
    children: [
      ...extraFields,
      textField('title', 'Title'),
      textField('hubdb_column_id', 'HubDB Column ID', {
        inline_help_text: 'Defines the hubDB column id that will be used to search against.',
        default: 'search_term',
        required: true,
      }),
      booleanField('typeahead_enabled', 'Is typeahead enabled?', {
        default: false,
      }),
      hubDbTableField('hubdb_table_id', 'HubDB Table', {
        required: true,
        visibility: {
          controlling_field: 'search.typeahead_enabled',
          controlling_value_regex: true,
          operator: 'EQUAL',
        },
      }),
    ],
  });
};

export const sizeChoices = [
  ['auto', 'Auto'],
  ['0', 'None'],
  ['2xs', '2X-small'],
  ['xs', 'Extra-small'],
  ['sm', 'Small'],
  ['base', 'Base'],
  ['md', 'Medium'],
  ['lg', 'Large'],
  ['xl', 'Extra-large'],
  ['2xl', '2X-large'],
  ['3xl', '3X-large'],
  ['4xl', '4X-large'],
  ['5xl', '5X-large'],
];

export const widthChoices = [
  ...sizeChoices,
  ['6xl', '6X-large'],
  ['7xl', '7X-large'],
  ['8xl', '8X-large'],
  ['max-page', 'Max Page'],
];

export const constructFieldValues = (tailwindIdentifier: string, choices: string[][]) => {
  let choicesWithPrefixes: any = [];

  choices.map((value) => {
    choicesWithPrefixes.push([`${tailwindIdentifier}-${value[0]}`, `${value[1]}`]);
  });

  return choicesWithPrefixes;
};

export const constructClasses = (tailwindIdentifier: string, choices: string[][]) => {
  let twClasses: any = [];

  choices.map((value) => {
    twClasses.push(`${tailwindIdentifier}-${value[0]}`);
  });

  return twClasses;
};

export const paddingFields = [
  choiceField('pt_mobile', 'Top padding (mobile)', {
    choices: constructFieldValues('pt', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pt_desktop', 'Top padding (desktop)', {
    choices: constructFieldValues('md:pt', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pr_mobile', 'Right padding (mobile)', {
    choices: constructFieldValues('pr', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pr_desktop', 'Right padding (desktop)', {
    choices: constructFieldValues('md:pr', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pb_mobile', 'Bottom padding (mobile)', {
    choices: constructFieldValues('pb', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pb_desktop', 'Bottom padding (desktop)', {
    choices: constructFieldValues('md:pb', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pl_mobile', 'Left padding (mobile)', {
    choices: constructFieldValues('pl', sizeChoices),
    display_width: 'half_width',
  }),
  choiceField('pl_desktop', 'Left padding (desktop)', {
    choices: constructFieldValues('md:pl', sizeChoices),
    display_width: 'half_width',
  }),
];

export const justifyChoices = [
  ['start', 'Start'],
  ['center', 'Center'],
  ['end', 'End'],
  ['between', 'Between'],
  ['around', 'Around'],
  ['evenly', 'Evenly'],
];

export const alignmentChoices = [
  ['start', 'Start'],
  ['center', 'Center'],
  ['end', 'End'],
];

export const textAlignmentChoices = [
  ['left', 'Left'],
  ['center', 'Center'],
  ['right', 'Right'],
];

export const presetPaddingFields = [
  choiceField('pt_mobile', 'Top padding (mobile)', {
    choices: constructFieldValues('pt', sizeChoices),
    default: 'pt-md',
    display_width: 'half_width',
  }),
  choiceField('pt_desktop', 'Top padding (desktop)', {
    choices: constructFieldValues('md:pt', sizeChoices),
    default: 'md:pt-md',
    display_width: 'half_width',
  }),
  choiceField('pr_mobile', 'Right padding (mobile)', {
    choices: constructFieldValues('pr', sizeChoices),
    default: 'pr-md',
    display_width: 'half_width',
  }),
  choiceField('pr_desktop', 'Right padding (desktop)', {
    choices: constructFieldValues('md:pr', sizeChoices),
    default: 'md:pr-2xl',
    display_width: 'half_width',
  }),
  choiceField('pb_mobile', 'Bottom padding (mobile)', {
    choices: constructFieldValues('pb', sizeChoices),
    default: 'pb-md',
    display_width: 'half_width',
  }),
  choiceField('pb_desktop', 'Bottom padding (desktop)', {
    choices: constructFieldValues('md:pb', sizeChoices),
    default: 'md:pb-md',
    display_width: 'half_width',
  }),
  choiceField('pl_mobile', 'Left padding (mobile)', {
    choices: constructFieldValues('pl', sizeChoices),
    default: 'pl-md',
    display_width: 'half_width',
  }),
  choiceField('pl_desktop', 'Left padding (desktop)', {
    choices: constructFieldValues('md:pl', sizeChoices),
    default: 'md:pl-2xl',
    display_width: 'half_width',
  }),
];

export const contentBlockRtfFeatures = [
  'indents',
  'charmap',
  'advanced_emphasis',
  'standard_emphasis',
  'anchor',
  'colors',
  'block',
  'link',
  'cta',
  'embed',
  'video',
  'hr',
  'table',
  'personalize',
  'emoji',
  'image',
  'lists',
  'alignment',
  'lineheight',
  'subscript',
  'superscript',
];

export const linkVariantChoices = [
  ['button', 'Button (standard)'],
  ['button outlined', 'Button (outlined)'],
];

export const themeColorChoices = [
  ['default', 'Black Charcoal'],
  ['imperial-red', 'Imperial Red'],
  ['nickel', 'Nickel'],
  ['ghost-white', 'Ghost White'],
  ['prussian-blue', 'Prussian Blue'],
  ['transparent', 'Transparent'],
];

export const offsetFields = [
  numberField('offset_x_mobile', 'X-axis offset (mobile)', {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: 'rem',
    inline_help_text: 'Positive values move it to the right, negative values to the left.',
  }),
  numberField('offset_x_desktop', 'X-axis offset (desktop)', {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: 'rem',
    inline_help_text: 'Positive values move it to the right, negative values to the left.',
  }),
  numberField('offset_y_mobile', 'Y-axis offset (mobile)', {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: 'rem',
    inline_help_text: 'Positive values move it down, negative values up.',
  }),
  numberField('offset_y_desktop', 'Y-axis offset (desktop)', {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: 'rem',
    inline_help_text: 'Positive values move it down, negative values up.',
  }),
];

//Animations
export const animationTravelChoices = [
  ['-2rem', 'Left/Down (large)'],
  ['-1rem', 'Left/Down (small)'],
  ['0', 'No travel'],
  ['1rem', 'Right/Up (small)'],
  ['2rem', 'Right/Up (large)'],
];

export const animationSettingsGroup = groupField('animation_settings', 'Animation settings', {
  children: [
    booleanField('is_animated', 'Enable animations?', {
      inline_help_text:
        'Enables animations when the module and/or its elements are visible within the viewport.',
    }),
    numberField('delay', 'Animation delay (ms)', {
      default: 500,
      min: 0,
      max: 5000,
      step: 50,
    }),
    numberField('duration', 'Animation duration (ms)', {
      default: 500,
      min: 0,
      max: 5000,
      step: 50,
    }),
    choiceField('x_travel', 'X-axis travel distance', {
      choices: animationTravelChoices,
      default: '0',
    }),
    choiceField('y_travel', 'Y-axis travel distance', {
      choices: animationTravelChoices,
      default: '0',
    }),
  ],
});

export const revealSettingsGroup = groupField('reveal_settings', 'Reveal Settings', {
  children: [
    booleanField('is_concealed', 'Enable reveal functionality?', {
      default: false,
      inline_help_text:
        'When enabled, the column content will be collapsed and can be expanded by the user.',
    }),
    numberField('max_height', 'Maximum height (rem)', {
      default: 32,
      min: 8,
      max: 64,
      step: 1,
      suffix: 'rem',
      inline_help_text: 'The maximum height in rem units before the content is concealed.',
    }),
    textField('reveal_label', 'Reveal label', { default: 'Show more' }),
  ],
});
