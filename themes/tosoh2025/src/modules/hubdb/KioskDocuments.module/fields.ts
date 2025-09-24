import { groupField, textField, booleanField, formField } from 'hs-fieldkit';
import { breadCrumbField, searchField, topicFilters } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,
    formField('email_form', 'Email Form'),
    formField('gated_form', 'Gated Form (download)'),
    formField('gated_form_email', 'Gated Form (email)'),
    booleanField('internal_version', 'Internal View'),

    textField('title', 'Title', {
      default: 'Tosoh Kiosk Documents',
    }),
    textField('description', 'Description', {
      default:
        'Browse technical manuals, user guides, and official documentation to support your Tosoh products and services.',
    }),
    searchField,
    topicFilters,
  ];
};

export default generateFields;
