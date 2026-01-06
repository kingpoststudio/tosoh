import { BorderStyle } from 'docx';

import type { ColumnConfig } from '../../../types/cctDocuments';

export const FONTS = {
  default: 'Arial',
} as const;

export const COLORS = {
  primary: 'ED1A3B',
  textMuted: '6A7282',
  advantage: '00C950',
  disadvantage: 'FF4444',
  advantageBackground: 'E8F5E9',
  disadvantageBackground: 'FFEBEE',
  headerBackground: 'E5E5E5',
  border: 'CCCCCC',
} as const;

export const DOCUMENT_DIMENSIONS = {
  tableWidth: 9360,
  headerRowHeight: 1080,
  logoWidth: 58,
  logoHeight: 64,
  headerCellWidthPercentage: 50,
} as const;

export const FONT_SIZES = {
  header: 24,
  date: 20,
} as const;

export const SPACING = {
  large: 400,
  medium: 200,
  small: 120,
} as const;

export const COLUMN_RATIOS = {
  fixedColumn: 0.15,
  dynamicColumns: 0.7,
} as const;

export const HEX_COLOR = {
  shortLength: 3,
  fullLength: 6,
} as const;

export const CATEGORY_NAMES = {
  generalComparison: 'General Comparison',
} as const;

export const NO_BORDERS = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE },
  insideVertical: { style: BorderStyle.NONE },
} as const;

export const LIGHT_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
} as const;

export const STATUS_COLORS: Record<string, string> = {
  Advantage: COLORS.advantage,
  Disadvantage: COLORS.disadvantage,
} as const;

export const STATUS_BACKGROUNDS: Record<string, string> = {
  Advantage: COLORS.advantageBackground,
  Disadvantage: COLORS.disadvantageBackground,
} as const;

export const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: 'lab_manager', label: 'Lab Manager' },
  { key: 'lab_manager_competitor', label: 'Lab Manager Competitor' },
  { key: 'lab_technician', label: 'Lab Technician' },
  { key: 'lab_technician_competitor', label: 'Lab Technician Competitor' },
  { key: 'procurement_manager', label: 'Procurement Manager' },
  { key: 'procurement_manager_competitor', label: 'Procurement Manager Competitor' },
  { key: 'clinician', label: 'Clinician' },
  { key: 'clinician_competitor', label: 'Clinician Competitor' },
];

// Named colors map for HTML color conversion
export const NAMED_COLORS: Record<string, string> = {
  red: 'FF0000',
  green: '008000',
  blue: '0000FF',
  black: '000000',
  white: 'FFFFFF',
  yellow: 'FFFF00',
  orange: 'FFA500',
  purple: '800080',
  pink: 'FFC0CB',
  gray: '808080',
  grey: '808080',
  cyan: '00FFFF',
  magenta: 'FF00FF',
  lime: '00FF00',
  maroon: '800000',
  navy: '000080',
  olive: '808000',
  teal: '008080',
  aqua: '00FFFF',
  silver: 'C0C0C0',
  fuchsia: 'FF00FF',
};
