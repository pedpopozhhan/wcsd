import { GoAButton, GoAButtonGroup, GoAModal } from '@abgov/react-components';
import { Fragment, useState } from 'react';
import styles from './process-invoice.module.scss';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setInvoiceData } from '@/app/app-slice';
import { setNotificationStatus } from './process-invoice-slice';
import { setServiceSheetData, setServiceSheetNameChange } from './tabs/process-invoice-tabs-slice';
import { setOtherCostData, setRowData } from '../invoice-details/invoice-details-slice';
import { failedToPerform, publishToast } from '@/common/toast';

export interface IProcessInvoiceModalData {
  open: boolean;
  close: any;
  data: { timeReportData: ITimeReportDetailsTableRowData[]; otherCostData: IOtherCostTableRowData[] };
  type: string;
}

const ProcessInvoiceModal: React.FC<IProcessInvoiceModalData> = (props) => {
  let { processInvoiceModalDialogContainer } = styles;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const serviceSheetData = useAppSelector((state) => state.processInvoiceTabs.serviceSheetData);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);
  function hideModalDialog() {
    props.close();
  }
  function createInvoice() {
    const processInvoiceData: IProcessInvoiceData = {
      invoiceId: invoiceData.InvoiceID,
      invoiceDate: new Date(invoiceData.DateOnInvoice),
      invoiceAmount: invoiceData.InvoiceAmount,
      periodEndDate: new Date(invoiceData.PeriodEnding),
      invoiceReceivedDate: new Date(invoiceData.InvoiceReceived),
      vendor: contract.vendorName,
      assignedTo: '',
      contractNumber: invoiceData.ContractNumber,
      type: contract.contractType,
      invoiceTimeReportCostDetails: props.data.timeReportData,
      invoiceOtherCostDetails: props.data.otherCostData,
      invoiceServiceSheet: serviceSheetData,
    };
    processInvoiceService.createInvoice(processInvoiceData).subscribe({
      next: (data) => {
        if (data > 0) {
          dispatch(setInvoiceData({ ...invoiceData, InvoiceKey: data }));
          dispatch(setRowData([]));
          dispatch(setOtherCostData([]));
          if (serviceSheetData) {
            dispatch(setServiceSheetData({ ...serviceSheetData, invoiceKey: data }));
            if (serviceSheetData) {
              dispatch(setServiceSheetData({ ...serviceSheetData, invoiceKey: data }));
            }
            dispatch(setServiceSheetNameChange(false));
            dispatch(setNotificationStatus(true));
            publishToast({ type: 'success', message: `Invoice #${invoiceData.InvoiceID} processed.` });
          }
        }
      },
      error: (error) => {
        console.log(error);
        publishToast({ type: 'error', message: failedToPerform('create invoice', 'Server Error') });
      },
    });
    props.close();
  }

  function updateInvoiceServiceSheet() {
    if (serviceSheetData) {
      processInvoiceService.updateInvoice(serviceSheetData).subscribe({
        next: (data) => {
            dispatch(setServiceSheetData({ ...serviceSheetData, uniqueServiceSheetName: data }));
            dispatch(setServiceSheetNameChange(false));
            dispatch(setNotificationStatus(true));
            publishToast({ type: 'success', message: `Invoice updated successfully.` });
        },
        error: (error) => {
          console.log(error);
          publishToast({ type: 'error', message: failedToPerform('update invoice', 'Server Error') });
        },
      });
      props.close();
    }
  }

  return (
    <Fragment>
      {props.type == 'finish-invoice' && (
        <GoAModal
          heading='Process Invoice'
          open={props.open}
          actions={
            <GoAButtonGroup alignment='end'>
              <GoAButton type='secondary' onClick={() => hideModalDialog()}>
                Cancel
              </GoAButton>
              <GoAButton type='primary' onClick={() => createInvoice()}>
                Yes, Process
              </GoAButton>
            </GoAButtonGroup>
          }
        >
          <div className={processInvoiceModalDialogContainer}>
            <div>The following will occur.</div>
            <div>
              <ul>
                <li>payment scheduling and status changes</li>
                <li>details will no longer be available for future edits or reconciliation</li>
              </ul>
            </div>
            <div>Complete payment process in Ariba.</div>
          </div>
        </GoAModal>
      )}

      {props.type == 'update-service-sheet' && (
        <GoAModal
          heading='Updating Service Sheet Name'
          open={props.open}
          actions={
            <GoAButtonGroup alignment='end'>
              <GoAButton type='secondary' onClick={() => hideModalDialog()}>
                Cancel
              </GoAButton>
              <GoAButton type='primary' onClick={() => updateInvoiceServiceSheet()}>
                Update
              </GoAButton>
            </GoAButtonGroup>
          }
        >
          <div className={processInvoiceModalDialogContainer}>
            <div>The following will occur.</div>
            <div>
              <ul>
                <li>payment scheduling and payment status changes to details of invoice</li>
              </ul>
            </div>
            <div>Invoice processing is now complete</div>
          </div>
        </GoAModal>
      )}
    </Fragment>
  );
};

export default ProcessInvoiceModal;
