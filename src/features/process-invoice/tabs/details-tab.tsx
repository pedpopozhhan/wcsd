import { FC } from 'react';
import styles from '@/features/process-invoice/tabs/details-tab.module.scss';
import { useAppSelector } from '@/app/hooks';


import InvoiceCostDataTable from '@/features/process-invoice/tabs/invoice-cost-details-table';
import InvoiceOtherCostTable from '@/features/process-invoice/tabs/invoice-other-costs-table';

let { container, tabContainer, costDetailsDiv, otherCostsDiv, otherCostHeader } = styles;

interface IReconciledTabProps { }

const InvoiceDetailsTab: FC<IReconciledTabProps> = (props: IReconciledTabProps) => {
  const otherCostData = useAppSelector((state) => state.processInvoiceTabs.otherCostsData);
  const costDetailsData = useAppSelector((state) => state.processInvoiceTabs.costDetailsData);

  return (
    <div className={container}>
      <div className={tabContainer}>
        <div className={costDetailsDiv}>
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
