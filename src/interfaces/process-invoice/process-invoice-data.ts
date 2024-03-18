import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

export interface IProcessInvoiceData {
  invoiceId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  periodEndDate: string;
  invoiceReceivedDate: string;
  vendorBusinessId: string;
  vendorName: string;
  assignedTo: string;
  contractNumber: string;
  type: string;
  uniqueServiceSheetName: string;
  invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
}
