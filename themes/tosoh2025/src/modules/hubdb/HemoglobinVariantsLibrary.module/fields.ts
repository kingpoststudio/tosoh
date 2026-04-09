import { groupField, textField, booleanField, formField } from 'hs-fieldkit';
import {
  additionalSettingsFields,
  breadCrumbField,
  errorCardFields,
  searchField,
  topicFilters,
} from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,

    textField('eyebrow', 'Eyebrow', {
      default: 'Reference Library for Hb Variants',
    }),
    textField('title', 'Title', {
      default: 'Tosoh Hemoglobin Variants Library',
    }),

    searchField(),
    topicFilters,
    errorCardFields,
    additionalSettingsFields,
  ];
};

export default generateFields;
