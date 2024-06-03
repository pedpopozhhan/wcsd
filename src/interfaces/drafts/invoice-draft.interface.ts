export interface IInvoiceDraft {
  invoiceId: string;
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDate: Date;
}
export interface IInvoiceDraftResponse {
  invoiceDrafts: IInvoiceDraft[];
}

export interface IInvoiceDraftRequest {
  contractNumber: string;
}
