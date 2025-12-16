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

interface Instrument {
  product_name: string;
  company?: { label: string; name: string };
  lab_man_benefits?: string;
  lab_staff_benefits?: string;
  clinician_benefits?: string;
  procurement_benefits?: string;
}

interface ComparisonRow {
  category: { label: string; name: string };
  status: { label: string; name: string };
  lab_manager?: string;
  lab_technician?: string;
  procurement_manager?: string;
  clinician?: string;
}

interface ColumnConfig {
  key: string;
  label: string;
  benefitKey?: string;
}

const COLORS = {
  primary: 'ED1A3B',
  textMuted: '6A7282',
  advantage: '00C950',
  disadvantage: 'FF4444',
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

const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: 'lab_manager', label: 'Lab Manager', benefitKey: 'lab_man_benefits' },
  { key: 'lab_technician', label: 'Lab Technician', benefitKey: 'lab_staff_benefits' },
  { key: 'procurement_manager', label: 'Procurement Manager', benefitKey: 'procurement_benefits' },
  { key: 'clinician', label: 'Clinician', benefitKey: 'clinician_benefits' },
];

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
                        font: 'Arial',
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

function stripHtml(html: string | undefined): string {
  if (!html) return '';

  let text = html.replace(/NEWLINE/g, '\n');

  const hasHtmlTags = /<[^>]+>/.test(text);

  if (hasHtmlTags) {
    text = text
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<\/li>/gi, '\n');

    const doc = new DOMParser().parseFromString(text, 'text/html');
    text = doc.body.textContent || '';
  }

  return text.replace(/\n{3,}/g, '\n\n').trim();
}

function createTextRunsWithBreaks(
  text: string,
  options: { bold?: boolean; font?: string } = {}
): TextRun[] {
  if (!text) return [];

  const lines = text.split('\n');
  const runs: TextRun[] = [];

  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i] || '';

    if (i > 0) {
      runs.push(new TextRun({ ...options, text: '', break: 1 }));
    }

    if (lineText) {
      runs.push(new TextRun({ ...options, text: lineText }));
    }
  }

  return runs;
}

