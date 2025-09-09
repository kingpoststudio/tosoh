import { groupField, textField, hubDbTableField, booleanField } from 'hs-fieldkit';

const searchEnabledVisibilityRules = {
  visibility: {
    controlling_field: 'search.enable_search',
    controlling_value_regex: true,
    operator: 'EQUAL',
  },
};

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
      default: 'Upcoming Webinars',
    }),

    groupField('search', 'Search', {
      children: [
        booleanField('enable_search', 'Enable search?'),
        textField('search_input_placeholder', 'Search Input Placeholder', {
          default: 'Search',
          ...searchEnabledVisibilityRules,
        }),
        textField('hubdb_column_id', 'Search HubDB Column ID', {
          inline_help_text: 'Enter the ID of the HubDB column you wish to search.',
          ...searchEnabledVisibilityRules,
        }),
      ],
    }),

    groupField('filters', 'Filters', {
      children: [
        booleanField('enable_dropdown_filters', 'Enable dropdown filters?'),
        groupField('dropdown_filters', 'Dropdown Filters', {
          visibility: {
            controlling_field: 'filters.enable_dropdown_filters',
            controlling_value_regex: true,
            operator: 'EQUAL',
          },
          children: [
            textField('hubdb_column_id', 'HubDB Column ID', {
              inline_help_text:
                'The ID of the column you wish to filter. This is not the label for the column, but the single-string ID (i.e., <code>column_id</code>).',
              required: true,
            }),

            textField('dropdown_filter_placeholder', 'Dropdown Filter Placeholder'),
          ],
          occurrence: {
            min: 0,
            max: 4,
          },
        }),
      ],
    }),
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
