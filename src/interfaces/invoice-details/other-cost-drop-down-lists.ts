import { IDropDownListResponse } from '@/interfaces/common/drop-down-list-response';

export default interface IOtherCostDropDownLists {
  rateTypes: string[];
  rateUnits: string[];
  glAccountList: IDropDownListResponse[];
  costCenterList: IDropDownListResponse[];
  internalOrderList: IDropDownListResponse[];
  fundList: IDropDownListResponse[];
}
