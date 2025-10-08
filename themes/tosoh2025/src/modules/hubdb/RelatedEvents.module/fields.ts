import { textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    textField('eyebrow', 'Eyebrow'),
    textField('title', 'Title'),
    textField('exclude_event_id', 'Exclude Event ID', {
      inline_help_text:
        'This is the hs_id of the event to exclude from the related events carousel. If no event is provided, all events will be displayed.',
    }),
    textField('include_by_type', 'Include By Type', {
      inline_help_text:
        'If no event type is provided, all events will be displayed. Example types are webinar, conference and workshop. The type is the "INTERNAL_NAME" of the "event_type" column in the HubDB table.',
    }),

    textField('cta_label', 'CTA Label', {
      default: 'Read More',
    }),
  ];
};

export default generateFields;
