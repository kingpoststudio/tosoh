import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  Header,
  ImageRun,
  VerticalAlign,
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

const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: 'lab_manager', label: 'Lab Manager', benefitKey: 'lab_man_benefits' },
  { key: 'lab_technician', label: 'Lab Technician', benefitKey: 'lab_staff_benefits' },
  { key: 'procurement_manager', label: 'Procurement Manager', benefitKey: 'procurement_benefits' },
  { key: 'clinician', label: 'Clinician', benefitKey: 'clinician_benefits' },
];

const TOSOH_LOGO_URL =
  'https://145184808.fs1.hubspotusercontent-eu1.net/hubfs/145184808/image%202-1.png';

async function fetchLogoAsArrayBuffer(): Promise<ArrayBuffer> {
  const response = await fetch(TOSOH_LOGO_URL);
  return response.arrayBuffer();
}

const totalTableWidth = 9360;

function createDocumentHeader(
  logoBuffer: ArrayBuffer,
  tosohName: string,
  competitorName: string,
  competitorCompany: string
): Header {
  const comparisonText = competitorCompany
    ? `TOSOH: ${tosohName} vs ${competitorCompany}: ${competitorName}`
    : `TOSOH: ${tosohName} vs ${competitorName}`;

  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
        rows: [
          new TableRow({
            height: { value: 1080, rule: 'exact' },
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new ImageRun({
                        data: logoBuffer,
                        transformation: { width: 58, height: 64 },
                        type: 'png',
                      }),
                    ],
                    alignment: AlignmentType.LEFT,
                  }),
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: comparisonText,
                        bold: true,
                        size: 24,
                        color: 'ED1A3B',
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                verticalAlign: VerticalAlign.CENTER,
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE },
                },
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
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

function createBenefitsParagraphs(
  instrument: Instrument | undefined,
  title: string,
  selectedColumns: string[]
): Paragraph[] {
  if (!instrument) return [];

  const paragraphs: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: title, bold: true, color: 'ED1A3B' })],
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
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
            new TextRun({ text: `${config.label}: `, bold: true }),
            new TextRun({ text: benefitText }),
          ],
          spacing: { after: 120 },
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

  // Page content width in DXA (twips): 8.5" page - 1" margins each side = 6.5" = 9360 DXA
  // Fixed columns (Category, Status) get 15% each, dynamic columns share the rest (70%)
  const fixedColumnWidth = Math.floor(totalTableWidth * 0.15);
  const dynamicColumnWidth = Math.floor((totalTableWidth * 0.7) / activeConfigs.length);

  // Build column widths array for the table
  const columnWidths = [
    fixedColumnWidth,
    fixedColumnWidth,
    ...activeConfigs.map(() => dynamicColumnWidth),
  ];

  // Header row
  const headerCells = [
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'Category', bold: true })] })],
      shading: { fill: 'E5E5E5' },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text: 'Status', bold: true })] })],
      shading: { fill: 'E5E5E5' },
      width: { size: fixedColumnWidth, type: WidthType.DXA },
    }),
    ...activeConfigs.map(
      (config) =>
        new TableCell({
          children: [
            new Paragraph({ children: [new TextRun({ text: config.label, bold: true })] }),
          ],
          shading: { fill: 'E5E5E5' },
          width: { size: dynamicColumnWidth, type: WidthType.DXA },
        })
    ),
  ];

  const headerRow = new TableRow({ children: headerCells });

  // Data rows
  const dataRows = comparisonRows.map((row) => {
    const statusColor =
      row.status?.name === 'Advantage'
        ? '00C950'
        : row.status?.name === 'Disadvantage'
          ? 'FF4444'
          : '6A7282';

    const cells = [
      new TableCell({
        children: [new Paragraph({ text: row.category?.label || '' })],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [new TextRun({ text: row.status?.name || '', color: statusColor })],
          }),
        ],
        width: { size: fixedColumnWidth, type: WidthType.DXA },
      }),
      ...activeConfigs.map(
        (config) =>
          new TableCell({
            children: [
              new Paragraph({ text: stripHtml(row[config.key as keyof ComparisonRow] as string) }),
            ],
            width: { size: dynamicColumnWidth, type: WidthType.DXA },
          })
      ),
    ];

    return new TableRow({ children: cells });
  });

  return new Table({
    width: { size: totalTableWidth, type: WidthType.DXA },
    columnWidths: columnWidths,
    rows: [headerRow, ...dataRows],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
    },
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
  tosohInstrument: Instrument | undefined,
  competitorInstrument: Instrument | undefined,
  comparisonRows: ComparisonRow[],
  selectedColumns: string[]
): Promise<void> {
  const tosohName = tosohInstrument?.product_name || 'N/A';
  const competitorName = competitorInstrument?.product_name || 'N/A';
  const competitorCompany = competitorInstrument?.company?.label || '';

  // Fetch the logo for the header
  const logoBuffer = await fetchLogoAsArrayBuffer();

  const children: (Paragraph | Table)[] = [
    // Print Date
    new Paragraph({
      children: [
        new TextRun({ text: `Print Date: ${formatPrintDate()}`, size: 20, color: '6A7282' }),
      ],
      alignment: AlignmentType.RIGHT,
      spacing: { after: 200 },
    }),
    // Title
    new Paragraph({
      children: [
        new TextRun({ text: 'TOSOH: ', bold: true, color: 'ED1A3B' }),
        new TextRun({ text: tosohName, bold: true, color: 'ED1A3B' }),
        new TextRun({ text: ' vs ', italics: true, color: 'ED1A3B' }),
        new TextRun({
          text: competitorCompany ? `${competitorCompany}: ${competitorName}` : competitorName,
          bold: true,
          color: 'ED1A3B',
        }),
      ],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
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
        children: [new TextRun({ text: 'Detailed Comparison', bold: true, color: 'ED1A3B' })],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
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
          default: createDocumentHeader(logoBuffer, tosohName, competitorName, competitorCompany),
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `CCT_Comparison_${tosohName}_vs_${competitorName}.docx`.replace(/\s+/g, '_');
  saveAs(blob, filename);
}
