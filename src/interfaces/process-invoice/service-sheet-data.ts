export interface IServiceSheetData {
  uniqueServiceSheetName: string,
  purchaseGroup: string,
  serviceDescription: string,
  communityCode: string,
  materialGroup: string,
  accountType: string,
  quantity: number,
  unitOfMeasure: string,
  price: number,
  invoiceKey?: number,
  createdBy?: string,
  createdByDateTime? : Date,
  updatedBy?: string,
  updatedByDateTime?: Date
}
