import { groupField, tagField, textField } from 'hs-fieldkit';

const generateFields = () => [
  textField('title', 'Title', {
    default: 'More articles',
  }),
  textField('show_all_label', '\"Show all posts\" label', {
    default: 'Show all',
  }),
  groupField('tags', 'Tags', {
    children: [
      tagField('tag', 'Tag', {
        tag_value: 'ALL',
      }),
    ],
    occurrence: {
      min: null,
      max: 6,
    },
  }),
];

export default generateFields;
