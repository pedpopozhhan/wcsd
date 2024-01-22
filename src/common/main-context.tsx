import { FC, ReactNode, createContext, useState } from 'react';
import { IInvoiceData } from './invoice-modal-dialog';

interface IMainContext {
  timeReportsToReconcile: number[];
  setTimeReportsToReconcile: (newValue: number[]) => void;
  invoiceData: IInvoiceData;
  setInvoiceData: (newValue: IInvoiceData) => void;
}

export const MainContext = createContext<IMainContext>({
  timeReportsToReconcile: [],
  setTimeReportsToReconcile: () => {},
  invoiceData: null as any,
  setInvoiceData: () => {},
});

interface IMainContextProviderProps {
  children: ReactNode;
}
export const MainContextProvider: FC<IMainContextProviderProps> = ({
  children,
}) => {
  const [timeReportsToReconcile, _setTimeReportsToReconcile] = useState<
    number[]
  >([]);

  const [invoiceData, _setInvoiceData] = useState<IInvoiceData>({} as any);

  // Function to update context value
  const setTimeReportsToReconcile = (newValue: number[]) => {
    _setTimeReportsToReconcile(newValue);
  };

  const setInvoiceData = (newValue: IInvoiceData) => {
    _setInvoiceData(newValue);
  };

  return (
    <MainContext.Provider
      value={{
        timeReportsToReconcile,
        setTimeReportsToReconcile,
        invoiceData,
        setInvoiceData,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
