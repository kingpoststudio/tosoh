import { choiceField, groupField, menuField, textField } from 'hs-fieldkit';
import { configurationChoices } from '../../../lib/utils/FieldUtils';
import { headerCtasFields } from '../globals/Header.module/fields';
import { legalFields } from '../globals/Footer.module/fields';

const generateFields = () => {
  return [
    choiceField('selected_configuration', 'Selected configuration', {
      inline_help_text:
        'Based on this selection, the appropriate header and footer configurations will be displayed.',
      choices: configurationChoices,
      required: true,
      default: 'default',
    }),

    groupField('header_overrides', 'Header overrides', {
      inline_help_text: 'Override the header only in this page with a custom configuration.',
      children: [
        menuField('menu', 'Menu', {
          inline_help_text: 'Override the header menu with a custom menu.',
        }),
        choiceField('menu_justification', 'Menu justification', {
          choices: [
            ['center', 'Center'],
            ['end', 'Right'],
          ],
        }),
        groupField('ctas', 'CTAs', {
          children: headerCtasFields,
          occurrence: {
            min: null,
            max: 2,
          },
        }),
        menuField('auxiliary_menu', 'Auxiliary menu', {
          inline_help_text: 'Override the auxiliary menu in the header with a custom menu.',
        }),
      ],
    }),

    groupField('footer_overrides', 'Footer overrides', {
      inline_help_text: 'Override the footer only in this page with a custom configuration.',
      children: [
        menuField('menu', 'Menu', {
          inline_help_text: 'Override the footer menu with a custom menu.',
        }),
        textField('info', 'Info', {
          inline_help_text: 'Override the footer info with a custom text.',
        }),
        textField('copyright', 'Copyright', {
          inline_help_text: 'Override the footer copyright with a custom text.',
        }),
        legalFields,
      ],
    }),
  ];
};

export default generateFields;
