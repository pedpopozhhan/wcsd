import { IChargeExtractDetail } from '@/interfaces/processed-invoice/charge-extract-detail-data';
export interface IChargeExtractData {
  chargeExtractId: string,
  chargeExtractDetail: IChargeExtractDetail[]
}