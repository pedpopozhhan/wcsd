import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import { GoATab, GoATabs } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';

let { container, content, sideBar, main, footer, header, tabs, testdiv } =
  styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const initialTab = 1;
  const [allData, setAllData] = useState([] as IDetailsTableRowData[]);
  //   let allData = [] as IDetailsTableRowData[];
  useEffect(() => {
    const subscription = invoiceDetailsService.getAll().subscribe((results) => {
      const data = results.slice();

      // sort ascending

      //   data.sort((a, b) => {
      //     return b.vendorName > a.vendorName
      //       ? -1
      //       : b.vendorName < a.vendorName
      //       ? 1
      //       : 0;
      //   });

      setAllData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
    //   });
  }, [invoiceId]);
  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>Invoice</div>
          <Totalizer />
          <Summary />
        </div>
        <div className={main}>
          <GoATabs initialTab={initialTab}>
            <GoATab heading='Details'>
              <DetailsTable data={allData} />
            </GoATab>
          </GoATabs>
        </div>
      </div>
      <div className={footer}>footer</div>
    </div>
  );
}
