import { groupField, richTextField, textField } from 'hs-fieldkit';
import {
  additionalConfSettingsFields,
  breadCrumbField,
  errorCardFields,
  searchField,
  topicFiltersWithApplyButton,
} from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,

    richTextField('eyebrow', 'Eyebrow', {
      default: 'Reference Library for Hb Variants',
    }),
    richTextField('title', 'Title', {
      default: 'Tosoh Portale Emogiobine',
    }),
    richTextField('description', 'Description', {
      default:
        "Casi clinici posti dagli utenti agli esperti del sito, con relativi allegati (laddove disponibili). La numerazione dei casi segue l'ordine del database presente in archivio (non sono visibili alcuni casi simulati).",
    }),
    searchField(),
    topicFiltersWithApplyButton,

    groupField('card_configuration', 'Card Configuration', {
      children: [
        textField('property_label', 'Property Label', {
          default: 'Proprietà',
        }),
        textField('value_label', 'Value Label', {
          default: 'Valore',
        }),
        groupField('table_configuration', 'Table In Modal - Configuration', {
          children: [
            textField('sex_label', 'Sex Label', {
              default: 'Sesso',
            }),
            textField('patient_dob_label', 'Patient DOB Label', {
              default: 'Data di nascita paziente (gg/mm/00)',
            }),
            textField('ethnicity_label', 'Ethnicity Label', {
              default: "Eventuali informazioni sull'etnia",
            }),
            textField('history_label', 'History Label', {
              default: 'Anamnesi',
            }),
            textField('anomaly_label', 'Anomaly Label', {
              default: 'Eventuali anomalie nelle indagini svolte',
            }),
            textField('blood_count_label', 'Blood Count Label', {
              default: 'Emocromo',
            }),
            textField('hemoglobin_status_label', 'Hemoglobin Status Label', {
              default: 'Assetto emoglobinico',
            }),
            textField('other_label', 'Other Label', {
              default: 'Altro',
            }),
            textField('diagnosis_label', 'Diagnosis Label', {
              default: 'Diagnosi',
            }),
            textField('other_diagnosis_label', 'Other Diagnosis Label', {
              default: 'Altro',
            }),
            textField('advice_label', 'Advice Label', {
              default: 'Consigliare',
            }),
          ],
        }),
        textField('attachments_label', 'Attachments Label', {
          default: 'Allegati',
        }),
        textField('attachments_description', 'Attachments Description', {
          default: "Clicca su un'immagine per vedere di più.",
        }),
      ],
    }),
    errorCardFields,
    additionalConfSettingsFields,
  ];
};

export default generateFields;
