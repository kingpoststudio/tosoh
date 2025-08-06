import { groupField, imageField, linkField, textField } from "hs-fieldkit";
import { moduleSettingsGroup, animationSettingsGroup } from "../../../utils/fieldUtils";

const generateFields = () => [
  textField('title', 'Module title'),
  groupField('cards', 'Leader cards', {
    children: [
      textField('title', 'Title/position'),
      textField('leader', 'Leader name'),
      linkField('link', 'Link'),
      imageField('image', 'Image'),
      animationSettingsGroup,
    ],
    occurrence: {},
  }),
  moduleSettingsGroup,
]

export default generateFields;
