/**
 * Table filtering utilities for showing/hiding table rows based on ID matching
 */

export interface TableFilterOptions {
  tableSelector?: string;
}

export class TableFilterManager {
  private tableElement: HTMLTableElement | null = null;
  private options: Required<TableFilterOptions>;

  constructor(tableElement: HTMLTableElement | string) {
    this.options = {
      tableSelector: 'table',
    };

    if (typeof tableElement === 'string') {
      this.tableElement = document.querySelector(tableElement);
    } else {
      this.tableElement = tableElement;
    }

    if (!this.tableElement) {
      console.warn('TableFilterManager: Table element not found');
    }
  }

  /**
   * Filter table rows to show only the ones matching the given ID
   * @param targetId - The ID to match against. If null/empty, shows all rows
   */
  filterById(targetId: string | null): void {
    if (!this.tableElement) {
      console.warn('TableFilterManager: No table element available');
      return;
    }

    const rows = this.tableElement.querySelectorAll('tr[id]');

    rows.forEach((row) => {
      const rowId = row.id;

      if (!targetId || targetId.trim() === '') {
        // Show all rows if no target ID
        row.classList.remove('hidden!');
      } else if (rowId === targetId) {
        // Show matching rows
        row.classList.remove('hidden!');
      } else {
        // Hide non-matching rows
        row.classList.add('hidden!');
      }
    });
  }

  /**
   * Clear all filters and show all rows
   */
  clearFilters(): void {
    if (!this.tableElement) return;

    const rows = this.tableElement.querySelectorAll('tr[id]');
    rows.forEach((row) => {
      row.classList.remove('hidden!');
    });
  }

  /**
   * Get all available IDs in the table
   */
  getAvailableIds(): string[] {
    if (!this.tableElement) return [];

    const rows = this.tableElement.querySelectorAll('tr[id]');
    const ids: string[] = [];

    rows.forEach((row) => {
      const id = row.id;
      if (id && !ids.includes(id)) {
        ids.push(id);
      }
    });

    return ids;
  }

  /**
   * Update the table element reference
   */
  updateTable(tableElement: HTMLTableElement | string): void {
    if (typeof tableElement === 'string') {
      this.tableElement = document.querySelector(tableElement);
    } else {
      this.tableElement = tableElement;
    }
  }
}

/**
 * Simple function to filter table rows by ID
 * @param tableSelector - CSS selector for the table
 * @param targetId - ID to filter by (null/empty shows all)
 * @param options - Additional options
 */
export function filterTableById(tableSelector: string, targetId: string | null): void {
  const table = document.querySelector(tableSelector) as HTMLTableElement;
  if (!table) {
    console.warn(`Table not found with selector: ${tableSelector}`);
    return;
  }

  const manager = new TableFilterManager(table);
  manager.filterById(targetId);
}

/**
 * Clear filters from a table
 * @param tableSelector - CSS selector for the table
 * @param options - Additional options
 */
export function clearTableFilters(tableSelector: string): void {
  const table = document.querySelector(tableSelector) as HTMLTableElement;
  if (!table) {
    console.warn(`Table not found with selector: ${tableSelector}`);
    return;
  }

  const manager = new TableFilterManager(table);
  manager.clearFilters();
}
