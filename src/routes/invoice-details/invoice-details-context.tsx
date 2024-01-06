import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
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
}

export const InvoiceDetailsContext = createContext<IInvoiceDetailsContext>({
  rowData: [],
  setRowData: () => {},
});

interface IInvoiceDetailsProviderProps {
  children: ReactNode;
}
export const InvoiceDetailsProvider: FC<IInvoiceDetailsProviderProps> = ({
  children,
}) => {
  const [rowData, _setRowData] = useState<IDetailsTableRow[]>([]);

  // Function to update context value
  const setRowData = (newValue: IDetailsTableRow[]) => {
    _setRowData(newValue);
  };

  return (
    <InvoiceDetailsContext.Provider value={{ rowData, setRowData }}>
      {children}
    </InvoiceDetailsContext.Provider>
  );
};
