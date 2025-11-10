import { groupField, textField } from 'hs-fieldkit';
import { relatedDocumentsSharedFields } from '../../../../lib/utils/fieldUtils';

const columnLabelField = textField('column_label', 'Column Label');

const generateFields = () => {
  return [
    groupField('ifu_documents', 'Instructions For Use (IFU) Documents', {
      children: [columnLabelField],
    }),
    groupField('sds_documents', 'Safety Data Sheets (SDS) Documents', {
      children: [columnLabelField],
    }),
    groupField('coa_documents', 'Certificates of Analysis (CoA) Documents', {
      children: [columnLabelField],
    }),
    ...relatedDocumentsSharedFields,
  ];
};

export default generateFields;
