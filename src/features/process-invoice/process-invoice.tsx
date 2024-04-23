import { Fragment } from 'react';
import styles from './process-invoice.module.scss';
import { GoAButton, GoAIcon, GoANotification } from '@abgov/react-components';
import Totalizer from './invoice-amount-totalizer';
import { useNavigate } from 'react-router-dom';
import DetailsTab from './tabs/details-tab';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { resetState } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setRedirectionFromProcessInvoice } from './process-invoice-slice';
import Summary from '@/features/invoice-details/summary';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { createInvoice, updateInvoice } from './process-invoice-epic';
import { setInvoiceChanged } from '@/app/app-slice';

export default function ProcessInvoice() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const formChanged = useAppSelector((state) => state.app.invoiceChanged);
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);
  const { container, content, banner, sideBar, main, footer, header, tabGroupContainer, detailsHeader, tabContainer, summaryContainer, icon } =
    styles;

  function navigateToReconcile() {
    dispatch(setInvoiceChanged(false));
    navigate(`/invoice/${invoiceData.InvoiceNumber}`, {
      state: invoiceData.InvoiceNumber,
    });
  }

  function navigateToTimeReports() {
    dispatch(setInvoiceChanged(false));
    dispatch(resetState());
    dispatch(setRedirectionFromProcessInvoice(true));
    navigate(`/VendorTimeReports/${contractDetails.contractNumber}`, {
      state: contractDetails.contractNumber,
    });
  }
  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice </div>
          <Totalizer invoiceAmount={invoiceData.InvoiceAmount} />
          <div className={summaryContainer}>
            <Summary showSheet />
          </div>
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={detailsHeader}>Details</div>
            <div className={tabContainer}>
              <DetailsTab />
            </div>
          </div>
        </div>
        {!invoiceData.UniqueServiceSheetName && (
          <div className={banner}>
            <GoANotification type='information'>Confirm invoice submission with service sheet name.</GoANotification>
          </div>
        )}
      </div>
      <div className={footer}>
        {invoiceData.InvoiceID == EmptyInvoiceId && (
          <Fragment>
            <GoAButton type='primary' onClick={() => dispatch(createInvoice({ token: auth?.user?.access_token }))}>
              <div className={icon}>
                <GoAIcon type='download'></GoAIcon>
              </div>
              <label>Process</label>
            </GoAButton>
            <GoAButton type='secondary' onClick={navigateToReconcile}>
              Back to Reconcile
            </GoAButton>
          </Fragment>
        )}
        {invoiceData.InvoiceID != EmptyInvoiceId && (
          <Fragment>
            <GoAButton type='primary' onClick={() => dispatch(updateInvoice({ token: auth?.user?.access_token }))} disabled={!formChanged}>
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
