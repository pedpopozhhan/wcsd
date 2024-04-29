import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import PageLoader from '@/common/page-loader';
import { IProcessedInvoiceTableRowData } from '@/interfaces/processed-invoice/processed-invoice-table-row-data';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import processedInvoicesService from '@/services/processed-invoices.service';

import { failedToPerform, publishToast } from '@/common/toast';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useConditionalAuth } from '@/app/hooks';
import { PaymentStatusCleared } from '@/common/types/payment-status';
import styles from '@/features/vendor-time-reports/tabs/processed-tab-details.module.scss';

const { checboxHeader, checboxControl, headerRow } = styles;
import processedInvoiceDetailService from '@/services/processed-invoice-detail.service';

import {
  setCostDetailsData,
  setOtherCostsData,
  setInvoiceAmount,
  setInvoiceNumber,
} from '@/features/process-invoice/tabs/process-invoice-tabs-slice';
import { navigateTo } from '@/common/navigate';
import { setInvoiceData } from '@/app/app-slice';

interface IProcessedTabDetailsAllProps {
  contractNumber: string | undefined;
}

interface IRowItem extends IProcessedInvoiceTableRowData {
  isChecked: boolean;
}

const ProcessedTabDetails: React.FunctionComponent<IProcessedTabDetailsAllProps> = ({ contractNumber }) => {
  const auth = useConditionalAuth();
  //Object for the page data
  const [pageData, setPageData] = useState<IRowItem[]>([]);

  //Data set
  const [data, setData] = useState<IRowItem[]>([]);

  //Loader
  const [loading, setIsLoading] = useState(true);

  const [retry, setRetry] = useState<boolean>(false);

  //Pagination
  // page number
  const [page, setPage] = useState(1);
  //count per page
  const [perPage, setPerPage] = useState(10);
  const [, setPreviousSelectedPerPage] = useState(10);

  //Sorting
  const [contractID] = useState<string | undefined>(contractNumber);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { invoiceAmountLabel } = styles;

  useEffect(() => {
    const subscription = processedInvoicesService.getInvoices(auth?.user?.access_token, String(contractID)).subscribe({
      next: (results) => {
        const rows = results.invoices.map((x) => {
          return { isChecked: false, ...x };
        });
        setData(rows);
        setPageData(rows.slice(0, perPage));
        setIsLoading(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('load invoices.', error.response.data),
          callback: () => {
            setRetry(!retry);
          },
        });
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [contractID, auth, retry]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    const _invoices = data.slice(offset, offset + perPage);
    setPageData(_invoices);
  }, [data]);

  function sortData(sortBy: string, sortDir: number) {
    data.sort((a: IProcessedInvoiceTableRowData, b: IProcessedInvoiceTableRowData) => {
      const varA = a[sortBy as keyof IProcessedInvoiceTableRowData];
      const varB = b[sortBy as keyof IProcessedInvoiceTableRowData];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setData(data.slice());
    setPageData(data.slice(0, perPage));
    setPage(1);
    setPreviousSelectedPerPage(perPage);
  }
  function getTotalPages() {
    const num = data ? Math.ceil(data.length / perPage) : 0;
    return num;
  }

  //Pagination change page
  function changePage(newPage: number) {
    if (newPage) {
      setIsLoading(true);
      const offset = (newPage - 1) * perPage;
      const _processedInvoices = data.slice(offset, offset + perPage);
      setPerPage(perPage);
      setPage(newPage);
      setPageData(_processedInvoices);
      setIsLoading(false);
    }
  }

  //#endregion
  function pullDetailsForInvoice(invoiceId: string) {
    const subscription = processedInvoiceDetailService.getInvoiceDetail(auth?.user?.access_token, invoiceId).subscribe({
      next: (results) => {
        setIsLoading(true);
        const invoiceForContext = {
          InvoiceID: results.invoice.invoiceId,
          InvoiceNumber: results.invoice.invoiceNumber,
          DateOnInvoice: new Date(results.invoice.invoiceDate).toISOString(),
          InvoiceAmount: results.invoice.invoiceAmount,
          PeriodEnding: new Date(results.invoice.periodEndDate).toISOString(),
          InvoiceReceived: new Date(results.invoice.invoiceReceivedDate).toISOString(),
          ContractNumber: contractNumber,
          UniqueServiceSheetName: results.invoice.uniqueServiceSheetName,
          ServiceDescription: results.invoice.serviceDescription,
        };

        dispatch(setInvoiceData(invoiceForContext));
        dispatch(setInvoiceNumber(results.invoice.invoiceNumber));
        dispatch(setInvoiceAmount(results.invoice.invoiceAmount));
        dispatch(setCostDetailsData(results.invoice.invoiceTimeReportCostDetails));
        dispatch(setOtherCostsData(results.invoice.invoiceOtherCostDetails));
        setIsLoading(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({ type: 'error', message: failedToPerform('Get details of selected invoice or dispatch values to slice', error.response.data) });
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }

  function invoiceNumberClick(invoiceId: string) {
    if (invoiceId) {
      pullDetailsForInvoice(invoiceId);
      navigate(`/ProcessedInvoice/${invoiceId}`);
    }
  }

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'selectAll') {
      const allInvoices = data?.map((record: IRowItem) =>
        record.chargeExtractId === null ? { ...record, isChecked: checked } : record,
      );
      setData(allInvoices);
    } else {
      const selectedInvoices = data?.map((record: IRowItem) =>
        record.invoiceId?.toString() === name ? { ...record, isChecked: checked } : record,
      );
      setData(selectedInvoices);
    }
  };


  const generateExtract = () => {
    const items = data?.filter((fr: IRowItem) => fr.isChecked === true);
    const trItems: string[] = [];
    items?.map((record: IRowItem) => {
      trItems.push(record.invoiceId);
    });

    alert('Selected invoices to generate extract are:' + trItems.length);

    // if (trItems.length > 0) {
    //   dispatch(getInvoiceDetails({ token: auth?.user?.access_token, ids: trItems }));
    // }
    // if (trItems.length == 0) {
    //   dispatch(resetInvoiceDetails());
    // }
  };

  return (
    <>
      <PageLoader visible={loading} />
      <div>
        <GoAButton
          type='secondary'
          size='compact'
          disabled={data?.length <= 0 || data?.filter((item: IRowItem) => item?.isChecked === true).length <= 0}
          onClick={generateExtract}
        >Transfer</GoAButton>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th className={checboxHeader}>
                  <input
                    className={checboxControl}
                    type='checkbox'
                    name='selectAll'
                    checked={data.length > 0 && data?.filter((item: IRowItem) => item?.isChecked !== true && item?.chargeExtractId === null).length < 1}
                    disabled={pageData.length === 0}
                    onChange={handleCheckBoxChange}
                  ></input>
                </th>
                <th style={{ maxWidth: '15%' }}>
                  <GoATableSortHeader name='invoiceDate'>Invoice Date</GoATableSortHeader>
                </th>
                <th className={headerRow} style={{ maxWidth: '15%' }}>
                  Invoice No.
                </th>
                <th className={headerRow} style={{ maxWidth: '25%' }}>
                  Invoice Amount
                </th>
                <th className={headerRow} style={{ maxWidth: '25%' }}>
                  Service Sheet No.
                </th>
                <th className={headerRow} style={{ maxWidth: '18%' }}>
                  Transfer Date
                </th>
                <th className={headerRow} style={{ maxWidth: '17%' }}>
                  Payment
                </th>
                <th className={headerRow} style={{ maxWidth: '10%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {pageData && pageData.length > 0 ? (
                pageData.map((record: IRowItem) => (
                  <tr key={record.invoiceNumber}>
                    <td style={{ padding: '12px 0 12px 32px' }}>
                      <input
                        className={checboxControl}
                        type='checkbox'
                        id={record.invoiceId.toString()}
                        name={record.invoiceId.toString()}
                        onChange={handleCheckBoxChange}
                        checked={record?.isChecked || false}
                        disabled={record?.chargeExtractId?.length > 0 ? true : false}
                      ></input>
                    </td>

                    <td>{yearMonthDay(record.invoiceDate)}</td>
                    <td>
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() => invoiceNumberClick(record?.invoiceId)}
                      >
                        {record.invoiceNumber}
                      </GoAButton>
                    </td>
                    <td className={invoiceAmountLabel}>{convertToCurrency(record?.invoiceAmount)}</td>
                    <td>{record?.uniqueServiceSheetName ? record.uniqueServiceSheetName : '--'}</td>
                    <td>{record?.documentDate ? yearMonthDay(record.documentDate) : '--'}</td>
                    <td>
                      {!record?.paymentStatus && <label>--</label>}
                      {record?.paymentStatus && record?.paymentStatus.toLowerCase() !== PaymentStatusCleared && (
                        <goa-badge type='information' content={record.paymentStatus}></goa-badge>
                      )}
                      {record?.paymentStatus && record?.paymentStatus.toLowerCase() === 'cleared' && (
                        <goa-badge type='success' content={record.paymentStatus}></goa-badge>
                      )}
                    </td>
                    <td>
                      <GoAIconButton icon='chevron-forward' onClick={() => invoiceNumberClick(record?.invoiceId)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className='centertext'>
                    No data avaliable
                  </td>
                </tr>
              )}
            </tbody>
          </GoATable>
        </div>

        {data && data.length > 0 && (
          <div style={{ paddingTop: '50px' }}>
            <GoABlock alignment='center'>
              <div style={{ display: 'flex', alignSelf: 'center' }}>
                <span style={{ whiteSpace: 'nowrap' }}>
                  Page {page} of {getTotalPages()}
                </span>
              </div>
              <GoASpacer hSpacing='fill' />

              <GoAPagination variant='links-only' itemCount={data.length} perPageCount={perPage} pageNumber={page} onChange={changePage} />
            </GoABlock>
          </div>
        )}
      </div>
    </>
  );
};

export default ProcessedTabDetails;
