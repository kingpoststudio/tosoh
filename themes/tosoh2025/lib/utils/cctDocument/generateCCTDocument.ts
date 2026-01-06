import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, Table, TextRun } from 'docx';
import { saveAs } from 'file-saver';

import type { Instrument } from '../../../types/cctDocuments';
import type { CCTComparison } from '../../../types/competitiveComparisonTool';
import { CATEGORY_NAMES, COLORS, FONTS, FONT_SIZES, SPACING } from './constants';
import {
  createBenefitsParagraphs,
  createComparisonTable,
  createDocumentHeader,
  fetchLogoAsArrayBuffer,
  formatPrintDate,
} from './documentComponents';

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
