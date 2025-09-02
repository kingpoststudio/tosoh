import { choiceField, groupField, textField, urlField } from 'hs-fieldkit';

export const breadCrumbField = () => {
  return [
    groupField('breadcrumbs', 'Breadcrumbs', {
      children: [
        textField('title', 'Title', {
          required: true,
        }),
        urlField('url', 'URL', {
          required: true,
        }),
      ],
      occurrence: {
        min: 1,
        max: null,
      },
    }),
  ];
};

export const sizeChoices = [
  ['auto', 'Auto'],
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
  ['0', 'None'],
];

export const constructFieldValues = (tailwindIdentifier: string) => {
  let sizeChoicesWithPrefixes: any = [];

  sizeChoices.map((value) => {
    sizeChoicesWithPrefixes.push([`${tailwindIdentifier}-${value[0]}`, `${value[1]}`]);
  });

  return sizeChoicesWithPrefixes;
};

export const presetPaddingFields = [
  choiceField('pt_mobile', 'Top padding (mobile)', {
    choices: constructFieldValues('pt'),
    default: 'pt-md',
    display_width: 'half_width',
  }),
  choiceField('pt_desktop', 'Top padding (desktop)', {
    choices: constructFieldValues('md:pt'),
    default: 'md:pt-md',
    display_width: 'half_width',
  }),
  choiceField('pr_mobile', 'Right padding (mobile)', {
    choices: constructFieldValues('pr'),
    default: 'pr-md',
    display_width: 'half_width',
  }),
  choiceField('pr_desktop', 'Right padding (desktop)', {
    choices: constructFieldValues('md:pr'),
    default: 'md:pr-md',
    display_width: 'half_width',
  }),
  choiceField('pb_mobile', 'Bottom padding (mobile)', {
    choices: constructFieldValues('pb'),
    default: 'pb-md',
    display_width: 'half_width',
  }),
  choiceField('pb_desktop', 'Bottom padding (desktop)', {
    choices: constructFieldValues('md:pb'),
    default: 'md:pb-md',
    display_width: 'half_width',
  }),
  choiceField('pl_mobile', 'Left padding (mobile)', {
    choices: constructFieldValues('pl'),
    default: 'pl-md',
    display_width: 'half_width',
  }),
  choiceField('pl_desktop', 'Left padding (desktop)', {
    choices: constructFieldValues('md:pl'),
    default: 'md:pl-md',
    display_width: 'half_width',
  }),
];
