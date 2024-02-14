import { IDropDownList } from '@/interfaces/drop-down-list.interface';

export default interface IOtherCostDropDownLists {
    rateTypes: string[];
    rateUnits: string[];
    glAccountList: string[];
    costCenterList: string[];
    internalOrderList: string[];
    fundList: string[];
}
