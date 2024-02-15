import { useState, useEffect, FC } from 'react';
import styles from '@/features/process-invoice/tabs/details-tab.module.scss';

import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import { ITimeReportDetailsTableRowData } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { useAppDispatch, useAppSelector } from '@/app/hooks';


import InvoiceCostDataTable from './invoice-cost-details-table';
import InvoiceOtherCostTable from './invoice-other-costs-table';

let { container, tabContainer, reconciledDetailsDiv, otherCostsDiv, otherCostHeader } = styles;

interface IReconciledTabProps { }

const InvoiceDetailsTab: FC<IReconciledTabProps> = (props: IReconciledTabProps) => {
  const otherCostData = useAppSelector((state) => state.processInvoiceTabs.otherCostsData);
  const costDetailsData = useAppSelector((state) => state.processInvoiceTabs.costDetailsData);

  return (
    <div className={container}>
      <div className={tabContainer}>
        <div className={reconciledDetailsDiv}>
          <InvoiceCostDataTable data={costDetailsData} />
        </div>
        <div className={otherCostHeader}>Other Costs</div>
        <div className={otherCostsDiv}>
          <InvoiceOtherCostTable data={otherCostData} />
        </div>{' '}
      </div>
    </div>
  );
};
export default InvoiceDetailsTab;
