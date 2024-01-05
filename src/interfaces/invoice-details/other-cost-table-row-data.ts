export interface IOtherCostTableRowData {
    from: Date;
    to: Date;
    rateType: string;
    unit: string;
    ratePerUnit: number; //with $0.00 //Unit Cost
    numberOfUnits: number;
    cost : number;
    glAccountNumber: number;
    profitCentre: string;
    costCentre: string;
    internalOrder: string;
    fund: number;
    remarks: string;
    invoiceId: string;
  }
  