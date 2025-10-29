import {
  choiceField,
  imageField,
  groupField,
  linkField,
  menuField,
  textField,
  booleanField,
} from 'hs-fieldkit';

const generateFields = () => {
  return [
    groupField('header_configurations', 'Header Configurations', {
      children: [
        textField('configuration_name', 'Variation name'),
        imageField('logo', 'Logo'),
        menuField('menu', 'Navigation menu'),
        linkField('logo_link', 'Logo link'),

        groupField('ctas', 'CTAs', {
          children: [
            textField('linkLabel', 'Link label'),
            linkField('link', 'Link'),
            choiceField('variant', 'Variant', {
              choices: [
                ['button', 'Button'],
                ['button outlined', 'Button (outlined)'],
              ],
            }),
          ],
          occurrence: {
            min: null,
            max: 2,
          },
        }),
        groupField('aux', 'Auxiliary links', {
          children: [textField('linkLabel', 'Link label'), linkField('link', 'Link')],
          occurrence: {
            min: null,
            max: 2,
          },
        }),
        groupField('portal_access', 'Portal access', {
          children: [
            booleanField('is_enabled', 'Enable portal access?', {
              default: false,
            }),
            textField('login_label', 'Login label', {
              default: 'Login',
            }),
            linkField('login_redirect_url', 'Login redirect URL'),
            textField('logout_label', 'Logout label', {
              default: 'Logout',
            }),
          ],
        }),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),
  ];
};

export default generateFields;