function createBenefitsParagraphs(
  instrument: Instrument | undefined,
  title: string,
  selectedColumns: string[]
): Paragraph[] {
  if (!instrument) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: COLORS.primary, font: 'Arial' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: SPACING.large, after: SPACING.medium },
    }),
  ];

  const activeConfigs = COLUMN_CONFIGS.filter((config) => selectedColumns.includes(config.key));

  for (const config of activeConfigs) {
    const benefitKey = config.benefitKey as keyof Instrument;
    const benefitText = stripHtml(instrument[benefitKey] as string);

    if (benefitText) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${config.label}: `, bold: true, font: 'Arial' }),
            ...createTextRunsWithBreaks(benefitText, { font: 'Arial' }),
          ],
          spacing: { after: SPACING.small },
        })
      );
    }
  }

  return paragraphs;
}

function createComparisonTable(
  comparisonRows: ComparisonRow[],
  selectedColumns: string[]
): Table | null {
  if (!comparisonRows || comparisonRows.length === 0) return null;

  const activeConfigs = COLUMN_CONFIGS.filter((config) => selectedColumns.includes(config.key));

  const tableWidth = DOCUMENT_DIMENSIONS.tableWidth;
  const fixedColumnWidth = Math.floor(tableWidth * COLUMN_RATIOS.fixedColumn);
  const dynamicColumnWidth = Math.floor(
    (tableWidth * COLUMN_RATIOS.dynamicColumns) / activeConfigs.length
  );

  const columnWidths = [
    fixedColumnWidth,
    fixedColumnWidth,
    ...activeConfigs.map(() => dynamicColumnWidth),
  ];

  const headerCells = [
    new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: 'Category', bold: true, font: 'Arial' })] }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    new TableCell({
      children: [
        new Paragraph({ children: [new TextRun({ text: 'Status', bold: true, font: 'Arial' })] }),
      ],
      shading: { fill: COLORS.headerBackground },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    ...activeConfigs.map(
      (config) =>
        new TableCell({
          children: [
            new Paragraph({
              children: [new TextRun({ text: config.label, bold: true, font: 'Arial' })],
            }),
          ],
          shading: { fill: COLORS.headerBackground },
          width: { size: dynamicColumnWidth, type: WidthType.DXA },
        })
    ),
  ];

  const headerRow = new TableRow({ children: headerCells });

  const dataRows = comparisonRows.map((row) => {
    const statusColor = STATUS_COLORS[row.status?.name] || COLORS.textMuted;

    const cells = [
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: row.category?.label || '', font: 'Arial' })],
          }),
        ],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: row.status?.name || '', color: statusColor, font: 'Arial' }),
            ],
          }),
        ],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
      }),
      ...activeConfigs.map(
        (config) =>
          new TableCell({
            children: [
              new Paragraph({
                children: createTextRunsWithBreaks(
                  stripHtml(row[config.key as keyof ComparisonRow] as string),
                  { font: 'Arial' }
                ),
              }),
            ],
            width: { size: dynamicColumnWidth, type: WidthType.DXA },
          })
      ),
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
  comparisonRows: ComparisonRow[],
  selectedColumns: string[]
): Promise<void> {
  const tosohName = tosohInstrument?.product_name || 'N/A';
  const competitorName = competitorInstrument?.product_name || 'N/A';
  const competitorCompany = competitorInstrument?.company?.label || '';

  // Fetch the logo for the header

  let logoBuffer = null;
  if (docxLogo.src) {
    logoBuffer = await fetchLogoAsArrayBuffer(docxLogo.src);
  }

  const children: (Paragraph | Table)[] = [
    // Print Date
    new Paragraph({
      children: [
        new TextRun({
          text: `Print Date: ${formatPrintDate()}`,
          size: FONT_SIZES.date,
          color: COLORS.textMuted,
          font: 'Arial',
        }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: SPACING.medium },
    }),
    // Title
    new Paragraph({
      children: [
        new TextRun({ text: 'TOSOH: ', bold: true, color: COLORS.primary, font: 'Arial' }),
        new TextRun({ text: tosohName, bold: true, color: COLORS.primary, font: 'Arial' }),
        new TextRun({ text: ' vs ', italics: true, color: COLORS.primary, font: 'Arial' }),
        new TextRun({
          text: competitorCompany ? `${competitorCompany}: ${competitorName}` : competitorName,
          bold: true,
          font: 'Arial',
          color: COLORS.primary,
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: SPACING.large },
    }),
  ];

  // Tosoh Benefits Section
  if (tosohInstrument && selectedColumns.length > 0) {
    children.push(
      ...createBenefitsParagraphs(tosohInstrument, 'TOSOH Benefits Summary', selectedColumns)
    );
  }

  // Competitor Benefits Section
  if (competitorInstrument && selectedColumns.length > 0) {
    children.push(
      ...createBenefitsParagraphs(
        competitorInstrument,
        'Competitor Benefits Summary',
        selectedColumns
      )
    );
  }

  // Comparison Table Section
  if (comparisonRows && comparisonRows.length > 0 && selectedColumns.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Detailed Comparison',
            bold: true,
            color: COLORS.primary,
            font: 'Arial',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: SPACING.large, after: SPACING.medium },
      })
    );

    const table = createComparisonTable(comparisonRows, selectedColumns);
    if (table) {
      children.push(table);
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Arial',
          },
        },
        heading1: {
          run: {
            font: 'Arial',
          },
        },
        heading2: {
          run: {
            font: 'Arial',
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

  const blob = await Packer.toBlob(doc);
  const filename = `CCT_Comparison_${tosohName}_vs_${competitorName}.docx`.replace(/\s+/g, '_');
  saveAs(blob, filename);
}
