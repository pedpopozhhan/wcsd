export interface IFlightReportDashboard {
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
  isInUse: boolean;
  totalCost: number;
  remainingCost: number;
}
