import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

export interface IProcessInvoiceData {
  invoiceId?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceAmount: number;
  periodEndDate: Date;
  invoiceReceivedDate: Date;
  vendor: string;
  assignedTo: string;
  contractNumber: string;
  type: string;
  uniqueServiceSheetName: string;
  purchaseGroup?: string;
  serviceDescription?: string;
  communityCode?: string;
  materialGroup?: string;
  accountType?: string;
  quantity?: number;
  unitOfMeasure?: string;
  price?: number;
  invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
}
