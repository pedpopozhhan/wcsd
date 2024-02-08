export interface IProcessedInvoiceTableRowData {
    invoiceId: number;
    invoiceNumber: string;
    invoiceAmount: number;
    invoiceDate: Date;
    periodEndDate: Date;
    invoiceReceivedDate: Date;
    vendor: string;
    assignedTo: string;
    vontractNumber: string;
    type: string;
    createdBy: string;
    paymentStatus: string;
}