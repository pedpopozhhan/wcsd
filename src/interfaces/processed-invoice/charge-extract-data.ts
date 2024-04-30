import { IChargeExtractDetail } from '@/interfaces/processed-invoice/charge-extract-detail-data';

export interface IChargeExtractData {
  chargeExtractId: string,
  chargeExtractDetail: IChargeExtractDetail[],
  chargeExtractDateTime: string,
  chargeExtractFileName: string,
  requestedBy: string,
  vendorId: string,
  auditCreationDateTime: string,
  auditLastUpdatedBy: string,
  auditLastUpdatedDateTime: string,
  parentChargeExtractId: string,
  extendedExtract: IChargeExtractData,
  extractFile: string,
  extendedExtractFile: string
}