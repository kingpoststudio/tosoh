import { imageField, richTextField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    imageField('bg', 'Background Image'),
    richTextField('title', 'Title'),
    richTextField('description', 'Description'),
  ];
};

export default generateFields;
