import { blogField, booleanField, groupField, numberField, tagField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),
    blogField('blog', 'Blog'),
    groupField('filter_by_tags', 'Filter by Tags', {
      occurence: {
        min: 0,
        max: null,
      },
      children: [
        tagField('tag', 'Tag', {
          tag_value: 'SLUG',
        }),
      ],
    }),
    booleanField('display_image', 'Display Image', {
      default: true,
    }),
    numberField('posts_to_display', '# of posts to Display', {
      default: 6,
      step: 1,
      min: 1,
      max: 10,
    }),
    textField('read_more_label', 'Read More Label', {
      default: 'Read More',
    }),
    groupField('settings', 'Settings', {
      children: [
        booleanField('is_hidden', 'Is Hidden', {
          default: false,
        }),
      ],
    }),
  ];
};

export default generateFields;
