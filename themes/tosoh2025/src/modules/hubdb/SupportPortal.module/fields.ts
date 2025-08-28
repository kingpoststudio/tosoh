import { groupField, textField, hubDbTableField } from 'hs-fieldkit';
import { breadCrumbField } from '../../../../lib/utils/FieldUtils';

const generateFields = () => {
  return [
    breadCrumbField(),
    textField('title', 'Title', {
      default: 'Tosoh Support Portal',
    }),
    textField('description', 'Description', {
      default:
        'Your centralized hub for technical assistance, product resources, and expert guidance across Tosoh diagnostic systems.',
    }),
    groupField('search', 'Search', {
      children: [
        textField('title', 'Title'),
        hubDbTableField('hubdb_table_id', 'HubDB Table'),
        textField('hubdb_column_id', 'HubDB Column ID', {
          inline_help_text:
            'Enter the column ID of the HubDB table that contains the search terms.',
          default: 'search_terms',
        }),
      ],
    }),
    groupField('filters', 'Filters', {
      children: [
        textField('hubdb_column_id', 'HubDB Column ID', {
          inline_help_text:
            'The ID of the column you wish to filter. This is not the label for the column, but the single-string ID (i.e., <code>column_id</code>).',
        }),
      ],
      occurrence: {
        min: 1,
        max: 4,
      },
    }),
  ];
};

export default generateFields;
