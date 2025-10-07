import { groupField, imageField, richTextField } from 'hs-fieldkit';
import { breadCrumbField, contentBlockRtfFeatures } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,
    imageField('image', 'Image'),
    richTextField('eyebrow', 'Eyebrow', {
      enabled_features: contentBlockRtfFeatures,
    }),
    richTextField('title', 'Title', {
      enabled_features: contentBlockRtfFeatures,
    }),

    groupField('location', 'Location', {
      children: [
        richTextField('location_title', 'Location Title', {
          enabled_features: contentBlockRtfFeatures,
        }),
        richTextField('location_value', 'Location Value', {
          enabled_features: contentBlockRtfFeatures,
        }),
      ],
    }),

    groupField('date', 'Date', {
      children: [
        richTextField('date_title', 'Date Title', {
          enabled_features: contentBlockRtfFeatures,
        }),
        richTextField('date_value', 'Date Value', {
          enabled_features: contentBlockRtfFeatures,
        }),
      ],
    }),
  ];
};

export default generateFields;
