import { textField } from 'hs-fieldkit';
import { breadCrumbField, searchField, topicFilters } from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,

    textField('eyebrow', 'Eyebrow', {
      default: 'Reference Library for Hb Variants',
    }),
    textField('title', 'Title', {
      default: 'Tosoh Portale Emogiobine',
    }),
    textField('description', 'Description', {
      default:
        "Casi clinici posti dagli utenti agli esperti del sito, con relativi allegati (laddove disponibili). La numerazione dei casi segue l'ordine del database presente in archivio (non sono visibili alcuni casi simulati).",
    }),
    searchField(),
    topicFilters,
  ];
};

export default generateFields;
