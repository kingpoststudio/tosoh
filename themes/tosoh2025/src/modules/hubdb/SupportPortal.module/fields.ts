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
    booleanField('force_list_view', 'Force list view?', {
      inline_help_text:
        'When enabled, the module will always display the results as a list and will also hide the grid view button.',
      default: false,
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
    booleanField('display_video_download', 'Display video download?', {
      inline_help_text:
        'If enabled, a button will be displayed on the video player that allows the user to download the video.',
      default: false,
    }),
  ];
};

export default generateFields;
