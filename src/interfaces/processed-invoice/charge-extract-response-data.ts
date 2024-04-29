import { IChargeExtractData } from '@/interfaces/processed-invoice/charge-extract-data';
import { IChargeExtractFileData } from '@/interfaces/processed-invoice/charge-extract-file-data';

export interface IChargeExtractResponse {

  chargeExtract: IChargeExtractData,
  chargeExtractFiles: IChargeExtractFileData[]
}