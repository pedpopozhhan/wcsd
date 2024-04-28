export interface ICreateChargeExtractRequest {
  vendorId: string,
  chargeExtractDateTime: Date,
  invoices: string[]
}