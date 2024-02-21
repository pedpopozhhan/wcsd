import styles from './summary.module.scss';
import { yearMonthDay } from '@/common/dates';
import { GoAIconButton } from '@abgov/react-components';
import { useAppSelector } from '@/app/hooks';
const { container, assignedToLabel, assignedToIcon, assignedToHeader } = styles;
const Summary: React.FC = () => {
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);
  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>{contract.vendorName}</div>
      </div>
      <div>
        <div className={assignedToHeader}>
          <label>Assigned to</label>
          <div className={assignedToIcon}>
            <GoAIconButton icon='information-circle' />
          </div>
        </div>
        <div className={assignedToLabel}>Sarah Tale</div>
      </div>
      <div>
        <div>Contract no.</div>
        <div>{invoiceData.ContractNumber}</div>
      </div>
      <div>
        <div>Type</div>
        <div>{contract.contractType}</div>
      </div>
      <div>
        <div>Invoice no.</div>
        <div>{invoiceData.InvoiceID}</div>
      </div>
      <div>
        <div>Invoice date</div>
        <div>{yearMonthDay(invoiceData.DateOnInvoice)}</div>
      </div>
      <div>
        <div>Invoice received</div>
        <div>{yearMonthDay(invoiceData.InvoiceReceived)}</div>
      </div>
      <div>
        <div>Period ending</div>
        <div>{yearMonthDay(invoiceData.PeriodEnding)}</div>
      </div>
    </div>
  );
};

export default Summary;
