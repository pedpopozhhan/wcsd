import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { IRowIndicator } from '@/interfaces/common/row-indicator.interface';

export default interface IOtherCostTableRow extends IRowIndicator {
  index: number;
  data: IOtherCostTableRowData;
}
