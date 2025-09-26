import { choiceField, formField, groupField, imageField, richTextField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    richTextField('eyebrow', 'Eyebrow'),
    richTextField('title', 'Title'),
    richTextField('description', 'Description'),
    formField('form', 'Form'),

    groupField('icons_section', 'Icons Section', {
      children: [
        imageField('icon', 'Icon'),
        richTextField('title', 'Title'),
        richTextField('value', 'Value'),
      ],
      occurrence: {
        min: 0,
        max: 4,
      },
    }),
  ];
};

export default generateFields;
