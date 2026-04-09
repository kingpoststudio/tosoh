import {hubDbTableField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    linkField('events_page_link', 'Events Page Link', {
        default: {
          url: {
            content_id: null,
            href: '/events',
          },
        },
      }),
      hubDbTableField('events_table_id', 'Events Table', {
        required: true,
        inline_help_text: 'The hubDB table that contains the events data.',
      }),

      textField('about_this_event_title', 'About This Event Title', {
        default: 'About this event',
      }),

      textField('load_more_label', 'Load More Label', {
        default: 'Load More',
      }),
      textField('no_results_found_title', 'No Results Found Title', {
        default: 'No results found.',
      }),
      textField('no_results_found_description', 'No Results Found Description', {
        default: 'Please try another selection.',
      }),
      textField('view_details_label', 'View Details Label', {
        default: 'View Details',
      }),
  ];
};

export default generateFields;
