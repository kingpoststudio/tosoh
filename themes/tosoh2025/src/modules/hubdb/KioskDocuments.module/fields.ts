import { groupField, textField, booleanField, formField } from 'hs-fieldkit';
import { breadCrumbField, topicFilters } from '../../../../lib/utils/fieldUtils';

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
    groupField('search', 'Search', {
      children: [
        textField('title', 'Title'),
        textField('hubdb_column_id', 'HubDB Column ID', {
          inline_help_text:
            'Defines the hubDB column id that will be used to pass the search query to the search engine.',
          default: 'search_term',
          required: true,
        }),
        booleanField('typeahead_enabled', 'Is typeahead enabled?', {
          default: false,
        }),
      ],
    }),
    topicFilters,
  ];
};

export default generateFields;
