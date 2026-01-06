import {
  AlignmentType,
  BorderStyle,
  Document,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';

import type { ColumnConfig, Instrument } from '../../types/cctDocuments';
import type { CCTComparison } from '../../types/competitiveComparisonTool';

const FONTS = {
  default: 'Arial',
} as const;

const COLORS = {
  primary: 'ED1A3B',
  textMuted: '6A7282',
  advantage: '00C950',
  disadvantage: 'FF4444',
  advantageBackground: 'E8F5E9',
  disadvantageBackground: 'FFEBEE',
  headerBackground: 'E5E5E5',
  border: 'CCCCCC',
} as const;

const DOCUMENT_DIMENSIONS = {
  tableWidth: 9360,
  headerRowHeight: 1080,
  logoWidth: 58,
  logoHeight: 64,
  headerCellWidthPercentage: 50,
} as const;

const FONT_SIZES = {
  header: 24,
  date: 20,
} as const;

const SPACING = {
  large: 400,
  medium: 200,
  small: 120,
} as const;

const COLUMN_RATIOS = {
  fixedColumn: 0.15,
  dynamicColumns: 0.7,
} as const;

const HEX_COLOR = {
  shortLength: 3,
  fullLength: 6,
} as const;

const CATEGORY_NAMES = {
  generalComparison: 'General Comparison',
} as const;

const NO_BORDERS = {
  top: { style: BorderStyle.NONE },
  bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE },
  right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE },
  insideVertical: { style: BorderStyle.NONE },
} as const;

const LIGHT_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  left: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  right: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: COLORS.border },
} as const;

const STATUS_COLORS: Record<string, string> = {
  Advantage: COLORS.advantage,
  Disadvantage: COLORS.disadvantage,
} as const;

const STATUS_BACKGROUNDS: Record<string, string> = {
  Advantage: COLORS.advantageBackground,
  Disadvantage: COLORS.disadvantageBackground,
} as const;

/**
 * Creates a TextRun representing a line break
 */
function createLineBreak(): TextRun {
  return new TextRun({ text: '', break: 1, font: FONTS.default });
}

const COLUMN_CONFIGS: ColumnConfig[] = [
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
const NAMED_COLORS: Record<string, string> = {
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

/**
 * Converts various color formats to 6-character hex format for docx
 * Supports: hex (#RGB, #RRGGBB), rgb(), rgba(), and named colors
 * Returns undefined if parsing fails (safeguard)
 */
export function colorToHex(color: string): string | undefined {
  if (!color || typeof color !== 'string') return undefined;

  const trimmed = color.trim().toLowerCase();

  // Handle hex colors (#RGB or #RRGGBB)
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === HEX_COLOR.shortLength) {
      // Convert #RGB to #RRGGBB
      return (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]).toUpperCase();
    }
    if (hex.length === HEX_COLOR.fullLength && /^[0-9a-f]{6}$/i.test(hex)) {
      return hex.toUpperCase();
    }
    return undefined;
  }

  // Handle rgb() and rgba() colors
  const rgbMatch = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const red = Math.min(255, Math.max(0, parseInt(rgbMatch[1], 10)));
    const green = Math.min(255, Math.max(0, parseInt(rgbMatch[2], 10)));
    const blue = Math.min(255, Math.max(0, parseInt(rgbMatch[3], 10)));
    return (
      red.toString(16).padStart(2, '0') +
      green.toString(16).padStart(2, '0') +
      blue.toString(16).padStart(2, '0')
    ).toUpperCase();
  }

  // Handle named colors
  if (NAMED_COLORS[trimmed]) {
    return NAMED_COLORS[trimmed];
  }

  return undefined;
}

interface ParsedTextStyle {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
}

/**
 * Parses HTML content and converts it to an array of TextRun objects
 * preserving formatting like bold, italic, colors, underline, etc.
 * Falls back to plain text on parsing errors (safeguard)
 */
export function parseHtmlToTextRuns(html: string | undefined): TextRun[] {
  // Handle empty/null input
  if (!html || typeof html !== 'string') {
    return [];
  }

  // Replace NEWLINE markers before processing
  const content = html.replace(/NEWLINE/g, '\n');

  // Check if content has any HTML tags
  const hasHtmlTags = /<[^>]+>/.test(content);

  // If no HTML tags, just create text runs with line breaks
  if (!hasHtmlTags) {
    return createPlainTextRuns(content);
  }

  try {
    const parsedHtml = new DOMParser().parseFromString(content, 'text/html');
    const runs: TextRun[] = [];

    processNode(parsedHtml.body, {}, runs);

    // If parsing produced no runs but we have content, fall back to plain text
    if (runs.length === 0 && content.trim()) {
      return createPlainTextRuns(stripHtmlFallback(content));
    }

    return runs;
  } catch (error) {
    // Safeguard: fall back to plain text on any parsing error
    console.error('Error parsing HTML for DOCX:', error);
    return createPlainTextRuns(stripHtmlFallback(content));
  }
}

