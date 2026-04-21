import { textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('read_more_label', 'Read More Label', {
      default: 'Read More',
    }),
    textField('load_more_label', 'Load More Label', {
      default: 'Load More',
    }),
  ];
};

export default generateFields;
