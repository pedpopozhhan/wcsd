import { IRowIndicator } from '@/interfaces/common/row-indicator.interface';
export interface IContractSearchResult extends IRowIndicator {
  index: number;
  vendorName: string;
  businessId: number;
  contractId: number;
  contractNumber: string;
  contractType: string;
  downloadsAvailable: number;
  pendingApprovals: number;
}
