import { booleanField, groupField, linkField, numberField, richTextField, textField } from "hs-fieldkit";
import { moduleSettingsGroup, animationSettingsGroup, decorationSettingsGroup, contentBlockRtfFeatures } from "../../../utils/fieldUtils";

const generateFields = () => [
  richTextField("title", "Title", {
    enabled_features: contentBlockRtfFeatures,
  }),
  groupField("cards", "Service cards", {
    children: [
      textField("title", "Title"),
      textField("description", "Description"),
      linkField("link", "Link"),
      animationSettingsGroup,
    ],
    occurrence: {},
  }),
  booleanField("is_inline_layout", "Enable inline layout?", {
    inline_help_text: "If enabled, the title and the cards will be displayed inline. This will force a 2x2 grid for the cards."
  }),
  numberField("col_qty", "Number of columns (desktop)", {
    default: 3,
    min: 1,
    max: 4,
    step: 1,
    visibility: {
      controlling_field_path: "is_inline_layout",
      controlling_value_regex: "false",
      operator: "EQUAL",
    }
  }),
  moduleSettingsGroup,
  decorationSettingsGroup,
]

export default generateFields;
