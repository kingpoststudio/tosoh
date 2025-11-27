import {
  choiceField,
  imageField,
  groupField,
  linkField,
  menuField,
  textField,
  booleanField,
} from 'hs-fieldkit';
import { configurationChoices } from '../../../../lib/utils/FieldUtils';

const headerFields = [
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
          ['link', 'Link'],
        ],
      }),
    ],
    occurrence: {
      min: null,
      max: 2,
    },
  }),
  menuField('auxiliary_menu', 'Auxiliary Menu'),
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
];

const generateHeaderFields = () => {
  const headerConfigurations: any[] = [];

  configurationChoices.forEach((choice) => {
    headerConfigurations.push(
      groupField(choice[0], choice[1], {
        children: headerFields,
      })
    );
  });

  return headerConfigurations;
};

const generateFields = () => {
  return generateHeaderFields();
};

export default generateFields;
