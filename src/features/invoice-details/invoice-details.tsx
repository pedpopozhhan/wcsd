import { useNavigate } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTab from './details-tab';
import ReconciledTab from './reconciled-tab';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { GoAButton } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setRateTypes, setRowData } from './invoice-details-slice';

let { container, content, sideBar, main, footer, header, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

export default function InvoiceDetails() {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const otherCostData = useAppSelector((state) => state.invoiceDetails.otherCostData);

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
    const subscription = invoiceDetailsService.getInvoiceDetails(timeReportsToReconcile).subscribe({
      next: (results) => {
        const data = results.rows.slice().map((x, i) => {
          return {
            index: i,
            data: x,
            isAdded: false,
            isSelected: false,
          };
        });
        dispatch(setRowData(data));
        dispatch(setRateTypes(results.rateTypes));
      },
      error: (error) => {
        // TODO: display an error message the right way
        console.error(error);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [timeReportsToReconcile]);

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
    // navigate to time reports page
    navigate(`/VendorTimeReports/${invoiceData.ContractNumber}`);
  }
  function processInvoice() {
    const timeReportData = rowData.filter((i) => i.isAdded);
    navigate(`/Invoice/${invoiceData.InvoiceID}/processInvoice`, { state: { timeReportData, otherCostData } });
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
            <Summary
              InvoiceID={invoiceData.InvoiceID}
              DateOnInvoice={invoiceData.DateOnInvoice}
              InvoiceAmount={invoiceData.InvoiceAmount}
              PeriodEnding={invoiceData.PeriodEnding}
              InvoiceReceived={invoiceData.InvoiceReceived}
              ContractNumber={invoiceData.ContractNumber}
            />
          </div>
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button id='Details' role='tab' aria-selected={tabIndex === 1} onClick={(e) => setTabIndex(1)}>
                <span>Details</span>
              </button>
              <button id='Reconciled' role='tab' aria-selected={tabIndex === 2} onClick={(e) => setTabIndex(2)}>
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
