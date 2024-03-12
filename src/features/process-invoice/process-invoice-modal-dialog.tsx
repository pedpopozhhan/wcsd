import { GoAButton, GoAButtonGroup, GoAModal } from '@abgov/react-components';
import { Fragment } from 'react';
import styles from './process-invoice.module.scss';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { useAppDispatch, useAppSelector, useConditionalAuth } from '@/app/hooks';
import { setInvoiceData } from '@/app/app-slice';
import { setNotificationStatus } from './process-invoice-slice';
import { setServiceSheetData, setServiceSheetNameChange } from './tabs/process-invoice-tabs-slice';
import { failedToPerform, publishToast } from '@/common/toast';
import { setOtherCostData, setRowData } from '@/features/invoice-details/invoice-details-slice';
import { EmptyInvoiceId } from '@/common/types/invoice';
import { navigateTo } from '@/common/navigate';

export interface IProcessInvoiceModalData {
  open: boolean;
  close: () => void;
  data: { timeReportData: ITimeReportDetailsTableRowData[]; otherCostData: IOtherCostTableRowData[] };
  type: string;
}

const ProcessInvoiceModal: React.FC<IProcessInvoiceModalData> = (props) => {
  const auth = useConditionalAuth();
  const { processInvoiceModalDialogContainer } = styles;
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const serviceSheetData = useAppSelector((state) => state.processInvoiceTabs.serviceSheetData);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);
  function hideModalDialog() {
    props.close();
  }
  function getInvoiceData(): IProcessInvoiceData {
    return {
      invoiceId: invoiceData.InvoiceID,
      invoiceNumber: invoiceData.InvoiceNumber,
      invoiceDate: new Date(invoiceData.DateOnInvoice),
      invoiceAmount: invoiceData.InvoiceAmount,
      periodEndDate: new Date(invoiceData.PeriodEnding),
      invoiceReceivedDate: new Date(invoiceData.InvoiceReceived),
      vendorBusinessId: contract.businessId,
      vendorName: contract.vendorName,
      assignedTo: '',
      contractNumber: invoiceData.ContractNumber,
      type: contract.contractType,
      uniqueServiceSheetName: serviceSheetData.uniqueServiceSheetName,
      purchaseGroup: serviceSheetData.purchaseGroup,
      serviceDescription: serviceSheetData.serviceDescription,
      communityCode: serviceSheetData.communityCode,
      materialGroup: serviceSheetData.materialGroup,
      accountType: serviceSheetData.accountType,
      quantity: serviceSheetData.quantity,
      unitOfMeasure: serviceSheetData.unitOfMeasure,
      price: serviceSheetData.price,
      invoiceTimeReportCostDetails: props.data.timeReportData,
      invoiceOtherCostDetails: props.data.otherCostData,
    };
  }

  function createInvoice() {
    let errored = false;
    processInvoiceService.createInvoice(auth?.user?.access_token, getInvoiceData()).subscribe({
      next: (data) => {
        if (data.toString() !== EmptyInvoiceId) {
          dispatch(setInvoiceData({ ...invoiceData, InvoiceID: data.toString() }));
          dispatch(setRowData([]));
          dispatch(setOtherCostData([]));
          if (serviceSheetData) {
            dispatch(setServiceSheetNameChange(false));
          }
          dispatch(setNotificationStatus(true));
          publishToast({ type: 'success', message: `Invoice #${invoiceData.InvoiceNumber} processed.` });
        }
      },
      error: (error) => {
        errored = true;
        console.log(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('create invoice', 'Connection Error'),
          callback: () => {
            createInvoice();
          },
        });
      },
    });
    if (!errored) {
      props.close();
    }
  }

  function updateInvoiceServiceSheet() {
    let errored = false;
    if (serviceSheetData) {
      processInvoiceService.updateInvoice(auth?.user?.access_token, getInvoiceData()).subscribe({
        next: (data) => {
          dispatch(setServiceSheetData({ ...serviceSheetData, uniqueServiceSheetName: data }));
          dispatch(setServiceSheetNameChange(false));
          dispatch(setNotificationStatus(true));
          publishToast({ type: 'success', message: 'Invoice updated successfully.' });
        },
        error: (error) => {
          errored = true;
          console.log(error);
          if (error.response && error.response.status === 403) {
            navigateTo('unauthorized');
          }
          publishToast({
            type: 'error',
            message: failedToPerform('update invoice', 'Connection Error'),
            callback: () => {
              updateInvoiceServiceSheet();
            },
          });
        },
      });
      if (!errored) {
        props.close();
      }
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
