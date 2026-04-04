import { choiceField, groupField, hubDbTableField, textField } from 'hs-fieldkit';
import { lockedGroupFields, relatedDocumentsSharedFields } from '../../../../lib/utils/fieldUtils';

const columnLabelField = (defaultValue: string) =>
  textField('column_label', 'Column Label', {
    required: true,
    default: defaultValue,
  });

const noDocumentsFoundMessageField = (defaultValue: string) =>
  textField('no_documents_found_message', 'No Documents Found Message', {
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
    hubDbTableField('hubdb_table_ifu', 'IFU HubDB Table', {
      required: true,
      inline_help_text: 'The hubDB table that contains the IFU documents.',
    }),
    hubDbTableField('hubdb_table_sds', 'SDS HubDB Table', {
      required: true,
      inline_help_text: 'The hubDB table that contains the SDS documents.',
    }),
    hubDbTableField('hubdb_table_cofa', 'CofA HubDB Table', {
      required: true,
      inline_help_text: 'The hubDB table that contains the CofA documents.',
    }),
    textField('product_code', 'Product Code', {
      required: true,
      inline_help_text:
        'Product code to match the documents to the product. This will be used to filter the documents by product code.',
    }), 
    groupField('ifu_settings', 'Instructions For Use (IFU) Settings', {
      children: [
        columnLabelField('Instructions For Use (IFU)'),
        noDocumentsFoundMessageField('No IFU documents found for this product.'),
        ...lockedGroupFields,
      ],
    }),
    groupField('sds_settings', 'Safety Data Sheets (SDS) Settings', {
      children: [
        columnLabelField('Safety Data Sheets (SDS)'),
        noDocumentsFoundMessageField('No SDS documents found for this product.'),
        ...lockedGroupFields,
      ],
    }),
    groupField('cofa_settings', 'Certificates of Analysis (CofA) Settings', {
      children: [
        columnLabelField('Certificates of Analysis (CofA)'),
        noDocumentsFoundMessageField('No CofA documents found for this product.'),
        ...lockedGroupFields,
      ],
    }),
    ...relatedDocumentsSharedFields,
  ];
};

export default generateFields;
