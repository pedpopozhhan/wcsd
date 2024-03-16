import { Fragment, useState } from 'react';
import styles from './process-invoice.module.scss';
import { GoAButton } from '@abgov/react-components';
import Totalizer from './invoice-amount-totalizer';
import { useLocation, useNavigate } from 'react-router-dom';
import DetailsTab from './tabs/details-tab';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { resetState } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setRedirectionFromProcessInvoice } from './process-invoice-slice';
import Summary from '@/features/invoice-details/summary';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { createInvoice, updateInvoice } from './process-invoice-epic';
import { setInvoiceChanged } from '@/app/app-slice';
import { IDetailsTableRow } from '../invoice-details/details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';

export default function ProcessInvoice() {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reconciledData = useLocation();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const formChanged = useAppSelector((state) => state.app.invoiceChanged);
  const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);
  const timeReportData: IDetailsTableRow[] = reconciledData.state.timeReportData;
  const invoiceTimeReportData = timeReportData.map((i) => i.data);
  const otherCostData: IOtherCostTableRowData[] = reconciledData.state.otherCostData;
  const { container, content, sideBar, main, footer, header, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

  const [tabIndex, setTabIndex] = useState<number>(1);

  function navigateToReconcile() {
    dispatch(setInvoiceChanged(false));
    dispatch(resetState());
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
  function getInvoiceData(): IProcessInvoiceData {
    return {
      invoiceId: invoiceData.InvoiceID,
      invoiceNumber: invoiceData.InvoiceNumber,
      invoiceDate: invoiceData.DateOnInvoice,
      invoiceAmount: invoiceData.InvoiceAmount,
      periodEndDate: invoiceData.PeriodEnding,
      invoiceReceivedDate: invoiceData.InvoiceReceived,
      vendorBusinessId: contractDetails.businessId.toString(),
      vendorName: contractDetails.vendorName,
      assignedTo: '',
      contractNumber: invoiceData.ContractNumber,
      type: contractDetails.contractType,
      uniqueServiceSheetName: invoiceData.UniqueServiceSheetName,
      invoiceTimeReportCostDetails: invoiceTimeReportData,
      invoiceOtherCostDetails: otherCostData,
    };
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
            <div className={tabList}>
              <button id='Details' role='tab' aria-selected={tabIndex === 1} onClick={() => setTabIndex(1)}>
                <span>Details</span>
              </button>
            </div>
            <div className={tabContainer}>{tabIndex === 1 && <DetailsTab />}</div>
          </div>
        </div>
      </div>
      <div className={footer}>
        {invoiceData.InvoiceID == EmptyInvoiceId && (
          <Fragment>
            <GoAButton type='primary' onClick={() => dispatch(createInvoice({ token: auth?.user?.access_token, invoiceData: getInvoiceData() }))}>
              <ion-icon name='archive-outline'></ion-icon>
              <label>Finish</label>
            </GoAButton>
            <GoAButton type='secondary' onClick={navigateToReconcile}>
              Back to Reconcile
            </GoAButton>
          </Fragment>
        )}
        {invoiceData.InvoiceID != EmptyInvoiceId && (
          <Fragment>
            <GoAButton
              type='primary'
              onClick={() => dispatch(updateInvoice({ token: auth?.user?.access_token, invoiceData: getInvoiceData() }))}
              disabled={!formChanged}
            >
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
