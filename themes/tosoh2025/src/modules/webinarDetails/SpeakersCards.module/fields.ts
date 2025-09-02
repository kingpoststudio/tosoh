import { groupField, imageField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('title', 'Title'),
    groupField('speakers', 'Speakers', {
      children: [
        imageField('img', 'Image'),
        textField('speaker_name', 'Name'),
        textField('workplace', 'Workplace'),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),
  ];
};

export default generateFields;
