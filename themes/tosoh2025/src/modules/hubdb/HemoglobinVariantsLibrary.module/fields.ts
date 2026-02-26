import { groupField, textField } from 'hs-fieldkit';
import {
  breadCrumbField,
  searchField,
  topicFiltersWithApplyButton,
} from '../../../../lib/utils/fieldUtils';

const generateFields = () => {
  return [
    breadCrumbField,

    textField('eyebrow', 'Eyebrow', {
      default: 'Reference Library for Hb Variants',
    }),
    textField('title', 'Title', {
      default: 'Tosoh Hemoglobin Variants Library',
    }),

    searchField(),
    topicFiltersWithApplyButton,
    groupField('card_configuration', 'Card Configuration', {
      children: [
        textField('view_details_label', 'View Details Label', {
          default: 'View Details',
        }),
        textField('download_label', 'Download Label', {
          default: 'Download PDF',
        }),
        textField('also_known_as_label', 'Also Known As Label', {
          default: 'Also known as:',
        }),
        textField('mutation_type_label', 'Mutation Type Label', {
          default: 'Mutation Type:',
        }),
        textField('mutation_description_label', 'Mutation Description Label', {
          default: 'Mutation Description:',
        }),
        textField('migration_zone_label', 'Migration Zone Label', {
          default: 'Migration Zone:',
        }),
        textField('variant_details_label', 'Variant Details Label', {
          default: 'Variant Details:',
        }),
        textField('property_label', 'Property Label', {
          default: 'Property:',
        }),
        textField('value_label', 'Value Label', {
          default: 'Value:',
        }),
        groupField('schema_configuration', 'Schema Configuration', {
          children: [
            textField('variant_name_label', 'Variant Name Label', {
              default: 'Variant Name',
            }),
            textField('hgvs_name_label', 'HGVS Name Label', {
              default: 'HGVS Name',
            }),
            textField('mutation_label', 'Mutation Label', {
              default: 'Mutation',
            }),
            textField('mutation_description_label', 'Mutation Description Label', {
              default: 'Mutation Description',
            }),
            textField(
              'heterozygote_clinical_presentation_label',
              'Heterozygote Clinical Presentation Label',
              {
                default: 'Heterozygote Clinical Presentation',
              }
            ),
            textField(
              'heterozygote_laboratory_findings_label',
              'Heterozygote Laboratory Findings Label',
              {
                default: 'Heterozygote Laboratory Findings',
              }
            ),
            textField('heterozygote_comments_label', 'Heterozygote Comments Label', {
              default: 'Heterozygote Comments',
            }),
            textField(
              'homozygote_clinical_presentation_label',
              'Homozygote Clinical Presentation Label',
              {
                default: 'Homozygote Clinical Presentation',
              }
            ),
            textField(
              'homozygote_laboratory_findings_label',
              'Homozygote Laboratory Findings Label',
              {
                default: 'Homozygote Laboratory Findings',
              }
            ),
            textField('homozygote_comments_label', 'Homozygote Comments Label', {
              default: 'Homozygote Comments',
            }),
            textField('ethnicity_label', 'Ethnicity Label', {
              default: 'Ethnicity',
            }),
            textField('additional_comments_label', 'Additional Comments Label', {
              default: 'Additional Comments',
            }),
            textField('instrument_label', 'Instrument Label', {
              default: 'Instrument',
            }),
            textField('percent_min_max_label', 'Percent Min-Max Label', {
              default: '% Min-Max',
            }),
            textField('rt_min_label', 'RT Min Label', {
              default: 'RT Min',
            }),
            textField('rt_max_label', 'RT Max Label', {
              default: 'RT Max',
            }),
            textField('migration_in_window_label', 'Migration in Window Label', {
              default: 'Migration in Window',
            }),
            textField('references_label', 'References Label', {
              default: 'References',
            }),
          ],
        }),
      ],
    }),
  ];
};

export default generateFields;
