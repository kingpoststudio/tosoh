import {
  groupField,
  imageField,
  linkField,
  menuField,
  richTextField,
  textField,
} from 'hs-fieldkit';
import { themeConfigurationChoices } from '../../../../lib/utils/fieldUtils';

export const legalFields = groupField('legal', 'Legal links', {
  children: [textField('link_label', 'Link label'), linkField('link', 'Link')],
  occurrence: {
    min: null,
    max: 3,
  },
});

const footerFields = [
  imageField('logo', 'Logo'),
  richTextField('info', 'Information block', {
    default:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.,',
  }),
  menuField('menu', 'Footer menu'),
  textField('copyright', 'Copyright', {
    inline_help_text: 'Text to display in the copyright notice',
    default: '© {{ year }} Tosoh Diagnostics. All rights reserved.',
  }),
  legalFields,
  linkField('linkedin', 'LinkedIn'),
];

const generateFooterFields = () => {
  const footerConfigurations: any[] = [];

  themeConfigurationChoices.forEach((choice) => {
    footerConfigurations.push(
      groupField(choice[0], choice[1], {
        children: footerFields,
      })
    );
  });
  return footerConfigurations;
};

const generateFields = () => {
  return generateFooterFields();
};

export default generateFields;
