import { groupField, textField, hubDbTableField, booleanField, choiceField } from 'hs-fieldkit';
import {
  breadCrumbField,
  searchField,
  searchVisibilityRule,
  topicFilters,
} from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    choiceField('access_level', 'Access Level', {
      choices: [
        ['Customer', 'Customer'],
        ['Distributor', 'Distributor'],
        ['Internal', 'Internal'],
      ],
      required: true,
      default: 'Customer',
    }),

    breadCrumbField,
    textField('title', 'Title', {
      default: 'Tosoh Support Portal',
    }),
    textField('description', 'Description', {
      default:
        'Your centralized hub for technical assistance, product resources, and expert guidance across Tosoh diagnostic systems.',
    }),
    searchField([
      booleanField('is_access_level_filter_enabled', 'Is acess level filter enabled?', {
        inline_help_text:
          "Enable this only if the HubDB table you are searching against matches the module's access levels and the column name is 'visibility'.",
        ...searchVisibilityRule,
      }),
    ]),
    topicFilters,
    // groupField('filters', 'Filters', {
    //   children: [
    //     textField('hubdb_column_id', 'HubDB Column ID', {
    //       inline_help_text:
    //         'The ID of the column you wish to filter. This is not the label for the column, but the single-string ID (i.e., <code>column_id</code>).',
    //       required: true,
    //     }),
    //   ],
    //   occurrence: {
    //     min: 1,
    //     max: null,
    //   },
    // }),
    booleanField('display_video_download', 'Display video download?', {
      inline_help_text:
        'If enabled, a button will be displayed on the video player that allows the user to download the video.',
      default: false,
    }),
  ];
};

export default generateFields;
