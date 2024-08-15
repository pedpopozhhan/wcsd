import { IRowIndicator } from '@/interfaces/common/row-indicator.interface';

export interface IOneGxGetContractRequest {
  contractID: number;
}

export interface IOneGxContract extends IRowIndicator {
  index: number;
  id: number;
  contractWorkspaceID: number;
  contractWorkspaceRef: string;
  contractNumber: string;
  businessArea: string;
  userid: string;
  supplierid: string;
  supplierName: string;
}

export interface IOneGxContractWorkspace {
  index: number;
  contractWorkspaceID: number;
  contractWorkspace: string;
  effectivedate: string;
  origexpirationdate: string;
  currExpirationdate: string;
  amendmenttype: string;
  description: string;
  currContractValue: number;
  currencyType: string;
  status: string;
  solicitationType: string;
  contractType: string;
}

export interface IOneGxContractsSearchResponse {
  count: number;
  data: IOneGxContract[];
}

export interface IOneGxContractDetail {
  index: number;
  id: number;
  contractWorkspaceID: number;
  contractWorkspaceRef: string;
  contractNumber: string;
  businessArea: string;
  userid: string;
  supplierid: string;
  supplierName: string;
  workspace: IOneGxContractWorkspace;
}
