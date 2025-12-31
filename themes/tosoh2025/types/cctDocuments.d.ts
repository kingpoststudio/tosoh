import type { CCTForeignId } from '../../types/competitiveComparisonTool';

export interface Instrument {
  product_name: string;
  company?: { label: string; name: string };
}

export interface ColumnConfig {
  key: string;
  label: string;
  benefitKey?: string;
}
