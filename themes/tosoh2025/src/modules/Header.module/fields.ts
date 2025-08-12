import { choiceField, imageField, groupField, linkField, menuField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    imageField('logo', 'Logo'),
    menuField('menu', 'Navigation menu'),
    groupField('ctas', 'CTAs', {
      children: [
        textField('linkLabel', 'Link label'),
        linkField('link', 'Link'),
        choiceField('variant', 'Variant', {
          choices: [
            ['button', 'Button'],
            ['button outlined', 'Button (outlined)'],
          ],
        }),
      ],
    }),
    groupField('aux', 'Auxiliary links', {
      children: [
        textField('linkLabel', 'Link label'),
        linkField('link', 'Link'),
      ],
    }),
  ];
};

export default generateFields;
