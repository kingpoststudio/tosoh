import { choiceField, groupField, textField } from 'hs-fieldkit';
import { relatedDocumentsSharedFields } from '../../../../lib/utils/fieldUtils';

const columnLabelField = (defaultValue: string) =>
  textField('column_label', 'Column Label', {
    required: true,
    default: defaultValue,
  });

const generateFields = () => {
  return [
    choiceField('access_level', 'Access Level', {
      choices: [
        ['Customer', 'Customer'],
        ['Distributor', 'Distributor'],
        ['Internal', 'Internal'],
      ],
      required: true,
      default: 'Customer',
    }),
    textField('product_code', 'Product Code', {
      required: true,
      inline_help_text:
        'Product code to match the documents to the product. This will be used to filter the documents by product code.',
    }),

    groupField('ifu_documents', 'Instructions For Use (IFU) Documents', {
      children: [columnLabelField('Instructions For Use (IFU)')],
    }),
    groupField('sds_documents', 'Safety Data Sheets (SDS) Documents', {
      children: [columnLabelField('Safety Data Sheets (SDS)')],
    }),
    groupField('coa_documents', 'Certificates of Analysis (CofA) Documents', {
      children: [columnLabelField('Certificates of Analysis (CofA)')],
    }),
    ...relatedDocumentsSharedFields,
  ];
};

export default generateFields;
