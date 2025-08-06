import { choiceField, groupField, numberField, textField } from "hs-fieldkit";
import { moduleSettingsGroup, themeShadeChoices } from "../../../utils/fieldUtils";

const generateFields = () => [
  textField('title', 'Module title'),

  choiceField('variant', 'Chart variant', {
    id: 'variant',
    choices: [
      ['pie', 'Pie chart'],
      ['rose', 'Rose chart'],
      ['bar', 'Bar chart'],
    ],
  }),

  /* Pie chart(s): allow for multiple. */
  groupField('pie_charts', 'Pie charts', {
    children: [
      numberField('value', 'Value', {
        min: 0,
        max: 100,
        step: 0.1,
      }),
      choiceField('color', 'Color', {
        choices: themeShadeChoices,
      }),
      textField('prefix', 'Value prefix'),
      textField('suffix', 'Value suffix'),
      textField('chart_label', 'Label'),
      textField('description', 'Description/caption'),
    ],
    occurrence: {
      min: 0,
      max: 4,
    },
    visibility: {
      controlling_field: 'variant',
      controlling_value_regex: 'pie',
    },
  }),

  /* Bar chart(s): allow for multiple. */
  groupField('bar_charts', 'Bar charts', {
    children: [
      numberField('value', 'Value', {
        min: 0,
        step: 0.1,
      }),
      choiceField('color', 'Color', {
        choices: themeShadeChoices,
      }),
      choiceField('theme', 'Theme', {
        choices: [
          ['light', 'Light'],
          ['dark', 'Dark'],
        ],
        default: 'light',
      }),
      textField('chart_label', 'Label'),
      textField('description', 'Description/caption'),
    ],
    occurrence: {
      min: 0,
      max: 4,
    },
    visibility: {
      controlling_field: 'variant',
      controlling_value_regex: 'pie',
    },
  }),

  /* Rose chart: provides a legend/value table. */
  groupField('rose_chart', 'Rose chart', {
    children: [
      groupField('slices', 'Slices', {
        children: [
          numberField('value', 'Value', {
            min: 0,
            step: 0.1,
          }),
          textField('slice_label', 'Label'),
        ],
        occurrence: {},
      }),
      choiceField('color', 'Color', {
        choices: themeShadeChoices,
      }),
    ],
    visibility: {
      controlling_field: 'variant',
      controlling_value_regex: 'rose',
    },
  }),

  moduleSettingsGroup,
]

export default generateFields;
