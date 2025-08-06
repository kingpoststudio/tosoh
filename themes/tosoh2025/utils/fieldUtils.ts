import { booleanField, choiceField, numberField, groupField, textField } from "hs-fieldkit";

export const themeColorChoices = [
  ['petrol', 'Petrol'],
  ['cream', 'Cream'],
  ['sand', 'Sand'],
  ['lime', 'Lime'],
  ['teal', 'Teal'],
  ['rust', 'Rust'],
  ['gray', 'Gray'],
];

export const extendedThemeColorChoices = [
  ['petrol', 'Petrol'],
  ['petrol-light', 'Petrol (light)'],
  ['petrol-lighter', 'Petrol (lighter)'],
  ['petrol-lightest', 'Petrol (lightest)'],
  ['cream', 'Cream'],
  ['sand', 'Sand'],
  ['lime', 'Lime'],
  ['lime-light', 'Lime (light)'],
  ['lime-lighter', 'Lime (lighter)'],
  ['lime-lightest', 'Lime (lightest)'],
  ['teal', 'Teal'],
  ['teal-light', 'Teal (light)'],
  ['teal-lighter', 'Teal (lighter)'],
  ['teal-lightest', 'Teal (lightest)'],
  ['rust', 'Rust'],
  ['rust-light', 'Rust (light)'],
  ['rust-lighter', 'Rust (lighter)'],
  ['rust-lightest', 'Rust (lightest)'],
  ['black', 'Black'],
  ['gray', 'Gray'],
  ['white', 'White'],
  ['transparent', 'Transparent'],
];

/* Only include colors with lighter shades */
export const themeShadeChoices = [
  ['petrol', 'Petrol'],
  ['lime', 'Lime'],
  ['teal', 'Teal'],
  ['rust', 'Rust'],
];

export const mediaVariantChoices = [
  ["pill", "Pill"],
  ["circle", "Circle"],
  ["square", "Square"],
];

export const shapeVariantChoices = [
  ["circle", "Circle"],
  ["square", "Square (1:1)"],
  ["video", "Video (16:9)"],
  ["pill-start", "Pill (left/up)"],
  ["pill-end", "Pill (right/down)"],
  ["rounded-bl", "Rounded (bottom left)"],
  ["rounded-br", "Rounded (bottom right)"],
  ["rounded-tl", "Rounded (top left)"],
  ["rounded-tr", "Rounded (top right)"],
  ["quarter-circle-bl", "Quarter-circle (bottom left)"],
  ["quarter-circle-br", "Quarter-circle (bottom right)"],
  ["quarter-circle-tl", "Quarter-circle (top left)"],
  ["quarter-circle-tr", "Quarter-circle (top right)"],
];

export const linkVariantChoices = [
  ["link", "Link"],
  ["link theme-cream", "Link (cream)"],
  ["link with-arrow", "Link with arrow"],
  ["link with-arrow theme-cream", "Link with arrow (cream)"],
  ["button", "Button (standard)"],
  ["button theme-petrol", "Button (petrol)"],
  ["button theme-lime", "Button (lime)"]
];

export const sizeChoices = [
  ["auto", "Auto"],
  ["fit", "Fit"],
  ['2xs', '2X-small'],
  ['xs', 'Extra-small'],
  ['sm', 'Small'],
  ['base', 'Base'],
  ['md', 'Medium'],
  ['lg', 'Large'],
  ['xl', 'Extra-large'],
  ['2xl', '2X-large'],
  ['3xl', '3X-large'],
  ['4xl', '4X-large'],
  ["inherit", "Inherit"],
  ["none", "None"],
];

export const textAlignChoices = [
  ['left', 'Left'],
  ['center', 'Center'],
  ['right', 'Right'],
];

export const alignmentChoices = [
  ['start', 'Start'],
  ['center', 'Center'],
  ['end', 'End'],
];

export const animationTravelChoices = [
  ['-2rem', 'Left/Down (large)'],
  ['-1rem', 'Left/Down (small)'],
  ['0', 'No travel'],
  ['1rem', 'Right/Up (small)'],
  ['2rem', 'Right/Up (large)'],
];

export const contentBlockRtfFeatures = [
  "indents",
  "charmap",
  "advanced_emphasis",
  "standard_emphasis",
  "anchor",
  "colors",
  "block",
  "link",
  "cta",
  "embed",
  "video",
  "hr",
  "table",
  "personalize",
  "emoji",
  "image",
  "lists",
  "alignment",
  "lineheight"
];

