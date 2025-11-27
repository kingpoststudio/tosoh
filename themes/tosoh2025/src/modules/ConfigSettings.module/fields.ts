import { choiceField, menuField } from 'hs-fieldkit';
import { configurationChoices } from '../../../lib/utils/FieldUtils';

const generateFields = () => {
  return [
    choiceField('selected_header_configuration', 'Selected header configuration', {
      choices: configurationChoices,
    }),
    menuField('menu_override', 'Menu override', {
      inline_help_text: 'Override the main navigation menu with a custom menu.',
    }),
    menuField('auxiliary_menu_override', 'Auxiliary menu override', {
      inline_help_text: 'Override the auxiliary menu in the header with a custom menu.',
    }),
    menuField('footer_menu_override', 'Footer menu override', {
      inline_help_text: 'Override the footer menu with a custom menu.',
    }),
  ];
};

export default generateFields;
