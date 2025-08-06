import { groupField, hubDbRowField, pageField, textField } from "hs-fieldkit";
import { moduleSettingsGroup, animationSettingsGroup, decorationSettingsGroup } from "../../../utils/fieldUtils";

const generateFields = () => [
  textField('title', 'Module title'),
  pageField('insights_page', 'Insights page', {
    inline_help_text: 'Select the dynamic page that will display the Insights.',
  }),
  groupField('cards', 'Insight cards', {
    children: [
      hubDbRowField('hubdb_row', 'Insight', {
        table_name_or_id: 'insights',
        display_columns: ['title'],
        columns_to_fetch: [
          'title',
          'description',
          'featured_image',
          'type',
        ],
      }),
      animationSettingsGroup,
    ],
    occurrence: {},
  }),
  moduleSettingsGroup,
  decorationSettingsGroup,
]

export default generateFields;
