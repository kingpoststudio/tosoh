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

    groupField('logout_template_config', 'Logout Template Configuration', {
      children: [
        textField('title', 'Title', {
          default: 'You are signed out',
        }),
        textField('sign_back_in_label', 'Sign Back In Label', {
          default: 'Sign Back In',
        }),
        linkField('sign_back_in_url', 'Sign Back In URL', {
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

    groupField('membership_login_template_config', 'Membership Login Template Configuration', {
      children: [
        textField('title', 'Title', {
          default: 'Sign In',
        }),
        textField('description', 'Description', {
          default: 'This Page Is Only Available To People Who Have Been Given Access.',
        }),
        textField('email_label', 'Email Label', {
          default: 'Email Address',
        }),
        textField('password_label', 'Password Label', {
          default: 'Password',
        }),
        textField('remember_me_label', 'Remember Me Label', {
          default: 'Remember Me',
        }),
        textField('reset_password_text', 'Reset Password Text', {
          default: 'Forgot Password?',
        }),
        textField('submit_button_text', 'Submit Button Text', {
          default: 'Sign In',
        }),
        textField('having_trouble_text', 'Having Trouble Text', {
          default: 'Having trouble?',
        }),
        textField('contact_admin_text', 'Contact Admin Text', {
          default: 'Contact the admin.',
        }),
      ],
    }),
  ];
};

export default generateFields;
