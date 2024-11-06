
export interface IInvoiceListSearchResult {
  // index: number;
  invoiceId: string;
  invoiceNumber: string;
  invoiceAmount: number;
  invoiceDate: string;
  invoiceReceivedDate: string;
  invoiceStatus: string;
  vendorBusinessId: string;
  vendorName: string;
  uniqueServiceSheetName: string;
  invoiceAge: number;
}

export interface IInvoiceListSearchResultResponse {
  invoiceList: IInvoiceListSearchResult[];
}


