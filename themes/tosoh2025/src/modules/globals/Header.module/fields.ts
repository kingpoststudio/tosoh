import {
  choiceField,
  imageField,
  groupField,
  linkField,
  menuField,
  textField,
  booleanField,
} from 'hs-fieldkit';
import { themeConfigurationChoices } from '../../../../lib/utils/fieldUtils';

export const headerCtasFields = [
  textField('link_label', 'Link label'),
  linkField('link', 'Link'),
  choiceField('variant', 'Variant', {
    choices: [
      ['button', 'Button'],
      ['button outlined', 'Button (outlined)'],
      ['link', 'Link'],
    ],
  }),
];

export const portalAccessLabelsFields = (haveDefaultValues: boolean) => [
  textField('logout_label', 'Logout label', {
    default: haveDefaultValues ? 'Logout' : undefined,
  }),
  textField('login_label', 'Login label', {
    default: haveDefaultValues ? 'Login' : undefined,
  }),
];

const headerFields = [
  imageField('logo', 'Logo'),
  menuField('menu', 'Navigation menu'),
  linkField('logo_link', 'Logo link'),
  groupField('ctas', 'CTAs', {
    children: headerCtasFields,
    occurrence: {
      min: null,
      max: 2,
    },
  }),
  choiceField('menu_justification', 'Menu justification', {
    choices: [
      ['center', 'Center'],
      ['end', 'Right'],
    ],
    default: 'end',
  }),
  menuField('auxiliary_menu', 'Auxiliary Menu'),
  groupField('portal_access', 'Portal access', {
    children: [
      booleanField('is_enabled', 'Enable portal access?', {
        default: false,
      }),
      linkField('login_redirect_url', 'Login redirect URL'),
      ...portalAccessLabelsFields(true),
      choiceField('button_type', 'Button type', {
        choices: [
          ['button', 'Button'],
          ['link', 'Link'],
        ],
        default: 'button',
      }),
    ],
  }),
];

const generateHeaderFields = () => {
  const headerConfigurations: any[] = [];

  themeConfigurationChoices.forEach((choice) => {
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
