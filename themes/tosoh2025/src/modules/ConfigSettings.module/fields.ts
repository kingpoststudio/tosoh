import { choiceField, menuField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    choiceField('selected_header_configuration', 'Selected header configuration', {
      choices: [
        ['default', 'Default'],
        ['gr01', 'GR01'],
        ['aia_cl300', 'AIA-CL300'],
        ['webinars', 'Webinars'],
        ['support_portal', 'Support Portal'],
        ['italian_microsite', 'Italian Microsite'],
        ['internal', 'Internal'],
      ],
    }),
    menuField('menu_override', 'Menu override', {
      inline_help_text: 'Override the main navigation menu with a custom menu.',
    }),
    menuField('auxiliary_menu_override', 'Auxiliary menu override', {
      inline_help_text: 'Override the auxiliary menu with a custom menu.',
    }),
    menuField('footer_menu_override', 'Footer menu override', {
      inline_help_text: 'Override the footer menu with a custom menu.',
    }),
  ];
};

export default generateFields;
