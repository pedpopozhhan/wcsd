import { useParams } from 'react-router-dom';
import styles from './invoice-details.module.scss';
import Summary from './summary';
import Totalizer from './totalizer';
import DetailsTable from './details-table';
import { useEffect, useState } from 'react';
import invoiceDetailsService from '@/services/invoice-details.service';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { GoAButton, GoATable } from '@abgov/react-components';
import InvoiceModalDialog from '@/common/invoiceModalDialog';

let {
  container,
  content,
  sideBar,
  main,
  footer,
  header,
  tabs,
  testdiv,
  tabGroupContainer,
  tabList,
  tabContainer,
  tableInvoiceHeader,
} = styles;

export default function InvoiceDetails() {
  const { invoiceId } = useParams();
  const initialTab = 1;
  const [allData, setAllData] = useState([] as IDetailsTableRowData[]);
  const [tabIndex, setTabIndex] = useState<number>(1);
  
  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const editInvoice = () => {
    setParentShowModal(true);
  }

  useEffect(() => {
    const subscription = invoiceDetailsService.getAll().subscribe((results) => {
      const data = results.slice();

      setAllData(data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [invoiceId]);

  return (
    <div className={container}>
      <div className={content}>
        <div className={sideBar}>
          <div className={header}>
            <table className={tableInvoiceHeader}>
              <tr>
                <td>Invoice</td>
                <td></td>
                <td><GoAButton type='tertiary' onClick={editInvoice}>Edit</GoAButton></td>
              </tr>
            </table>
          </div>
          <Totalizer />
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
              {tabIndex === 1 && <DetailsTable data={allData} />}
              {tabIndex === 2 && <div>Coming Soon</div>}
            </div>
          </div>
        </div>
      </div>
      <div className={footer}>footer</div>
      <InvoiceModalDialog isAddition = 'false' visible = {parentShowModal} showInvoiceDialog ={setParentShowModal} />
    </div>
  );
}
