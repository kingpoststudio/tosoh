import { textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('longitude', 'Longitude', { default: '49.8654127' }),
    textField('latitude', 'Latitude', { default: '8.5876795' }),
  ];
};

export default generateFields;
