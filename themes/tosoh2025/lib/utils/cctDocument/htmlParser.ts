import { TextRun } from 'docx';

import { FONTS, HEX_COLOR, NAMED_COLORS } from './constants';

interface ParsedTextStyle {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  listDepth?: number;
}

/**
 * Creates a TextRun representing a line break
 */
export function createLineBreak(): TextRun {
  return new TextRun({ text: '', break: 1, font: FONTS.default });
}

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
      // Increment list depth for nested lists
      currentStyles.listDepth = (currentStyles.listDepth || 0) + 1;
      // Calculate indentation based on nesting depth (4 spaces per level)
      const indent = '    '.repeat(currentStyles.listDepth);
      runs.push(
        new TextRun({
          text: `${indent}• `,
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
