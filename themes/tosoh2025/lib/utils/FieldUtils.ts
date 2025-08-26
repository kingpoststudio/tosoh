import { groupField, textField, urlField } from 'hs-fieldkit';

export const breadCrumbField = () => {
  return [
    groupField('breadcrumbs', 'Breadcrumbs', {
      children: [
        textField('title', 'Title', {
          required: true,
        }),
        urlField('url', 'URL', {
          required: true,
        }),
      ],
      occurrence: {
        min: 1,
        max: null,
      },
    }),
  ];
};
