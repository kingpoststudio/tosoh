import { textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),
    textField('exclude_event_id', 'Exclude Event ID', {
      inline_help_text:
        'This is the hs_id of the event to exclude from the related events carousel. If no event is provided, all events will be displayed.',
    }),
    textField('cta_label', 'CTA Label', {
      default: 'Read More',
    }),
  ];
};

export default generateFields;
