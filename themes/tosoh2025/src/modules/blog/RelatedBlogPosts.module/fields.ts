import { blogField, tagField, textField } from "hs-fieldkit";
import { moduleSettingsGroup } from "../../../../utils/fieldUtils";

const generateFields = () => [
  textField('title', 'Title', {
    default: 'Related articles',
  }),
  blogField('blog', 'Blog'),
  textField('show_all_label', '\"Show all posts\" label', {
    inline_help_text: "Leave this value empty to hide the \"Show all posts\" button.",
    default: 'Show all posts',
  }),
  tagField('filter_by_tag', 'Tag', {
    tag_value: "ALL",
    inline_help_text: "Select a blog tag to filter the related posts. Leave blank to show the blog's most recent posts.",
  }),
  moduleSettingsGroup,
]

export default generateFields;
