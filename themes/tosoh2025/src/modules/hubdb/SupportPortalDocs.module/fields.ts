import { textField, booleanField, choiceField, groupField } from 'hs-fieldkit';
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

    groupField('visible_fields', 'Visible Fields', {
      children: [
        booleanField('is_category_visible', 'Is Category visible?'),
        booleanField('is_designation_visible', 'Is Designation visible?'),
        booleanField('is_product_code_visible', 'Is Product Code visible?'),
        booleanField('is_batch_number_visible', 'Is Batch Number visible?', {
          inline_help_text: 'Applicable only for CofA documents.',
        }),
        booleanField('is_expiration_date_visible', 'Is Expiration Date visible?', {
          inline_help_text: 'Applicable only for CofA documents.',
        }),
      ],
    }),

    textField('title', 'Title', {
      default: 'Tosoh Support Portal Docs',
    }),
    textField('description', 'Description', {
      default:
        'Browse technical manuals, user guides, and official documentation to support your Tosoh products and services.',
    }),
    searchField([
      booleanField('is_access_level_filter_enabled', 'Is acess level filter enabled?', {
        inline_help_text:
          "Enable this only if the HubDB table you are searching against matches the module's access levels and the column name is 'visibility'.",
        ...searchVisibilityRule,
      }),
    ]),
    topicFilters,
  ];
};

export default generateFields;
