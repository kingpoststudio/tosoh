import { textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),

    textField('cta_label', 'CTA Label', {
      default: 'Read More',
    }),
  ];
};

export default generateFields;
