import { choiceField, ctaField, groupField, imageField, linkField, menuField, numberField, textField } from 'hs-fieldkit';
import { themeColorChoices, mediaVariantChoices } from '../../../../utils/fieldUtils';

const generateFields = () => {
  return [
    menuField('menu', 'Navigation menu'),
    groupField(
      'ctas',
      'Navigation CTA cards',
      {
        occurrence: {
          min: null,
          max: null,
          default: 0,
        },
        children: [
          textField('title', 'Title'),
          textField('description', 'Description'),
          linkField('link', 'Link'),
          textField('linkLabel', 'Link Label', { default: 'Learn More' }),
          imageField('image', 'Image'),
          choiceField('imageVariant', 'Image Variant', { choices: mediaVariantChoices, default: 'circle' }),
          choiceField('bgColor', 'Background Color', { choices: themeColorChoices, default: 'petrol' }),
          numberField('menuIndex', 'Menu Index', { min: 0 }),
          numberField('submenuIndex', 'Submenu Index', { min: 0 }),
        ],
      },
    ),
    ctaField('cta', 'Header CTA button'),
  ];
};

export default generateFields;
