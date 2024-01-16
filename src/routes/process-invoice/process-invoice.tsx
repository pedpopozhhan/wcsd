import { useContext, useState } from 'react';
import Summary from '../invoice-details/summary';
import styles from './process-invoice.module.scss';
import { MainContext } from '@/common/main-context';
import { GoAButton } from '@abgov/react-components';
import Totalizer from './invoice-amount-totalizer';
import { useNavigate } from 'react-router-dom';
import ServiceSheetTab from './tabs/service-sheet-tab';
import DetailsTab from './tabs/details-tab';

const ProcessInvoice = () => {
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

  const [tabIndex, setTabIndex] = useState<number>(1);
  const mainContext = useContext(MainContext);
  const navigate = useNavigate();
  const { invoiceData } = mainContext;

  function navigateToReconcile() {
    navigate(`/invoice/${invoiceData.InvoiceID}`, {
      state: invoiceData.InvoiceID,
    });
  }

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice </div>
          <Totalizer invoiceAmount={invoiceData.InvoiceAmount} />
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
                id='ServiceSheet'
                role='tab'
                aria-selected={tabIndex === 1}
                onClick={(e) => setTabIndex(1)}
              >
                <span>Service sheet</span>
              </button>
              <button
                id='Details'
                role='tab'
                aria-selected={tabIndex === 2}
                onClick={(e) => setTabIndex(2)}
              >
                <span>Details</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && <ServiceSheetTab InvoiceID={invoiceData.InvoiceID} InvoiceAmount={invoiceData.InvoiceAmount}/>}
              {tabIndex === 2 && <DetailsTab />}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        <GoAButton type='primary'>Finish</GoAButton>
        <GoAButton type='secondary' onClick={navigateToReconcile}>
          Back to Reconcile
        </GoAButton>
      </div>
    </div>
  );
};

export default ProcessInvoice;
