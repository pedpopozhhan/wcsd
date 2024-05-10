import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';

export interface IProcessedInvoiceData {
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
  invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
  uniqueServiceSheetName: string;
  purchaseGroup: string;
  serviceDescription: string;
  communityCode: string;
  materialGroup: string;
  accountType: string;
  quantity: number;
  unitOfMeasure: string;
  price: number;
  createdBy: string;
}
