import { ctaField, imageField } from 'hs-fieldkit';

const generateFields = () => {
  return [imageField('logo', 'Logo'), ctaField('cta_id', 'CTA')];
};

export default generateFields;
