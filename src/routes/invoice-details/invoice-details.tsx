import { useNavigate, useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import ReconciledInvoiceDetails from './reconciled-invoice-details';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { GoAButton } from '@abgov/react-components';
import { useSessionStorage } from 'usehooks-ts';
import InvoiceModalDialog, {
  IInvoiceData,
} from '@/common/invoice-modal-dialog';

let {
  container,
  content,
  sideBar,
  main,
  footer,
  header,
  tabGroupContainer,
  tabList,
  tabContainer,
  summaryContainer,
} = styles;

export default function InvoiceDetails() {
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useSessionStorage<IInvoiceData>(
    'invoiceData',
    null as any
  );
  const [allData, setAllData] = useState([] as IDetailsTableRowData[]);
  const [tabIndex, setTabIndex] = useState<number>(1);

  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const editInvoice = () => {
    setParentShowModal(true);
  };
  const [reconciledAmount, setReconciledAmount] = useState<number>(0);

  useEffect(() => {
    const subscription = invoiceDetailsService.getAll().subscribe((results) => {
      const data = results.slice();
      setAllData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [invoiceData]);

  function onAddRemove(newTotal: number) {
    //update the totalizer
    setReconciledAmount(newTotal);
  }

  function cancel() {
    // navigate to time reports page
    navigate(`/VendorTimeReports/${invoiceData.ContractNumber}`);
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
              <button
                id='Details'
                role='tab'
                aria-selected={tabIndex === 1}
                onClick={(e) => setTabIndex(1)}
              >
                <span>Details</span>
              </button>
              <button
                id='Reconciled'
                role='tab'
                aria-selected={tabIndex === 2}
                onClick={(e) => setTabIndex(2)}
              >
                <span>Reconciled</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && (
                <DetailsTable data={allData} onAddRemove={onAddRemove} />
              )}
              {tabIndex === 2 && (
                  <ReconciledInvoiceDetails />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        <GoAButton type='secondary' onClick={cancel}>
          Cancel
        </GoAButton>
      </div>
      <InvoiceModalDialog
        isAddition='false'
        visible={parentShowModal}
        showInvoiceDialog={setParentShowModal}
      />
    </div>
  );
}
