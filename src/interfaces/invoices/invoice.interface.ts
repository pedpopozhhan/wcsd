// import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
// import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';

// export enum InvoiceStatus {
//   Draft = 'Draft',
//   Processed = 'Processed',
//   DraftDeleted = 'DraftDeleted',
//   ProcessedDeleted = 'ProcessedDeleted',
// }
// export interface IInvoiceRequest {
//   contractNumber: string;
// }

// export interface IInvoice {
//   invoiceId: string;
//   invoiceNumber: string;
//   invoiceAmount: number;
//   invoiceDate: string;
//   periodEndDate: string;
//   invoiceReceivedDate: string;
//   paymentStatus: string;
//   invoiceStatus: InvoiceStatus;
//   vendorBusinessId: string;
//   vendorName: string;
//   contractNumber: string;
//   type: string;
//   uniqueServiceSheetName: string;
//   serviceDescription: string;
//   createdBy: string;
//   createdByDateTime: string;
//   updatedBy: string;
//   updatedByDateTime: string;
//   chargeExtractId: string;
//   documentDate: string;
//   invoiceTimeReportCostDetails: ITimeReportDetailsTableRowData[];
//   invoiceOtherCostDetails: IOtherCostTableRowData[];
// }

// export interface IInvoiceDraft extends IInvoice {
//   flightReportIds: number[];
// }
// export interface IInvoiceResponse {
//   invoices: IInvoice[];
// }
