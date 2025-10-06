/**
 * Text search and highlighting utilities for table content
 */

export interface SearchMatch {
  element: HTMLElement;
  originalText: string;
  index: number;
}

export class TextSearchManager {
  private matches: SearchMatch[] = [];
  private currentMatchIndex = 0;
  private searchTerm = '';
  private targetSelector: string;

  constructor(targetSelector: string = 'table tbody') {
    this.targetSelector = targetSelector;
  }

  /**
   * Search for text within the target element and highlight matches
   */
  search(searchTerm: string): number {
    this.clearHighlights();
    this.searchTerm = searchTerm.trim().toLowerCase();

    if (!this.searchTerm) {
      return 0;
    }

    const targetElement = document.querySelector(this.targetSelector);
    if (!targetElement) {
      return 0;
    }

    this.findAndHighlightMatches(targetElement);

    if (this.matches.length > 0) {
      this.focusOnMatch(0, false);
    }

    return this.matches.length;
  }

  /**
   * Navigate to the next match
   */
  nextMatch(): void {
    if (this.matches.length === 0) return;

    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matches.length;
    this.focusOnMatch(this.currentMatchIndex);
  }

  /**
   * Navigate to the previous match
   */
  previousMatch(): void {
    if (this.matches.length === 0) return;

    this.currentMatchIndex =
      this.currentMatchIndex === 0 ? this.matches.length - 1 : this.currentMatchIndex - 1;
    this.focusOnMatch(this.currentMatchIndex);
  }

  /**
   * Clear all highlights and reset state
   */
  clearHighlights(): void {
    // First approach: remove highlight elements and normalize parents
    document.querySelectorAll('.search-highlight, .search-highlight-current').forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        // Replace highlight with its text content
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      }
    });

    // Normalize all text nodes in the target container to merge fragmented text
    const targetElement = document.querySelector(this.targetSelector);
    if (targetElement) {
      this.normalizeTextNodes(targetElement);
    }

    this.matches = [];
    this.currentMatchIndex = 0;
  }

  /**
   * Get current match info
   */
  getCurrentMatchInfo(): { current: number; total: number } {
    return {
      current: this.matches.length > 0 ? this.currentMatchIndex + 1 : 0,
      total: this.matches.length,
    };
  }

  private findAndHighlightMatches(container: Element): void {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        if (
          node.parentElement?.classList.contains('search-highlight') ||
          node.parentElement?.classList.contains('search-highlight-current')
        ) {
          return NodeFilter.FILTER_REJECT;
        }

        // Skip if any ancestor element has the 'hidden' class
        let currentElement = node.parentElement;
        while (currentElement && currentElement !== container) {
          if (currentElement.classList.contains('hidden!')) {
            return NodeFilter.FILTER_REJECT;
          }
          currentElement = currentElement.parentElement;
        }

        // Only process text nodes with content
        return node.textContent && node.textContent.trim().length > 0
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes: Text[] = [];
    let node: Node | null;

    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    textNodes.forEach((textNode) => {
      this.highlightTextNode(textNode);
    });
  }

  private highlightTextNode(textNode: Text): void {
    const text = textNode.textContent || '';
    const lowerText = text.toLowerCase();
    const searchTerm = this.searchTerm;

    let startIndex = 0;
    const fragments: (Text | HTMLElement)[] = [];

    while (true) {
      const matchIndex = lowerText.indexOf(searchTerm, startIndex);
      if (matchIndex === -1) {
        // Add remaining text
        if (startIndex < text.length) {
          fragments.push(document.createTextNode(text.slice(startIndex)));
        }
        break;
      }

      // Add text before match
      if (matchIndex > startIndex) {
        fragments.push(document.createTextNode(text.slice(startIndex, matchIndex)));
      }

      // Create highlight element
      const highlight = document.createElement('mark');
      highlight.className = 'search-highlight';
      highlight.textContent = text.slice(matchIndex, matchIndex + searchTerm.length);

      this.matches.push({
        element: highlight,
        originalText: text.slice(matchIndex, matchIndex + searchTerm.length),
        index: this.matches.length,
      });

      fragments.push(highlight);
      startIndex = matchIndex + searchTerm.length;
    }

    // Replace the original text node with fragments
    if (fragments.length > 1) {
      const parent = textNode.parentNode;
      if (parent) {
        fragments.forEach((fragment) => {
          parent.insertBefore(fragment, textNode);
        });
        parent.removeChild(textNode);
      }
    }
  }

  private focusOnMatch(index: number, shouldScrollIntoView: boolean = true): void {
    if (index < 0 || index >= this.matches.length) return;

    // Remove current highlight from all matches
    this.matches.forEach((match, i) => {
      match.element.className = i === index ? 'search-highlight-current' : 'search-highlight';
    });

    const currentMatch = this.matches[index];

    if (shouldScrollIntoView) {
      // Scroll to the match
      currentMatch.element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });

      // Focus the element for accessibility
      currentMatch.element.setAttribute('tabindex', '-1');
      currentMatch.element.focus();
    }
  }

  /**
   * Normalize text nodes in a container to merge fragmented text
   */
  private normalizeTextNodes(container: Element): void {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);

    const parents = new Set<Node>();
    let node: Node | null;

    // Collect all parent elements that contain text nodes
    while ((node = walker.nextNode())) {
      if (node.parentNode) {
        parents.add(node.parentNode);
      }
    }

    // Normalize each parent to merge adjacent text nodes
    parents.forEach((parent) => {
      parent.normalize();
    });
  }
}

// Global instance for the CCT details page
export const tableSearchManager = new TextSearchManager('table tbody');
