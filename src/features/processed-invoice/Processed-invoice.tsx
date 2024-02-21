import { Fragment, useState } from 'react';
import Summary from '@/features//invoice-details/summary';
import styles from '@/features/processed-invoice/processed-invoice.module.scss';
import { GoAButton } from '@abgov/react-components';
import Totalizer from '@/features/process-invoice/invoice-amount-totalizer';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceSheetTab from '@/features/process-invoice/tabs/service-sheet-tab';
import DetailsTab from '@/features/process-invoice/tabs/details-tab';

import { useAppDispatch, useAppSelector } from '@/app/hooks';

import { resetState } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';

export default function ProcessedInvoice() {
  const { invoiceKey } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const invoiceId: string = useAppSelector((state) => state.processInvoiceTabs.invoiceceId);
  const invoiceAmount: number = useAppSelector((state) => state.processInvoiceTabs.invoiceAmount);

  const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);

  const { container, content, sideBar, main, footer, header, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

  const [tabIndex, setTabIndex] = useState<number>(1);

  function navigateToTimeReports() {
    dispatch(resetState());
    navigate(`/VendorTimeReports/${contractDetails.contractNumber}`, {
      state: contractDetails.contractNumber,
    });
  }

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice </div>
          <Totalizer invoiceAmount={invoiceAmount} />
          <div className={summaryContainer}>
            <Summary />
          </div>
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button id='ServiceSheet' role='tab' aria-selected={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <span>Service sheet</span>
              </button>
              <button id='Details' role='tab' aria-selected={tabIndex === 2} onClick={() => setTabIndex(2)}>
                <span>Details</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && <ServiceSheetTab InvoiceID={invoiceId} InvoiceAmount={invoiceAmount} />}
              {tabIndex === 2 && <DetailsTab />}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        {Number(invoiceKey) > 0 && (
          <Fragment>
            <GoAButton type='primary' disabled>
              <label>Update</label>
            </GoAButton>
            <GoAButton type='secondary' onClick={navigateToTimeReports}>
              Close
            </GoAButton>
          </Fragment>
        )}
      </div>
    </div>
  );
}
