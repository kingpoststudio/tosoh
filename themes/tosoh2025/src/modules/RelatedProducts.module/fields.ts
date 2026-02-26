import { groupField, imageField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),
    groupField('products', 'Products', {
      children: [
        textField('product_name', 'Product Name', {
          required: true,
        }),
        textField('product_description', 'Product Description'),
        imageField('product_image', 'Product Image', {
          required: true,
        }),
        linkField('product_link', 'Product Link', {
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
