import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { FC, ReactNode, createContext, useState } from 'react';

export interface IDetailsTableRow {
  index: number;
  data: IDetailsTableRowData;
  isAdded: boolean;
  isSelected: boolean;
}

interface IInvoiceDetailsContext {
  rowData: IDetailsTableRow[];
  setRowData: (newValue: IDetailsTableRow[]) => void;
  otherCostData: IOtherCostTableRowData[];
  setOtherCostData: (newValue: IOtherCostTableRowData[]) => void;
  rateTypes: string[];
  setRateTypes: (newValue: string[]) => void;
}

export const InvoiceDetailsContext = createContext<IInvoiceDetailsContext>({
  rowData: [],
  setRowData: () => {},
  otherCostData: [],
  setOtherCostData: () => {},
  rateTypes: [],
  setRateTypes: () => {},
});

interface IInvoiceDetailsProviderProps {
  children: ReactNode;
}
export const InvoiceDetailsProvider: FC<IInvoiceDetailsProviderProps> = ({
  children,
}) => {
  const [rowData, _setRowData] = useState<IDetailsTableRow[]>([]);
  const [otherCostData, _setOtherCostData] = useState<IOtherCostTableRowData[]>(
    []
  );
  const [rateTypes, _setRateTypes] = useState<string[]>([]);
  // Function to update context value
  const setRowData = (newValue: IDetailsTableRow[]) => {
    _setRowData(newValue);
  };

  const setOtherCostData = (newValue: IOtherCostTableRowData[]) => {
    _setOtherCostData(newValue);
  };

  const setRateTypes = (newValue: string[]) => {
    _setRateTypes(newValue);
  };

  return (
    <InvoiceDetailsContext.Provider
      value={{
        rowData,
        setRowData,
        otherCostData,
        setOtherCostData,
        rateTypes,
        setRateTypes,
      }}
    >
      {children}
    </InvoiceDetailsContext.Provider>
  );
};
