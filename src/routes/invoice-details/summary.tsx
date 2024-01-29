import styles from './summary.module.scss';
import { useEffect, useState } from 'react';
import { yearMonthDay } from '@/common/dates';
import { GoAIconButton } from '@abgov/react-components';
let { container, assignedToLabel, assignedToIcon, assignedToHeader } = styles;

interface ISummary {
  InvoiceID: string;
  DateOnInvoice: Date;
  InvoiceAmount: number;
  PeriodEnding: Date;
  InvoiceReceived: Date;
  ContractNumber: string;
}

const Summary: React.FC<ISummary> = (props) => {
  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>Air Spray Ltd.</div>
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
        <div>{props.ContractNumber}</div>
      </div>
      <div>
        <div>Type</div>
        <div>Casual</div>
      </div>
      <div>
        <div>Invoice no.</div>
        <div>{props.InvoiceID}</div>
      </div>
      <div>
        <div>Invoice date</div>
        <div>{yearMonthDay(props.DateOnInvoice)}</div>
      </div>
      <div>
        <div>Invoice received</div>
        <div>{yearMonthDay(props.InvoiceReceived)}</div>
      </div>
      <div>
        <div>Period ending</div>
        <div>{yearMonthDay(props.PeriodEnding)}</div>
      </div>
    </div>
  );
};

export default Summary;
