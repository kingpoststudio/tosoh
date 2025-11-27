import { choiceField, menuField } from 'hs-fieldkit';
import { configurationChoices } from '../../../lib/utils/FieldUtils';

const generateFields = () => {
  return [
    choiceField('selected_configuration', 'Selected configuration', {
      inline_help_text:
        'Based on this selection, the appropriate header and footer configurations will be displayed.',
      choices: configurationChoices,
      required: true,
      default: 'default',
    }),
    menuField('header_menu_override', 'Header menu override', {
      inline_help_text: 'Override the main navigation menu with a custom menu.',
    }),
    menuField('header_auxiliary_menu_override', 'Header auxiliary menu override', {
      inline_help_text: 'Override the auxiliary menu in the header with a custom menu.',
    }),
    menuField('footer_menu_override', 'Footer menu override', {
      inline_help_text: 'Override the footer menu with a custom menu.',
    }),
  ];
};

export default generateFields;
