import { groupField, imageField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    imageField('bg', 'Background Image'),
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),
    groupField('speakers', 'Speakers', {
      children: [
        imageField('img', 'Image'),
        textField('speaker_name', 'Name'),
        textField('workplace', 'Workplace'),
      ],
      occurrence: {
        min: null,
        max: 2,
      },
    }),
    groupField('cta', 'CTA', {
      children: [
        textField('cta_label', 'Label'),
        linkField('cta_link', 'Link'),
        textField('below_cta', 'Text Below CTA'),
      ],
    }),
  ];
};

export default generateFields;
