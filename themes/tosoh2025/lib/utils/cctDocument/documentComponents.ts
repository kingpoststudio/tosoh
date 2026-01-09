import {
  AlignmentType,
  Header,
  HeadingLevel,
  ImageRun,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from 'docx';

import type { ColumnConfig } from '../../../types/cctDocuments';
import type { CCTComparison } from '../../../types/competitiveComparisonTool';
import {
  COLORS,
  COLUMN_CONFIGS,
  COLUMN_RATIOS,
  DOCUMENT_DIMENSIONS,
  FONTS,
  FONT_SIZES,
  LIGHT_BORDERS,
  NO_BORDERS,
  SPACING,
  STATUS_BACKGROUNDS,
  STATUS_COLORS,
} from './constants';
import { parseHtmlToTextRuns } from './htmlParser';

/**
 * Fetches logo image as ArrayBuffer for embedding in document
 */
export async function fetchLogoAsArrayBuffer(logoUrl: string): Promise<ArrayBuffer | null> {
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

/**
 * Filters column configs based on selected columns
 */
export function getActiveColumnConfigs(selectedColumns: string[]): ColumnConfig[] {
  return COLUMN_CONFIGS.filter((config) => selectedColumns.includes(config.key));
}

/**
 * Creates the document header with logo and comparison title
 */
export function createDocumentHeader(
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

/**
 * Creates benefit paragraphs section for Tosoh or Competitor
 */
export function createBenefitsParagraphs(
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

/**
 * Creates the detailed comparison table
 */
export function createComparisonTable(
  comparisonRows: CCTComparison[],
  selectedColumns: string[]
): Table | null {
  if (!comparisonRows || comparisonRows.length === 0) return null;

  const activeConfigs = getActiveColumnConfigs(selectedColumns);
  const columnsForAllRoles = [
    { key: 'sub_category', label: 'Subcategory' },
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

  const headerCell = (config: { key: string; label: string }, width: number) =>
    new TableCell({
      children: [
        new Paragraph({
          children: [new TextRun({ text: config.label, bold: true, font: FONTS.default })],
        }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: width, type: WidthType.DXA },
    });

  const headerCells = [
    headerCell({ key: 'category', label: 'Category' }, fixedColumnWidth),
    headerCell({ key: 'status', label: 'Status' }, fixedColumnWidth),
    ...columnsForAllRoles.map((config) => headerCell(config, dynamicColumnWidth)),
    ...activeConfigs.map((config) => headerCell(config, dynamicColumnWidth)),
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

/**
 * Formats the current date for the print date display
 */
export function formatPrintDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
