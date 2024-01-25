import { FC, ReactNode, createContext, useState } from 'react';
import { IInvoiceData } from './invoice-modal-dialog';
import { IVendorSearchResult } from '@/interfaces/reconciliation/contract-SearchResult';

interface IMainContext {
  timeReportsToReconcile: number[];
  setTimeReportsToReconcile: (newValue: number[]) => void;
  invoiceData: IInvoiceData;
  setInvoiceData: (newValue: IInvoiceData) => void;
  vendorForReconciliation: IVendorSearchResult;
  setVendorForReconciliation: (newValue: IVendorSearchResult) => void;
}

export const MainContext = createContext<IMainContext>({
  timeReportsToReconcile: [],
  setTimeReportsToReconcile: () => { },
  invoiceData: null as any,
  setInvoiceData: () => { },
  vendorForReconciliation: null as any,
  setVendorForReconciliation: () => { }
});

interface IMainContextProviderProps {
  children: ReactNode;
}
export const MainContextProvider: FC<IMainContextProviderProps> = ({ children, }) => {
  const [timeReportsToReconcile, _setTimeReportsToReconcile] = useState<number[]>([]);
  const [invoiceData, _setInvoiceData] = useState<IInvoiceData>({} as any);
  const [vendorForReconciliation, _setVendorForReconciliation] = useState<IVendorSearchResult>({} as any);

  // Function to update context value
  const setTimeReportsToReconcile = (newValue: number[]) => {
    _setTimeReportsToReconcile(newValue);
  };

  const setInvoiceData = (newValue: IInvoiceData) => {
    _setInvoiceData(newValue);
  };

  const setVendorForReconciliation = (newValue: IVendorSearchResult) => {
    _setVendorForReconciliation(newValue);
  }

  return (
    <MainContext.Provider
      value={{
        timeReportsToReconcile,
        setTimeReportsToReconcile,
        invoiceData,
        setInvoiceData,
        vendorForReconciliation,
        setVendorForReconciliation
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
