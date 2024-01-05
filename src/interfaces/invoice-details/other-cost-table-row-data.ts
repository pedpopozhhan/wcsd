export interface IOtherCostTableRowData {
    from: Date;
    to: Date;
    rateType: string;
    unit: string;
    rate: number;    
    numberOfUnits: number;
    ratePerUnit: number; //with $0.00 //Unit Cost
    glAccountNumber: number;
    profitCentre: string;
    costCentre: string;
    internalOrder: string;
    fund: number;
    remarks: string;
    invoiceId: string;
  }
  