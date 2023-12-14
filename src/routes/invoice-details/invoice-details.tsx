import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

let {
  container,
  content,
  sideBar,
  main,
  footer,
  header,
  tabGroupContainer,
  tabList,
  tabContainer,
} = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const [allData, setAllData] = useState([] as IDetailsTableRowData[]);
  const [tabIndex, setTabIndex] = useState<number>(1);

  let invoiceAmount = 27000;
  const [reconciledAmount, setReconciledAmount] = useState<number>(0);
  useEffect(() => {
    const subscription = invoiceDetailsService.getAll().subscribe((results) => {
      const data = results.slice();

      setAllData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [invoiceId]);

  function onAddRemove(newTotal: number) {
    //update the totalizer
    setReconciledAmount(newTotal);
  }
  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice</div>
          <Totalizer
            invoiceAmount={invoiceAmount}
            reconciledAmount={reconciledAmount}
            remainingAmount={invoiceAmount - reconciledAmount}
          />
          <Summary />
        </div>
        <div className={main}>
          <div className={tabGroupContainer}>
            <div className={tabList}>
              <button
                id='Details'
                role='tab'
                aria-selected={tabIndex === 1}
                onClick={(e) => setTabIndex(1)}
              >
                <span>Details</span>
              </button>
              <button
                id='Reconciled'
                role='tab'
                aria-selected={tabIndex === 2}
                onClick={(e) => setTabIndex(2)}
              >
                <span>Reconciled</span>
              </button>
            </div>
            <div className={tabContainer}>
              {tabIndex === 1 && (
                <DetailsTable data={allData} onAddRemove={onAddRemove} />
              )}
              {tabIndex === 2 && <div>Coming Soon</div>}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>footer</div>
    </div>
  );
}