/**
 * Creates plain text runs with line break handling
 */
export function createPlainTextRuns(text: string): TextRun[] {
  if (!text) return [];

  const runs: TextRun[] = [];
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      runs.push(createLineBreak());
    }
    const lineText = lines[i] || '';
    if (lineText) {
      runs.push(new TextRun({ text: lineText, font: FONTS.default }));
    }
  }

  return runs;
}

/**
 * Fallback HTML stripper for error cases
 */
function stripHtmlFallback(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Recursively processes DOM nodes and creates TextRun objects
 */
function processNode(node: Node, inheritedStyles: ParsedTextStyle, runs: TextRun[]): void {
  // Handle text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || '';
    if (text) {
      appendTextWithLineBreaks(text, inheritedStyles, runs);
    }
    return;
  }

  // Skip non-element nodes
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  const element = node as HTMLElement;
  const tagName = element.tagName?.toLowerCase() || '';

  // Clone inherited styles for this branch
  const currentStyles: ParsedTextStyle = { ...inheritedStyles };

  // Apply tag-based styling
  switch (tagName) {
    case 'b':
    case 'strong':
      currentStyles.bold = true;
      break;
    case 'i':
    case 'em':
      currentStyles.italics = true;
      break;
    case 'u':
      currentStyles.underline = true;
      break;
    case 's':
    case 'strike':
    case 'del':
      currentStyles.strike = true;
      break;
    case 'br':
      runs.push(createLineBreak());
      return;
    case 'p':
    case 'div':
      // Add line break before block elements if we have content
      if (runs.length > 0) {
        runs.push(createLineBreak());
      }
      break;
    case 'li':
      // Add bullet point and line break for list items
      if (runs.length > 0) {
        runs.push(createLineBreak());
      }
      runs.push(
        new TextRun({
          text: '• ',
          font: FONTS.default,
          bold: currentStyles.bold,
          italics: currentStyles.italics,
          underline: currentStyles.underline ? {} : undefined,
          strike: currentStyles.strike,
          color: currentStyles.color,
        })
      );
      break;
  }

  // Extract color from inline styles or attributes
  const colorFromStyle = extractColorFromElement(element);
  if (colorFromStyle) {
    currentStyles.color = colorFromStyle;
  }

  // Process child nodes
  const childNodes = element.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    processNode(childNodes[i], currentStyles, runs);
  }

  // Add line break after certain block elements
  if (tagName === 'p' || tagName === 'div' || tagName === 'li') {
    if (runs.length > 0) {
      runs.push(createLineBreak());
    }
  }
}

function getActiveColumnConfigs(selectedColumns: string[]): ColumnConfig[] {
  return COLUMN_CONFIGS.filter((config) => selectedColumns.includes(config.key));
}

/**
 * Appends text content to runs, handling embedded newlines
 */
function appendTextWithLineBreaks(text: string, styles: ParsedTextStyle, runs: TextRun[]): void {
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (i > 0) {
      runs.push(createLineBreak());
    }

    const lineText = lines[i];
    if (lineText) {
      runs.push(
        new TextRun({
          text: lineText,
          font: FONTS.default,
          bold: styles.bold,
          italics: styles.italics,
          underline: styles.underline ? {} : undefined,
          strike: styles.strike,
          color: styles.color,
        })
      );
    }
  }
}

/**
 * Extracts color from element's style attribute or color attribute
 */
function extractColorFromElement(element: HTMLElement): string | undefined {
  // Check style attribute for color
  const style = element.getAttribute('style');
  if (style) {
    const colorMatch = style.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
    if (colorMatch) {
      const parsedColor = colorToHex(colorMatch[1].trim());
      if (parsedColor) return parsedColor;
    }
  }

  // Check color attribute (older HTML like <font color="...">)
  const colorAttr = element.getAttribute('color');
  if (colorAttr) {
    const parsedColor = colorToHex(colorAttr);
    if (parsedColor) return parsedColor;
  }

  return undefined;
}

