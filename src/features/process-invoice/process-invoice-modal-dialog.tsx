import { GoAButton, GoAButtonGroup, GoAModal } from '@abgov/react-components';
import { useState } from 'react';
import styles from './process-invoice.module.scss';
import processInvoiceService from '@/services/process-invoice.service';
import { IProcessInvoiceData } from '@/interfaces/process-invoice/process-invoice-data';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

export interface IProcessInvoiceModalData {
  open: boolean;
  close: any;
  data: { timeReportData: IDetailsTableRowData[]; otherCostData: IOtherCostTableRowData[] };
}

const ProcessInvoiceModal: React.FC<IProcessInvoiceModalData> = (props) => {
  let { processInvoiceModalDialogContainer } = styles;
  const navigate = useNavigate();

  const invoiceData = useAppSelector((state) => state.invoiceData);
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
      vendor: 'test',
      assignedTo: 'vpatel',
      contractNumber: 'abc123',
      type: 'casual',
      createdBy: 'vpatel',
      invoiceTimeReportCostDetails: props.data.timeReportData,
      invoiceOtherCostDetails: props.data.otherCostData,
      invoiceServiceSheet: {
        uniqueServiceSheetName: 'SS-A101',
        purchaseGroup: 'W01 (FP_W01)',
        serviceDescription: 'Processional Services',
        communityCode: 'TestCommunity',
        materialGroup: 'TestMG',
        accountType: 'casual',
        quantity: 1,
        unitOfMeasure: 'Hour',
        price: 100.5,
      },
    };
    const subscription = processInvoiceService.createInvoice(processInvoiceData).subscribe({
      next: (data) => {
        if (data > 0) {
          console.log(data);
          setSaveInvoiceStatus(true);
          navigate(`/reconciliation`, { state: { invoiceNumber: processInvoiceData.invoiceNumber } });
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
        <div>This is irreversible. The following will occur.</div>
        <div>
          <ul>
            <li>details will no longer be available for future edits or reconciliation</li>
          </ul>
        </div>
        <div>Complete payment process in Ariba.</div>
      </div>
    </GoAModal>
  );
};

export default ProcessInvoiceModal;
