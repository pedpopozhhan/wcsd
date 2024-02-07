import { IDetailsTableRowData } from '../invoice-details/details-table-row-data';
import { IOtherCostTableRowData } from '../invoice-details/other-cost-table-row-data';
import { IServiceSheetData } from './service-sheet-data';

export interface IProcessInvoiceData {
  invoiceKey?: number;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceAmount: number;
  periodEndDate: Date;
  invoiceReceivedDate: Date;
  vendor: string;
  assignedTo: string;
  contractNumber: string;
  type: string;
  createdBy: string;
  invoiceTimeReportCostDetails : IDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
  invoiceServiceSheet?: IServiceSheetData;
}
