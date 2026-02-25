import { choiceField, groupField, linkField, menuField, textField } from 'hs-fieldkit';
import { themeConfigurationChoices } from '../../../lib/utils/fieldUtils';
import { headerCtasFields, portalAccessLabelsFields } from '../globals/Header.module/fields';
import { legalFields } from '../globals/Footer.module/fields';

const generateFields = () => {
  return [
    choiceField('selected_configuration', 'Selected configuration', {
      inline_help_text:
        'Based on this selection, the appropriate header and footer configurations will be displayed.',
      choices: themeConfigurationChoices,
      required: true,
      default: 'default',
    }),

    groupField('header_overrides', 'Header overrides', {
      inline_help_text: 'Override the header only in this page with a custom configuration.',
      children: [
        menuField('menu', 'Menu', {
          inline_help_text: 'Override the header menu with a custom menu.',
        }),
        linkField('logo_link', 'Logo link', {
          inline_help_text: 'Override the logo link in the header with a custom link.',
        }),
        choiceField('menu_justification', 'Menu justification', {
          inline_help_text: 'Override the menu justification in the header with a custom value.',
          choices: [
            ['center', 'Center'],
            ['end', 'Right'],
          ],
        }),
        groupField('ctas', 'CTAs', {
          inline_help_text: 'Override the CTAs in the header with a custom configuration.',
          children: headerCtasFields,
          occurrence: {
            min: null,
            max: 2,
          },
        }),
        ...portalAccessLabelsFields(false),
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
