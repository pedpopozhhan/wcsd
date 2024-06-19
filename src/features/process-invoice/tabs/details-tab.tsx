import { FC } from 'react';
import styles from '@/features/process-invoice/tabs/details-tab.module.scss';
import { useAppSelector } from '@/app/hooks';

import InvoiceCostDataTable from '@/features/process-invoice/tabs/invoice-cost-details-table';
import InvoiceOtherCostTable from '@/features/process-invoice/tabs/invoice-other-costs-table';

const { container, tabContainer, costDetailsDiv, otherCostsDiv, otherCostHeader } = styles;

interface IReconciledTabProps {}

const InvoiceDetailsTab: FC<IReconciledTabProps> = () => {
  //   const otherCostData = useAppSelector((state) => state.processInvoiceTabs.otherCostsDataPIT);
  //   const costDetailsData = useAppSelector((state) => state.processInvoiceTabs.costDetailsDataPIT);
  const otherCostData = useAppSelector((state) => state.app.otherCostData);
  const addedTimeReportData = useAppSelector((state) => state.app.addedTimeReportData);
  return (
    <div className={container}>
      <div className={tabContainer}>
        <div className={costDetailsDiv}>
          <InvoiceCostDataTable data={addedTimeReportData.map((x) => x.data)} />
        </div>
        <div className={otherCostHeader}>Other Costs</div>
        <div className={otherCostsDiv}>
          <InvoiceOtherCostTable data={otherCostData} />
        </div>
      </div>
    </div>
  );
};
export default InvoiceDetailsTab;
