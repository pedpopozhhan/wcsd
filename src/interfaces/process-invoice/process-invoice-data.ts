import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

export enum InvoiceStatus {
  Draft = 'Draft',
  Processed = 'Processed',
  DraftDeleted = 'DraftDeleted',
  ProcessedDeleted = 'ProcessedDeleted',
}

export interface IInvoiceRequest {
  contractNumber: string;
}

export interface IInvoiceResponse {
  invoices: IInvoice[];
}
export interface IInvoiceTimeReports {
  invoiceTimeReportId: string;
  invoiceId: string;
  flightReportId: number;
  auditCreationDateTime: string;
  auditLastUpdatedBy: string;
  auditLastUpdatedDateTime: string;
}
export interface IProcessInvoiceData {
  invoiceId?: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  periodEndDate: string;
  invoiceReceivedDate: string;
  vendorBusinessId: string;
  vendorName: string;
  contractNumber: string;
  type: string;
  uniqueServiceSheetName: string;
  serviceDescription: string;
  invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
  invoiceOtherCostDetails: IOtherCostTableRowData[];
  flightReportIds: number[];
}

export interface IInvoice extends IProcessInvoiceData {
  paymentStatus: string;
  invoiceStatus: InvoiceStatus;
  createdBy: string;
  createdByDateTime: string;
  updatedBy: string;
  updatedByDateTime: string;
  chargeExtractId: string;
  documentDate: string;
  invoiceTimeReports: IInvoiceTimeReports[];
}
