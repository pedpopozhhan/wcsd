import { useNavigate } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTab from './details-tab';
import ReconciledTab from './reconciled-tab';
import { useEffect, useState } from 'react';
import { GoAButton } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { getInvoiceDetails } from './invoice-details-epic';
import { setReadOnly, setServiceSheetData, setcostDetailsData, setotherCostsData } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { setServiceSheetData, setcostDetailsData, setotherCostsData } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setRowData } from './invoice-details-slice';

const { container, content, sideBar, main, footer, header, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

export default function InvoiceDetails() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const otherCostData = useAppSelector((state) => state.invoiceDetails.otherCostData);
  const processInvoiceTabs = useAppSelector((state) => state.processInvoiceTabs);

  const navigate = useNavigate();

  const timeReportsToReconcile = useAppSelector((state) => state.app.timeReportsToReconcile);
  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [tabIndex, setTabIndex] = useState<number>(1);

  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const editInvoice = () => {
    setParentShowModal(true);
  };
  const [reconciledAmount, setReconciledAmount] = useState<number>(0);
  const enableProcess = invoiceData.InvoiceAmount - reconciledAmount == 0 ? true : false;

  useEffect(() => {
    dispatch(getInvoiceDetails({ token: auth?.user?.access_token, ids: timeReportsToReconcile }));
  }, [timeReportsToReconcile, auth]);

  useEffect(() => {
    const total = rowData
      .filter((x) => x.isAdded)
      .reduce((acc, cur) => {
        return acc + cur.data.cost;
      }, 0);

    const otherTotal = otherCostData.reduce((acc, cur) => {
      return acc + cur.cost;
    }, 0);
    setReconciledAmount(total + otherTotal);
  }, [rowData, otherCostData]);

  function cancel() {
    dispatch(
      setRowData(
        rowData.map((r) => {
          return { ...r, isAdded: false };
        }),
      ),
    );
    // navigate to time reports page
    navigate(`/VendorTimeReports/${invoiceData.ContractNumber}`);
  }
  function processInvoice() {
    const timeReportData = rowData.filter((i) => i.isAdded);
    if (invoiceData.InvoiceID == EmptyInvoiceId && processInvoiceTabs) {
      dispatch(setServiceSheetData({ ...processInvoiceTabs.serviceSheetData, invoiceId: EmptyInvoiceId, uniqueServiceSheetName: '', price: invoiceData.InvoiceAmount }));
      dispatch(setReadOnly(false));
    }
    const data = timeReportData.map((x) => {
      return x.data;
    });
    dispatch(setcostDetailsData(data));
    dispatch(setotherCostsData(otherCostData));
    navigate(`/Invoice/${invoiceData.InvoiceNumber}/processInvoice`, { state: { timeReportData, otherCostData } });
  }

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>
            Invoice{' '}
            <GoAButton type='tertiary' onClick={editInvoice}>
              Edit
            </GoAButton>
          </div>
          <Totalizer
            invoiceAmount={invoiceData.InvoiceAmount}
            reconciledAmount={reconciledAmount}
            remainingAmount={invoiceData.InvoiceAmount - reconciledAmount}
          />
          <div className={summaryContainer}>
            <Summary />
          </div>
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button id='Details' role='tab' aria-selected={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <span>Details</span>
              </button>
              <button id='Reconciled' role='tab' aria-selected={tabIndex === 2} onClick={() => setTabIndex(2)}>
                <span>Reconciled</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && <DetailsTab />}
              {tabIndex === 2 && <ReconciledTab />}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        <GoAButton type='primary' onClick={processInvoice} {...(enableProcess ? { disabled: false } : { disabled: true })}>
          Process
        </GoAButton>
        <GoAButton type='secondary' onClick={cancel}>
          Cancel
        </GoAButton>
      </div>
      <InvoiceModalDialog isAddition='false' visible={parentShowModal} showInvoiceDialog={setParentShowModal} />
    </div>
  );
}
