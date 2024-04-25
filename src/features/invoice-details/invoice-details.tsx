import { useNavigate } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTab from './details-tab';
import ReconciledTab from './reconciled-tab';
import { useEffect, useState } from 'react';
import { GoAButton, GoAIcon } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { getRateTypes } from './invoice-details-epic';
import { setCostDetailsData, setOtherCostsData, setTimeReportData } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setOtherCostData } from './invoice-details-slice';
import { setRowData } from './invoice-details-slice';

const { container, content, sideBar, main, footer, icon, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

export default function InvoiceDetails() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const otherCostData = useAppSelector((state) => state.invoiceDetails.otherCostData);

  const navigate = useNavigate();

  const invoiceData = useAppSelector((state) => state.app.invoiceData);

  const [tabIndex, setTabIndex] = useState<number>(1);

  const [reconciledAmount, setReconciledAmount] = useState<number>(0);

  function isReconciled() {
    const delta = 0.01;
    const diff = Math.abs(invoiceData.InvoiceAmount - reconciledAmount);
    return diff < delta;
  }
  useEffect(() => {
    dispatch(getRateTypes({ token: auth?.user?.access_token }));
  }, [auth]);

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
    dispatch(setOtherCostData([]));
    // navigate to time reports page
    navigate(`/invoice-processing/${invoiceData.ContractNumber}`);
  }
  function processInvoice() {
    const timeReportData = rowData.filter((i) => i.isAdded);
    const data = timeReportData.map((x) => {
      return x.data;
    });
    dispatch(setCostDetailsData(data));
    dispatch(setOtherCostsData(otherCostData));
    dispatch(setTimeReportData(timeReportData));
    navigate(`/Invoice/${invoiceData.InvoiceNumber}/processInvoice`);
  }

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div>
            Invoice
            <InvoiceModalDialog />
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
              <button id='Payables' role='tab' aria-selected={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <span>Payables</span>
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
        {/* <GoAButton type='primary' onClick={processInvoice} {...(enableProcess ? { disabled: false } : { disabled: true })}> */}
        <GoAButton type='primary' onClick={processInvoice} disabled={!isReconciled()}>
          <div className={icon}>
            <GoAIcon type='download'></GoAIcon>
          </div>
          Next
        </GoAButton>
        <GoAButton type='secondary' onClick={cancel}>
          Cancel
        </GoAButton>
      </div>
    </div>
  );
}
