import { groupField, linkField, textField } from 'hs-fieldkit';

const generateFields = () => {
  return [
    groupField('blog_listing_template_config', 'Blog Listing Template Configuration', {
      children: [
        textField('read_more_label', 'Read More Label', {
          default: 'Read More',
        }),
        textField('load_more_label', 'Load More Label', {
          default: 'Load More',
        }),
      ],
    }),

    groupField('four_zero_three_template_config', '403 Template Configuration', {
      children: [
        textField('title', 'Title', {
          default: "You don't have access to view this page",
        }),
        textField('sign_in_label', 'Sign In Label', {
          default: 'Sign In',
        }),
        linkField('sign_in_url', 'Sign In URL', {
          default: {
            url: {
              content_id: null,
              href: '/_hcms/mem/login',
            },
            open_in_new_tab: false,
            no_follow: false,
          },
        }),
      ],
    }),

    groupField('four_zero_four_template_config', '404 Template Configuration', {
      children: [
        textField('title', 'Title', {
          default: 'Page not found.',
        }),
        textField('description', 'Description', {
          default:
            'The page you requested does not exist. Please click the button below to return to the homepage.',
        }),
        textField('go_home_label', 'Go Home Label', {
          default: 'Go Home',
        }),
        linkField('go_home_url', 'Go Home URL', {
          default: {
            url: {
              content_id: null,
              href: '/',
            },
            open_in_new_tab: false,
            no_follow: false,
          },
        }),
      ],
    }),

    groupField('five_zero_zero_template_config', '500 Template Configuration', {
      children: [
        textField('title', 'Title', {
          default: 'Something went wrong.',
        }),
        textField('description', 'Description', {
          default:
            'An internal server error occurred. Please click the button below to return to the homepage.',
        }),
        textField('go_home_label', 'Go Home Label', {
          default: 'Go Home',
        }),
        linkField('go_home_url', 'Go Home URL', {
          default: {
            url: {
              content_id: null,
              href: '/',
            },
            open_in_new_tab: false,
            no_follow: false,
          },
        }),
      ],
    }),
  ];
};

export default generateFields;
