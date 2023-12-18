import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { GoAButton } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';

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
  tableInvoiceHeader,
} = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const [allData, setAllData] = useState([] as IDetailsTableRowData[]);
  const [tabIndex, setTabIndex] = useState<number>(1);

  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const editInvoice = () => {
    setParentShowModal(true);
  }

  const [invoiceID, setInvoiceId] = useState("");
  const [dateOfInvoice, setDateOfInvoice] = useState(new Date(Date()));
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [periodEndingDate, setPeriodEndingDate] = useState(new Date(Date()));
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState(new Date(Date()));
  const [contractNumber, setContractNumber] = useState("");


  const updateModalData = () => {
    if (sessionStorage.getItem('invoiceData') !== null) {
      let invoiceData = JSON.parse(sessionStorage.getItem('invoiceData') || '{}');
      setInvoiceId(invoiceData.InvoiceID);
      setInvoiceAmount(invoiceData.InvoiceAmount);
      setDateOfInvoice(invoiceData.DateOnInvoie);
      setInvoiceReceivedDate(invoiceData.InvoiceReceived);
      setPeriodEndingDate(invoiceData.PeriodEnding);
      setContractNumber(invoiceData.ContractNumber);
    }
  }

  const [reconciledAmount, setReconciledAmount] = useState<number>(0);
  useEffect(() => {
    const subscription = invoiceDetailsService.getAll().subscribe((results) => {
      const data = results.slice();
      updateModalData();
      setAllData(data);  
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [invoiceId, invoiceID, dateOfInvoice,invoiceAmount]);

  function onAddRemove(newTotal: number) {
    //update the totalizer
    setReconciledAmount(newTotal);
  }

  function cancel() {}

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className= {header}>
          Invoice <GoAButton  type='tertiary' onClick={editInvoice}>Edit</GoAButton>
          </div>
          <Totalizer invoiceAmount={invoiceAmount}
           reconciledAmount={reconciledAmount}
           remainingAmount={invoiceAmount - reconciledAmount}
          />
          <Summary InvoiceID={invoiceID}
            DateOnInvoie={dateOfInvoice}
            InvoiceAmount={invoiceAmount}
            PeriodEnding={periodEndingDate}
            InvoiceReceived={invoiceReceivedDate}
            ContractNumber={contractNumber}
          />
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
              {tabIndex === 2 && <div>Coming Soon</div>}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        <GoAButton type='secondary' onClick={cancel}>
          Cancel
        </GoAButton>
      </div>
      <InvoiceModalDialog isAddition='false' visible={parentShowModal} showInvoiceDialog={setParentShowModal} stateChanged={updateModalData}/>
    </div>
  );
}
