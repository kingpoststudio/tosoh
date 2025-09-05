import { groupField, textField, hubDbTableField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    hubDbTableField('hubdb_table_id', 'HubDB Table', { required: true }),

    textField('eyebrow', 'Eyebrow', {
      default: 'Event Highlights',
    }),
    ,
    textField('title', 'Title', {
      default: 'Upcoming Webinars',
    }),
    groupField('filters', 'Filters', {
      children: [
        textField('hubdb_column_id', 'HubDB Column ID', {
          inline_help_text:
            'The ID of the column you wish to filter. This is not the label for the column, but the single-string ID (i.e., <code>column_id</code>).',
          required: true,
        }),
      ],
      occurrence: {
        min: 0,
        max: 4,
      },
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
