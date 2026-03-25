import { textField, booleanField, choiceField, groupField, richTextField } from 'hs-fieldkit';
import {
  breadCrumbField,
  contentBlockRtfFeatures,
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
    textField('default_language', 'Default Language', {
      default: 'EN',
      inline_help_text:
        'Default language to display the documents in. Make sure the value matches a value from the "LANGUAGES" column in the HubDB table.',
    }),
    choiceField('document_type', 'Document Type', {
      inline_help_text:
        'The type of document to display. This will be used to construct the approperiate download urls for the documents.',
      choices: [
        ['ifu', 'IFU'],
        ['sds', 'SDS'],
        ['cofa', 'COFA'],
      ],
      default: 'ifu',
      required: true,
    }),
    groupField('card_fields', 'Card Fields', {
      inline_help_text:
        'Define the columns that will be visible in the card. The column IDs must match the column IDs in the HubDB table.',
      children: [
        textField('above_title', 'Above Title Column ID'),
        textField('title', 'Title Column ID'),
        textField('subtitle_1', 'Subtitle 1 Column ID'),
        textField('subtitle_2', 'Subtitle 2 Column ID'),
        textField('subtitle_3', 'Subtitle 3 Column ID'),
        textField('subtitle_4', 'Subtitle 4 Column ID'),
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
