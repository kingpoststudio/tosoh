import { groupField, textField, hubDbTableField, booleanField } from 'hs-fieldkit';
import { searchField, topicFilters } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    hubDbTableField('hubdb_table_id', 'HubDB Table', { required: true }),
    textField('preselected_language', 'Preselected Language', {
      inline_help_text:
        'Should match the value of a language option in the language column in the HubDB table.',
    }),

    textField('upcoming_section_eyebrow', 'Upcoming Section Eyebrow', {
      default: 'Event Highlights',
    }),
    textField('upcoming_section_title', 'Upcoming Section Title', {
      default: 'Upcoming Webinars',
    }),

    textField('past_section_eyebrow', 'Past Section Eyebrow', {
      default: 'Event Highlights',
    }),
    textField('past_section_title', 'Past Section Title', {
      default: 'Recorded',
    }),

    searchField(),
    topicFilters,

    groupField('advanced', 'Advanced', {
      children: [
        textField('filter_by_topic', 'Filter By Topic', {
          inline_help_text:
            'Enter the name of the topic you wish to filter. This will filter all results returned by the HubDB query, so use with caution.',
        }),
      ],
    }),
  ];
};

export default generateFields;
