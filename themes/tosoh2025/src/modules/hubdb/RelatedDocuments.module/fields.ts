import { booleanField, groupField, hubDbTableField, textField, urlField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('locked_message', 'Locked Message', {
      default: 'Login to unlock and download this file',
    }),
    booleanField('is_locked', 'Is Locked', {
      default: false,
    }),
    groupField('tab_group_columns', 'Tab Group Columns', {
      children: [
        hubDbTableField('hubdb_table_id', 'HubDB Table ID'),
        textField('column_id', 'Column ID'),
        textField('filter_value', 'Filter Value'),
        textField('column_label', 'Column Label'),
        urlField('url', 'URL', {
          inline_help_text:
            'URL that will point to another page on the site. If url is provided, the tab group button will act as a link. ',
        }),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),
  ];
};

export default generateFields;
