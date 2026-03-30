import { formField, linkField, richTextField, textField } from 'hs-fieldkit';
import { contentBlockRtfFeatures } from '../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    textField('title', 'Title'),
    richTextField('description', 'Description', {
      enabled_features: contentBlockRtfFeatures,
    }),
    linkField('return_to_cct_tool_path', 'Return to CCT Tool Path', {
      inline_help_text: 'The URL to the main CCT Tool screen.',
      required: true,
      default: {
        url: {
          content_id: null,
          type: 'INTERNAL',
          href: '/competitor-comparison-tool',
        },
        open_in_new_tab: false,
        no_follow: false,
      },
    }),
    textField('return_to_main_screen_message', 'Return to main screen message', {
      inline_help_text: 'The message to display when returning to the main screen.',
      required: true,
      default: 'Return to main screen',
    }),
    textField('field_suggestions_title', 'Left side column title', {
      inline_help_text: 'The title to display for the left side column.',
      required: true,
      default: 'Field Suggestions',
    }),
    textField('new_record_button_message', 'New record button message', {
      inline_help_text: 'The message to display when clicking the new record button.',
      required: true,
      default: 'New Record',
    }),
    formField('form', 'Form'),
  ];
};

export default generateFields;
