import { Fragment, useState } from 'react';
import styles from './process-invoice.module.scss';
import { GoAButton } from '@abgov/react-components';
import Totalizer from './invoice-amount-totalizer';
import { useLocation, useNavigate } from 'react-router-dom';
import ServiceSheetTab from './tabs/service-sheet-tab';
import DetailsTab from './tabs/details-tab';
import ProcessInvoiceModal from './process-invoice-modal-dialog';
import { IDetailsTableRow } from '@/features/invoice-details/details-table-row.interface';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { resetState } from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { setRedirectionFromProcessInvoice } from './process-invoice-slice';
import Summary from '@/features/invoice-details/summary';

export default function ProcessInvoice() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reconciledData = useLocation();
  const timeReportData: IDetailsTableRow[] = reconciledData.state.timeReportData;
  const invoiceTimeReportData = timeReportData.map((i) => i.data);
  const otherCostData: IOtherCostTableRowData[] = reconciledData.state.otherCostData;
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const invoiceTabs = useAppSelector((state) => state.processInvoiceTabs);
  const contractDetails = useAppSelector((state) => state.app.contractForReconciliation);
  const serviceSheetData = useAppSelector((state) => state.processInvoiceTabs.serviceSheetData);
  let dialogType = 'finish-invoice';
  if (invoiceData.InvoiceKey > 0) {
    dialogType = 'update-service-sheet';
  }
  const { container, content, sideBar, main, footer, header, tabGroupContainer, tabList, tabContainer, summaryContainer } = styles;

  const [tabIndex, setTabIndex] = useState<number>(1);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  function navigateToReconcile() {
    dispatch(resetState());
    navigate(`/invoice/${invoiceData.InvoiceID}`, {
      state: invoiceData.InvoiceID,
    });
  }

  function navigateToTimeReports() {
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
              {tabIndex === 1 && <ServiceSheetTab InvoiceID={invoiceData.InvoiceID} InvoiceAmount={invoiceData.InvoiceAmount} />}
              {tabIndex === 2 && <DetailsTab />}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>
        {invoiceData.InvoiceKey == 0 && (
          <Fragment>
            <GoAButton type='primary' onClick={() => setShowDialog(true)}>
              <ion-icon name='archive-outline'></ion-icon>
              <label>Finish</label>
            </GoAButton>
            <GoAButton type='secondary' onClick={navigateToReconcile}>
              Back to Reconcile
            </GoAButton>
          </Fragment>
        )}
        {invoiceData.InvoiceKey > 0 && (
          <Fragment>
            <GoAButton type='primary' onClick={() => setShowDialog(true)} {...(invoiceTabs.nameChanged && serviceSheetData?.uniqueServiceSheetName? { disabled: false } : { disabled: true })}>
              <label>Update</label>
            </GoAButton>
            <GoAButton type='secondary' onClick={navigateToTimeReports}>
              Close
            </GoAButton>
          </Fragment>
        )}
      </div>
      {
        <ProcessInvoiceModal
          open={showDialog}
          close={() => setShowDialog(false)}
          data={{ timeReportData: invoiceTimeReportData, otherCostData: otherCostData }}
          type={dialogType}
        ></ProcessInvoiceModal>
      }
    </div>
  );
}
