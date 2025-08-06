import { groupField, linkField, menuField, textField } from 'hs-fieldkit';

const generateFields = () => [
  menuField('menu', 'Footer menu'),
  groupField('socials', 'Social Links', {
    children: [
      linkField('linkedin', 'LinkedIn', {
        inline_help_text: 'Link to the LinkedIn profile',
      }),
      linkField('youtube', 'YouTube', {
        inline_help_text: 'Link to the YouTube channel',
      }),
    ],
  }),
  groupField('legal', 'Legal Text/Links', {
    children: [
      textField('copyright', 'Copyright text', {
        inline_help_text: 'Text to display in the copyright notice',
        default: '© {{ year }} Tosoh. All rights reserved.',
      }),
      linkField('privacy', 'Privacy Policy', {
        inline_help_text: 'Link to the privacy policy page',
      }),
      linkField('tos', 'Terms of Service', {
        inline_help_text: 'Link to the terms of service page',
      }),
    ],
  }),
];

export default generateFields;
