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
        linkField('form_id', 'Form Id', {
          inline_help_text:
            'This should match the ID of the Flex Column containing the form. When the button is clicked, the page will scroll down to the form with the matching ID.',
        }),
        textField('below_cta', 'Text Below CTA'),
      ],
    }),
  ];
};

export default generateFields;
