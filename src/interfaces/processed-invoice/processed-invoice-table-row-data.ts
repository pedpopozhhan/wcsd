import { IServiceSheetData } from "@/interfaces/common/service-sheet-data";

export interface IProcessedInvoiceTableRowData {
    invoiceKey: number;
    invoiceId: string;
    invoiceAmount: number;
    invoiceDate: Date;
    periodEndDate: Date;
    invoiceReceivedDate: Date;
    vendor: string;
    assignedTo: string;
    contractNumber: string;
    type: string;
    createdBy: string;
    paymentStatus: string;
    invoiceServiceSheet: IServiceSheetData;
}