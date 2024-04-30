export interface IProcessedInvoiceTableRowData {
  invoiceId: string;
  invoiceNumber: string;
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
  uniqueServiceSheetName: string,
  purchaseGroup: string,
  serviceDescription: string,
  communityCode: string,
  materialGroup: string,
  accountType: string,
  quantity: number,
  unitOfMeasure: string,
  price: number
  chargeExtractId: string
  transferDate: Date
}
