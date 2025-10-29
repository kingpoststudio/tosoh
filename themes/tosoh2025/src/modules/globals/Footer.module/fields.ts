import { groupField, imageField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => [
  groupField('footer_configurations', 'Footer Configurations', {
    children: [
      textField('configuration_name', 'Configuration Name', {
        inline_help_text:
          'The "Selected footer configuration" field on the page level must match this value to display this footer configuration.',
      }),
      imageField('logo', 'Logo'),
      textField('info', 'Information block', {
        default:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.,',
      }),
      textField('copyright', 'Copyright', {
        inline_help_text: 'Text to display in the copyright notice',
        default: '© {{ year }} Tosoh Diagnostics. All rights reserved.',
      }),
      groupField('legal', 'Legal links', {
        children: [textField('linkLabel', 'Link label'), linkField('link', 'Link')],
        occurrence: {
          min: null,
          max: 3,
        },
      }),
      linkField('linkedin', 'LinkedIn'),
    ],
    occurrence: {
      min: null,
      max: null,
    },
  }),
];

export default generateFields;
