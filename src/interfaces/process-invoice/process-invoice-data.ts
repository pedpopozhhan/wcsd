import { ITimeReportDetailsTableRowData } from '../invoice-details/time-report-details-table-row-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { IServiceSheetData } from '@/interfaces/common/service-sheet-data';

export interface IProcessInvoiceData {
  invoiceKey?: number;
  invoiceId: string;
  invoiceDate: Date;
  invoiceAmount: number;
  periodEndDate: Date;
  invoiceReceivedDate: Date;
  vendor: string;
  assignedTo: string;
  contractNumber: string;
  type: string;
  createdBy?: string;
  createdByDateTime? : Date;
  updatedBy?: string;
  updatedByDateTime?: Date;
  invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
  invoiceServiceSheet?: IServiceSheetData;
}