export const linePathChoices = [
  ['TL,TM,TR', 'Top Horizontal'],
  ['ML,MM,MR', 'Middle Horizontal'],
  ['BL,BM,BR', 'Bottom Horizontal'],
  ['TL,ML,BL', 'Left Vertical'],
  ['TM,MM,BM', 'Center Vertical'],
  ['TR,MR,BR', 'Right Vertical'],

  // L-Shaped Paths
  ['TL,TM,MM,BM', 'Top-Left L-Shape'],
  ['TR,TM,MM,BM', 'Top-Right L-Shape'],
  ['TM,MM,MR,BR', 'Vertical to Horizontal L'],
  ['ML,MM,BM', 'Horizontal to Vertical L'],

  // Curved Paths
  ['TL,MR,BL', 'S-Curve'],
  ['TR,ML,BR', 'Reverse S-Curve'],

  // Flow Patterns
  ['TM,ML,MM,MR,BM', 'Center Flow (Cross)'],
  ['TL,MM,TR,MM,BL', 'Wave Pattern'],
  ['TM,MM,ML,MM,BM', 'Plus Sign Flow'],
  ['ML,MM,MR,MM,BM', 'T-Shape Flow'],

  // Corner Flows
  ['TL,ML,MM,MR', 'Left to Right Corner'],
  ['TR,MR,MM,ML', 'Right to Left Corner'],
  ['TM,MM,ML,BL', 'Center to Bottom-Left'],

  // Complex Patterns
  ['TL,TM,TR,MR,BR,BM,BL,ML,MM', 'Spiral Inward'],
  ['TL,TM,TR,MR,BR,BM,BL,ML,TL', 'Border Frame (Closed Loop)'],
  ['TM,ML,BM,MR,TM', 'Diamond Pattern'],
  ['TM,MM,ML,MM,BM,MM,MR,MM', 'Star Pattern'],
  ['TL,MM,TR,MM,BL,MM,BR', 'Figure Eight'],

  // Simple Corner Connectors
  ['TL,MM', 'Top-Left to Center'],
  ['TR,MM', 'Top-Right to Center'],
  ['BL,MM', 'Bottom-Left to Center'],
  ['BR,MM', 'Bottom-Right to Center'],
  ['MM,TM', 'Center to Top'],
  ['MM,BM', 'Center to Bottom'],
  ['MM,ML', 'Center to Left'],
  ['MM,MR', 'Center to Right'],

  // Edge Flows
  ['TL,TM,MM,BM,BR', 'Top Arc to Bottom Corner'],
  ['TR,TM,MM,BM,BL', 'Top Arc to Bottom Corner (Reverse)'],
  ['TL,ML,MM,MR,TR', 'Left Arc to Right Corner'],
  ['BL,ML,MM,MR,BR', 'Left Arc to Right (Bottom)'],

  // Minimal Paths
  ['TM,BM', 'Simple Vertical'],
  ['ML,MR', 'Simple Horizontal'],
  ['TL,TR', 'Top Diagonal'],
  ['BL,BR', 'Bottom Diagonal'],
  ['TL,BL', 'Left Edge'],
  ['TR,BR', 'Right Edge'],
];

const segmentFields = [
  numberField("size", "Size", {
    min: 0,
    max: 100,
    step: 1,
    default: 100,
    suffix: "%",
    inline_help_text: "Defines the size of the line segment as a percentage of the total width.",
  }),
  numberField("width", "Width/thickness", {
    min: 0,
    max: 16,
    step: 1,
    default: 2,
    suffix: "px",
    inline_help_text: "Defines the thickness of the line segment.",
  }),
  choiceField("color", "Color", {
    choices: extendedThemeColorChoices,
    default: 'petrol',
    inline_help_text: "Defines the color of the line segment.",
  }),
];

