export interface ICreateChargeExtractRequest {
  requestedBy: string,
  chargeExtractDateTime: Date,
  invoices: string[],
  contractNumber: string
}