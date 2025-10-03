import { choiceField, groupField, imageField, textField, urlField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    groupField('lab_buttons', 'Lab Buttons', {
      children: [
        textField('button_label', 'Label'),
        urlField('link', 'Link'),
        imageField('image', 'Image', {
          required: true,
        }),
        choiceField('size', 'Size', {
          choices: [
            ['small', 'Small'],
            ['medium', 'Medium'],
            ['large', 'Large'],
          ],
          default: 'medium',
          required: true,
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
