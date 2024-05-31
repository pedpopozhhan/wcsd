import { Fragment, useEffect, useState } from 'react';
import styles from './process-invoice.module.scss';
import { GoAButton, GoAIcon, GoANotification } from '@abgov/react-components';
import Totalizer from './invoice-amount-totalizer';
import { useNavigate, useParams } from 'react-router-dom';
import DetailsTab from './tabs/details-tab';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import {
  resetState,
  setCostDetailsData,
  setInvoiceAmount,
  setInvoiceNumber,
  setOtherCostsData,
} from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setRedirectionFromProcessInvoice } from './process-invoice-slice';
import Summary from '@/features/invoice-details/summary';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { createInvoice, updateInvoice } from './process-invoice-epic';
import { setInvoiceChanged, setInvoiceData } from '@/app/app-slice';
import processedInvoiceDetailService from '@/services/processed-invoice-detail.service';
import { failedToPerform, publishToast } from '@/common/toast';
import { navigateTo } from '@/common/navigate';

export default function ProcessInvoice() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loading, setIsLoading] = useState<boolean>(true);
  const { invoiceId, contractNumber } = useParams();
  const formChanged = useAppSelector((state) => state.app.invoiceChanged);
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);
  const { container, content, banner, sideBar, main, footer, header, tabGroupContainer, detailsHeader, tabContainer, summaryContainer, icon } =
    styles;

  useEffect(() => {
    if (invoiceId) {
      setIsLoading(true);
      const subscription = processedInvoiceDetailService.getInvoiceDetail(auth?.user?.access_token, invoiceId).subscribe({
        next: (results) => {
          const invoiceForContext = {
            InvoiceID: results.invoice.invoiceId,
            InvoiceNumber: results.invoice.invoiceNumber,
            DateOnInvoice: new Date(results.invoice.invoiceDate).toISOString(),
            InvoiceAmount: results.invoice.invoiceAmount,
            PeriodEnding: new Date(results.invoice.periodEndDate).toISOString(),
            InvoiceReceived: new Date(results.invoice.invoiceReceivedDate).toISOString(),
            ContractNumber: contractNumber,
            UniqueServiceSheetName: results.invoice.uniqueServiceSheetName,
            ServiceDescription: results.invoice.serviceDescription,
            CreatedBy: results.invoice.createdBy,
          };

          dispatch(setInvoiceData(invoiceForContext));
          dispatch(setInvoiceNumber(results.invoice.invoiceNumber));
          dispatch(setInvoiceAmount(results.invoice.invoiceAmount));
          dispatch(setCostDetailsData(results.invoice.invoiceTimeReportCostDetails));
          dispatch(setOtherCostsData(results.invoice.invoiceOtherCostDetails));
          setIsLoading(false);
        },
        error: (error) => {
          setIsLoading(false);
          console.error(error);
          if (error.response && error.response.status === 403) {
            navigateTo('unauthorized');
          }
          publishToast({
            type: 'error',
            message: failedToPerform('Get details of selected invoice or dispatch values to slice', error.response.data),
          });
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

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
    navigate(`/invoice-processing/${contractDetails.contractNumber}`, {
      state: contractDetails.contractNumber,
    });
  }
  if (loading) {
    return null;
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
