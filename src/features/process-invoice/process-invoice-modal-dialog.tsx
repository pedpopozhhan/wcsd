import { GoAButton, GoAButtonGroup, GoAModal } from '@abgov/react-components';
import { useState } from 'react';
import styles from './process-invoice.module.scss';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setInvoiceData } from '@/app/app-slice';
import { setNotificationStatus } from './process-invoice-slice';
import { setServiceSheetData, setServiceSheetNameChange } from './tabs/service-sheet-slice';
import { setOtherCostData, setRowData } from '../invoice-details/invoice-details-slice';

export interface IProcessInvoiceModalData {
  open: boolean;
  close: any;
  data: { timeReportData: IDetailsTableRowData[]; otherCostData: IOtherCostTableRowData[] };
}

const ProcessInvoiceModal: React.FC<IProcessInvoiceModalData> = (props) => {
  let { processInvoiceModalDialogContainer } = styles;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const serviceSheetData = useAppSelector((state) => state.serviceSheetData.value);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);
  const [saveInvoiceStatus, setSaveInvoiceStatus] = useState<boolean>(false);
  const {} = props.data.timeReportData;
  function hideModalDialog() {
    props.close();
  }
  function createInvoice() {
    const processInvoiceData: IProcessInvoiceData = {
      invoiceNumber: invoiceData.InvoiceID,
      invoiceDate: new Date(invoiceData.DateOnInvoice),
      invoiceAmount: invoiceData.InvoiceAmount,
      periodEndDate: new Date(invoiceData.PeriodEnding),
      invoiceReceivedDate: new Date(invoiceData.InvoiceReceived),
      vendor: contract.vendorName,
      assignedTo: '',
      contractNumber: invoiceData.ContractNumber,
      type: contract.contractType,
      createdBy: '',
      invoiceTimeReportCostDetails: props.data.timeReportData,
      invoiceOtherCostDetails: props.data.otherCostData,
      invoiceServiceSheet: serviceSheetData,
    };
    const subscription = processInvoiceService.createInvoice(processInvoiceData).subscribe({
      next: (data) => {
        if (data > 0) {
          setSaveInvoiceStatus(true);
          dispatch(setInvoiceData({ ...invoiceData, InvoiceKey: data }));
          dispatch(setRowData([]));
          dispatch(setOtherCostData([]));
          dispatch(setServiceSheetNameChange(false));
          dispatch(setNotificationStatus(true));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
    if (saveInvoiceStatus) {
      subscription.unsubscribe();
    }

    props.close();
  }
  return (
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
  );
};

export default ProcessInvoiceModal;