async function fetchLogoAsArrayBuffer(logoUrl: string): Promise<ArrayBuffer | null> {
  if (!logoUrl) return null;

  try {
    const response = await fetch(logoUrl);
    if (!response.ok) {
      console.error(`Failed to fetch logo: ${response.status}`);
      return null;
    }
    return response.arrayBuffer();
  } catch (error) {
    console.error('Error fetching logo:', error);
    return null;
  }
}

function createDocumentHeader(
  tosohName: string,
  competitorName: string,
  competitorCompany: string,
  logoBuffer: ArrayBuffer | null
): Header {
  const comparisonText = competitorCompany
    ? `TOSOH: ${tosohName} vs ${competitorCompany}: ${competitorName}`
    : `TOSOH: ${tosohName} vs ${competitorName}`;

  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: NO_BORDERS,
        rows: [
          new TableRow({
            height: { value: DOCUMENT_DIMENSIONS.headerRowHeight, rule: 'exact' },
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      logoBuffer
                        ? new ImageRun({
                            data: logoBuffer,
                            transformation: {
                              width: DOCUMENT_DIMENSIONS.logoWidth,
                              height: DOCUMENT_DIMENSIONS.logoHeight,
                            },
                            type: 'png',
                          })
                        : new TextRun({ text: '' }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                width: {
                  size: DOCUMENT_DIMENSIONS.headerCellWidthPercentage,
                  type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
                borders: NO_BORDERS,
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: comparisonText,
                        bold: true,
                        size: FONT_SIZES.header,
                        color: COLORS.primary,
                        font: FONTS.default,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: DOCUMENT_DIMENSIONS.headerCellWidthPercentage,
                  type: WidthType.PERCENTAGE,
                },
                verticalAlign: VerticalAlign.CENTER,
                borders: NO_BORDERS,
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createBenefitsParagraphs(
  comparisonRow: CCTComparison | undefined,
  title: string,
  selectedColumns: string[]
): Paragraph[] {
  if (!comparisonRow) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({ text: title, bold: true, color: COLORS.primary, font: FONTS.default }),
      ],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: SPACING.large, after: SPACING.medium },
    }),
  ];

  const activeConfigs = getActiveColumnConfigs(selectedColumns);

  for (const config of activeConfigs) {
    const rawHtml = comparisonRow[config.key as keyof CCTComparison] as string;

    // Parse HTML content preserving formatting (colors, bold, etc.)
    const contentRuns = parseHtmlToTextRuns(rawHtml);

    if (contentRuns.length > 0) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${config.label}: `, bold: true, font: FONTS.default }),
            ...contentRuns,
          ],
          spacing: { after: SPACING.small },
        })
      );
    }
  }

  return paragraphs;
}

function createComparisonTable(
  comparisonRows: CCTComparison[],
  selectedColumns: string[]
): Table | null {
  if (!comparisonRows || comparisonRows.length === 0) return null;

  const activeConfigs = getActiveColumnConfigs(selectedColumns);
  const columnsForAllRoles = [
    { key: 'subcategory', label: 'Subcategory' },
    { key: 'description', label: 'Description' },
    { key: 'proof', label: 'Proof' },
  ];

  const tableWidth = DOCUMENT_DIMENSIONS.tableWidth;
  const fixedColumnWidth = Math.floor(tableWidth * COLUMN_RATIOS.fixedColumn);

  const proofColumn = 1;
  const dynamicColumnWidth = Math.floor(
    (tableWidth * COLUMN_RATIOS.dynamicColumns) / activeConfigs.length + proofColumn
  );

  const columnWidths = [
    // Category
    fixedColumnWidth,
    // Status
    fixedColumnWidth,
    // Subcategory
    fixedColumnWidth,
    // Description
    fixedColumnWidth,
    // Proof
    dynamicColumnWidth,
    ...activeConfigs.map(() => dynamicColumnWidth),
  ];

  const headerCell = (config: { key: string; label: string }) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: config.label, bold: true, font: FONTS.default })],
        }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: dynamicColumnWidth, type: WidthType.DXA },
    });

  const headerCells = [
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'Category', bold: true, font: FONTS.default })],
        }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: 'Status', bold: true, font: FONTS.default })],
        }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    ...columnsForAllRoles.map((config) => headerCell(config)),
    ...activeConfigs.map((config) => headerCell(config)),
  ];

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = comparisonRows.map((row) => {
    const statusColor = STATUS_COLORS[row.status?.name || ''] || COLORS.textMuted;
    const statusBackground = STATUS_BACKGROUNDS[row.status?.name || ''];
    const cellShading = statusBackground ? { fill: statusBackground } : undefined;

    const tableCell = (config: ColumnConfig) =>
      new TableCell({
        children: [
          new Paragraph({
            // Parse HTML preserving formatting (colors, bold, etc.)
            children: parseHtmlToTextRuns(row[config.key as keyof CCTComparison] as string),
          }),
        ],
        width: { size: dynamicColumnWidth, type: WidthType.DXA },
        shading: cellShading,
      });

    const cells = [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: row.category?.label || '', font: FONTS.default })],
          }),
        ],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
        shading: cellShading,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: row.status?.name || '',
                color: statusColor,
                font: FONTS.default,
              }),
            ],
          }),
        ],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
        shading: cellShading,
      }),
      ...columnsForAllRoles.map((config) => tableCell(config)),
      ...activeConfigs.map((config) => tableCell(config)),
    ];

    return new TableRow({ children: cells });
  });

  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: columnWidths,
    rows: [headerRow, ...dataRows],
    borders: LIGHT_BORDERS,
  });
}

function formatPrintDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateCCTDocument(
  docxLogo: { src: string; alt: string },
  tosohInstrument: Instrument | undefined,
  competitorInstrument: Instrument | undefined,
  comparisonRows: CCTComparison[],
  selectedColumns: string[]
): Promise<void> {
  const tosohName = tosohInstrument?.product_name || 'N/A';
  const competitorName = competitorInstrument?.product_name || 'N/A';
  const competitorCompany = competitorInstrument?.company?.label || '';

  const generalComparisonRow =
    comparisonRows?.find((row) => row.category.name === CATEGORY_NAMES.generalComparison) ?? null;

  const comparisonRowsWithoutGeneralComparison =
    comparisonRows?.filter((row) => row.category.name !== CATEGORY_NAMES.generalComparison) ?? [];

  const selectedColumnsWithCompetitorSuffix =
    selectedColumns?.map((column) => column + '_competitor') ?? [];

  const logoBuffer = docxLogo.src ? await fetchLogoAsArrayBuffer(docxLogo.src) : null;

  const children: (Paragraph | Table)[] = [
    // Print Date
    new Paragraph({
      children: [
        new TextRun({
          text: `Print Date: ${formatPrintDate()}`,
          size: FONT_SIZES.date,
          color: COLORS.textMuted,
          font: FONTS.default,
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: SPACING.medium },
    }),
    // Title
    new Paragraph({
      children: [
        new TextRun({ text: 'TOSOH: ', bold: true, color: COLORS.primary, font: FONTS.default }),
        new TextRun({ text: tosohName, bold: true, color: COLORS.primary, font: FONTS.default }),
        new TextRun({ text: ' vs ', italics: true, color: COLORS.primary, font: FONTS.default }),
        new TextRun({
          text: competitorCompany ? `${competitorCompany}: ${competitorName}` : competitorName,
          bold: true,
          font: FONTS.default,
          color: COLORS.primary,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: SPACING.large },
    }),
  ];

  // Tosoh Benefits Section
  if (tosohInstrument && generalComparisonRow && selectedColumns.length > 0) {
    children.push(
      ...createBenefitsParagraphs(generalComparisonRow, 'TOSOH Benefits Sum-Up', selectedColumns)
    );
  }

  // Competitor Benefits Section
  if (competitorInstrument && generalComparisonRow && selectedColumns.length > 0) {
    children.push(
      ...createBenefitsParagraphs(
        generalComparisonRow,
        'Competitor Benefits Sum-Up',
        selectedColumnsWithCompetitorSuffix
      )
    );
  }

  // Comparison Table Section
  if (
    comparisonRowsWithoutGeneralComparison &&
    comparisonRowsWithoutGeneralComparison.length > 0 &&
    selectedColumns.length > 0
  ) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Detailed Comparison',
            bold: true,
            color: COLORS.primary,
            font: FONTS.default,
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: SPACING.large, after: SPACING.medium },
      })
    );

    const table = createComparisonTable(comparisonRowsWithoutGeneralComparison, selectedColumns);
    if (table) {
      children.push(table);
    }
  }

  const document = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONTS.default,
          },
        },
        heading1: {
          run: {
            font: FONTS.default,
          },
        },
        heading2: {
          run: {
            font: FONTS.default,
          },
        },
      },
    },
    sections: [
      {
        headers: {
          default: createDocumentHeader(tosohName, competitorName, competitorCompany, logoBuffer),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  const filename = `CCT_Comparison_${tosohName}_vs_${competitorName}.docx`.replace(/\s+/g, '_');
  saveAs(blob, filename);
}
