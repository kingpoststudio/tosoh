import { groupField, textField } from 'hs-fieldkit';
import { relatedDocumentsSharedFields } from '../../../../lib/utils/fieldUtils';

const columnLabelField = (defaultValue: string) =>
  textField('column_label', 'Column Label', {
    required: true,
    default: defaultValue,
  });

const generateFields = () => {
  return [
    groupField('ifu_documents', 'Instructions For Use (IFU) Documents', {
      children: [columnLabelField('Instructions For Use (IFU)')],
    }),
    groupField('sds_documents', 'Safety Data Sheets (SDS) Documents', {
      children: [columnLabelField('Safety Data Sheets (SDS)')],
    }),
    groupField('coa_documents', 'Certificates of Analysis (CoA) Documents', {
      children: [columnLabelField('Certificates of Analysis (CoA)')],
    }),
    ...relatedDocumentsSharedFields,
  ];
};

export default generateFields;
