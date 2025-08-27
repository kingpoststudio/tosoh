import {
  choiceField,
  imageField,
  groupField,
  linkField,
  menuField,
  textField,
  hubDbTableField,
  booleanField,
} from 'hs-fieldkit';
import { breadCrumbField } from '../../../../lib/utils/FieldUtils';

const generateFields = () => {
  return [
    breadCrumbField(),
    textField('title', 'Title'),
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
        max: null,
      },
    }),
    booleanField('display_video_download', 'Display video download', {
      inline_help_text:
        'If enabled, a button will be displayed on the video player that allows the user to download the video.',
    }),
    booleanField('all_document_types_enabled', 'Enable all document types?', {
      inline_help_text:
        'If enabled, all document types will be displayed in the document type filter. Disabled will only display videos.',
    }),
  ];
};

export default generateFields;
