import { FC, ReactNode, createContext, useState } from 'react';
import { IInvoiceData } from './invoice-modal-dialog';
import { IContractSearchResult } from '@/interfaces/reconciliation/contract-search-result';

interface IMainContext {
  timeReportsToReconcile: number[];
  setTimeReportsToReconcile: (newValue: number[]) => void;
  invoiceData: IInvoiceData;
  setInvoiceData: (newValue: IInvoiceData) => void;
  vendorForReconciliation: IContractSearchResult;
  setVendorForReconciliation: (newValue: IContractSearchResult) => void;
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
  const [vendorForReconciliation, _setVendorForReconciliation] = useState<IContractSearchResult>({} as any);

  // Function to update context value
  const setTimeReportsToReconcile = (newValue: number[]) => {
    _setTimeReportsToReconcile(newValue);
  };

  const setInvoiceData = (newValue: IInvoiceData) => {
    _setInvoiceData(newValue);
  };

  const setVendorForReconciliation = (newValue: IContractSearchResult) => {
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
