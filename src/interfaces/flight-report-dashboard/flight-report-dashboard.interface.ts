import { IRowIndicator } from '@/interfaces/common/row-indicator.interface';
export interface IFlightReportDashboard extends IRowIndicator {
  flightReportDashboardId: string;
  flightReportId?: number;
  corporateRegionId?: string;
  corporateRegionName?: string;
  contractRegistrationId?: number;
  contractRegistrationName?: string;
  vendorId?: string;
  vendorName?: string;
  contractId?: number;
  contractType?: string;
  financeVendorId?: string;
  flightReportDate?: string;
  ao02Number?: string;
  status?: string;
  totalCost: number;
  remainingCost: number;
}