export const lineFields = [
  booleanField('is_enabled', 'Enable decorative line?', {
    default: true,
    inline_help_text: 'Enables the decorative line below the title and across the banner.',
  }),
  textField('path', 'Path', {
    inline_help_text: 'Defines the decorative line path using grid coordinates: TL,TM,TR (top), ML,MM,MR (middle), BL,BM,BR (bottom).',
  }),
  groupField("main_segments", "Main line segments", {
    children: segmentFields,
    occurrence: {
      min: null,
      max: 4,
    },
    inline_help_text: "Defines the main segments of the decorative line. You can specify up to 4 segments, each with its own size, width, and color.",
  }),
  groupField("accent_segments", "Accent line segments", {
    children: segmentFields,
    occurrence: {
      min: null,
      max: 4,
    },
    inline_help_text: "If accent segments are provided, they will be displayed in addition to the main segments. This allows for a dual-path decorative line.",
  }),
  numberField('z_index', 'Z-index', {
    min: -1,
    max: 1000,
    default: 10,
    step: 1,
    inline_help_text: 'Defines the stacking order of the decorative line relative to other elements on the page. Higher values appear above lower values.',
  }),
  choiceField('offset_split', 'Split line offset', {
    choices: sizeChoices,
    default: 'lg',
    inline_help_text: 'Defines the distance between the main line and accent line throughout the path.',
  }),
  choiceField('offset_top', 'Top offset', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('offset_bottom', 'Bottom offset', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('offset_left', 'Left offset', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('offset_right', 'Right offset', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
];

export const paddingFields = [
  choiceField('pt_mobile', 'Top padding (mobile)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pt_desktop', 'Top padding (desktop)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pr_mobile', 'Right padding (mobile)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pr_desktop', 'Right padding (desktop)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pb_mobile', 'Bottom padding (mobile)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pb_desktop', 'Bottom padding (desktop)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pl_mobile', 'Left padding (mobile)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
  choiceField('pl_desktop', 'Left padding (desktop)', {
    choices: sizeChoices,
    display_width: "half_width",
  }),
];

export const presetPaddingFields = [
  choiceField('pt_mobile', 'Top padding (mobile)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pt_desktop', 'Top padding (desktop)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pr_mobile', 'Right padding (mobile)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pr_desktop', 'Right padding (desktop)', {
    choices: sizeChoices,
    default: '2xl',
    display_width: "half_width",
  }),
  choiceField('pb_mobile', 'Bottom padding (mobile)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pb_desktop', 'Bottom padding (desktop)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pl_mobile', 'Left padding (mobile)', {
    choices: sizeChoices,
    default: 'md',
    display_width: "half_width",
  }),
  choiceField('pl_desktop', 'Left padding (desktop)', {
    choices: sizeChoices,
    default: '2xl',
    display_width: "half_width",
  }),
];

export const hideModuleField = booleanField('isHidden', 'Hide module?');

export const offsetFields = [
  numberField("offset_x_mobile", "X-axis offset (mobile)", {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: "rem",
    inline_help_text:
      "Positive values move it to the right, negative values to the left.",
  }),
  numberField("offset_x_desktop", "X-axis offset (desktop)", {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: "rem",
    inline_help_text:
      "Positive values move it to the right, negative values to the left.",
  }),
  numberField("offset_y_mobile", "Y-axis offset (mobile)", {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: "rem",
    inline_help_text:
      "Positive values move it down, negative values up.",
  }),
  numberField("offset_y_desktop", "Y-axis offset (desktop)", {
    default: 0,
    min: -100,
    max: 100,
    step: 1,
    suffix: "rem",
    inline_help_text:
      "Positive values move it down, negative values up.",
  }),
]

export const animationSettingsGroup = groupField('animation_settings', 'Animation settings', {
  children: [
    booleanField('is_animated', 'Enable animations?', {
      inline_help_text: 'Enables animations when the module and/or its elements are visible within the viewport.',
    }),
    numberField('delay', 'Animation delay (ms)', {
      default: 500,
      min: 0,
      max: 5000,
      step: 50,
    }),
    numberField('duration', 'Animation duration (ms)', {
      default: 500,
      min: 0,
      max: 5000,
      step: 50,
    }),
    choiceField('x_travel', 'X-axis travel distance', {
      choices: animationTravelChoices,
      default: '0',
    }),
    choiceField('y_travel', 'Y-axis travel distance', {
      choices: animationTravelChoices,
      default: '0',
    }),
  ],
});

export const decorationSettingsGroup = groupField('decoration_settings', 'Decoration settings', {
  inline_help_text: 'These settings control the appearance of the decorative line below the title and across the banner.',
  children: lineFields,
});

export const moduleSettingsGroup = groupField('module_settings', 'Module settings', {
  children: [
    choiceField('bg_color', 'Background color', {
      choices: themeColorChoices,
      default: 'cream',
    }),
    choiceField('text_color', 'Text color', {
      choices: themeColorChoices,
      default: 'petrol',
    }),
    ...presetPaddingFields,
  ],
});

export const revealSettingsGroup = groupField("reveal_settings", "Reveal Settings", {
  children: [
    booleanField("is_concealed", "Enable reveal functionality?", {
      default: false,
      inline_help_text: "When enabled, the column content will be collapsed and can be expanded by the user.",
    }),
    numberField("max_height", "Maximum height (rem)", {
      default: 32,
      min: 8,
      max: 64,
      step: 1,
      suffix: "rem",
      inline_help_text: "The maximum height in rem units before the content is concealed.",
    }),
    textField("reveal_label", "Reveal label", { default: "Show more" }),
  ],
});
