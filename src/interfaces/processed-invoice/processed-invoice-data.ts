import { ITimeReportDetailsTableRowData } from '../invoice-details/time-report-details-table-row-data';
import { IOtherCostTableRowData } from '../invoice-details/other-cost-table-row-data';
import { IServiceSheetData } from '../process-invoice/service-sheet-data';

export interface IProcessedInvoiceData {
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
    createdBy: string;
    invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
    invoiceOtherCostDetails: IOtherCostTableRowData[];
    invoiceServiceSheet?: IServiceSheetData;
}