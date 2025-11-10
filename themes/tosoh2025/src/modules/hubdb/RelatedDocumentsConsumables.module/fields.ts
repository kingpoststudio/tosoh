import {
  booleanField,
  choiceField,
  groupField,
  hubDbTableField,
  imageField,
  textField,
  urlField,
} from 'hs-fieldkit';
import { documentTypeChoices } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    textField('locked_message', 'Locked Message', {
      default: 'Login to unlock and download this file',
    }),
    booleanField('is_locked', 'Is Locked', {
      default: false,
    }),

    groupField('ifu_documents', 'Instructions For Use (IFU) Documents', {
      children: [textField('tab_label', 'Tab Label')],
    }),
    groupField('sds_documents', 'Safety Data Sheets (SDS) Documents', {
      children: [textField('tab_label', 'Tab Label')],
    }),
    groupField('coa_documents', 'Certificates of Analysis (CoA) Documents', {
      children: [textField('tab_label', 'Tab Label')],
    }),
    groupField('tab_group_columns', 'Tab Group Columns', {
      children: [
        textField('tab_label', 'Tab Label'),
        urlField('url', 'URL', {
          inline_help_text:
            'URL that will point to another page on the site. If url is provided, the tab group button will act as a link. ',
        }),
        groupField('documents', 'Documents', {
          children: [
            textField('document_name', 'Document Name'),
            textField('document_description', 'Document Description'),
            imageField('document_image', 'Document Image'),
            urlField('document_url', 'Document URL'),
            choiceField('document_type', 'Document Type', {
              choices: documentTypeChoices,
            }),
          ],
          occurrence: {
            min: null,
            max: null,
          },
        }),
      ],
      occurrence: {
        min: null,
        max: null,
      },
    }),
  ];
};

export default generateFields;
