import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import PageLoader from '@/common/page-loader';
import { IProcessedInvoiceTableRowData } from '@/interfaces/processed-invoice/processed-invoice-table-row-data';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import processedInvoicesService from '@/services/processed-invoices.service';

import { failedToPerform, publishToast } from '@/common/toast';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';

import processedInvoiceDetailService from '@/services/processed-invoice-detail.service';
import {
  setServiceSheetData,
  setcostDetailsData,
  setotherCostsData,
  setReadOnly,
  setInvoiceAmount,
  setInvoiceId,
} from '@/features/process-invoice/tabs/process-invoice-tabs-slice';

interface IProcessedTabDetailsAllProps {
  contractNumber: string | undefined;
}

const ProcessedTabDetails: React.FunctionComponent<IProcessedTabDetailsAllProps> = ({ contractNumber }) => {
  //Object for the page data
  const [pageData, setPageData] = useState<IProcessedInvoiceTableRowData[]>([]);

  //Data set
  const [data, setData] = useState<IProcessedInvoiceTableRowData[]>([]);

  //Loader
  const [loading, setIsLoading] = useState(true);

  //Pagination
  // page number
  const [page, setPage] = useState(1);
  //count per page
  const [perPage, setPerPage] = useState(5);
  const [, setPreviousSelectedPerPage] = useState(5);

  //Sorting
  const [, setSortCol] = useState('invoiceDate');
  const [, setSortDir] = useState(-1);
  const [contractID] = useState<string | undefined>(contractNumber);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const subscription = processedInvoicesService.getInvoices(String(contractID)).subscribe({
      next: (results) => {
        setData(results.invoices);
        setPageData(results.invoices.slice(0, perPage));
        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [contractID]);
  // page, perPage, searchValue, sortCol, sortDir,

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
    setSortCol(sortBy);
    setSortDir(sortDir);
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

  function pullDetailsForInvoice(invoiceKey?: number) {
    const subscription = processedInvoiceDetailService.getInvoiceDetail(Number(invoiceKey)).subscribe({
      next: (results) => {
        setIsLoading(true);
        dispatch(setInvoiceId(results.invoice.invoiceId));
        dispatch(setInvoiceAmount(results.invoice.invoiceAmount));
        dispatch(setServiceSheetData(results.invoice.invoiceServiceSheet));
        dispatch(setReadOnly(true));
        dispatch(setcostDetailsData(results.invoice.invoiceTimeReportCostDetails));
        dispatch(setotherCostsData(results.invoice.invoiceOtherCostDetails));
        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
        publishToast({ type: 'error', message: failedToPerform('Get details of selected invoice or dispatch values to slice', 'Server Error') });
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  }

  function invoiceIdClick(invoiceKey?: number) {
    if (invoiceKey) {
      pullDetailsForInvoice(invoiceKey);
      navigate(`/ProcessedInvoice/${invoiceKey}`);
    }
  }

  return (
    <>
      <PageLoader visible={loading} />
      <div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th style={{ maxWidth: '15%' }}>
                  <GoATableSortHeader name='flightReportDate'>Invoice Date</GoATableSortHeader>
                </th>
                <th style={{ maxWidth: '15%' }}>Invoice No.</th>
                <th style={{ maxWidth: '25%' }}>Invoice Amount</th>
                <th style={{ maxWidth: '35%' }}>Payment</th>
                <th style={{ maxWidth: '10%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {pageData && pageData.length > 0 ? (
                pageData.map((record: IProcessedInvoiceTableRowData) => (
                  <tr key={record.invoiceId}>
                    <td>{yearMonthDay(record.invoiceDate)}</td>
                    <td>
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() => invoiceIdClick(record?.invoiceKey)}
                      >
                        {record.invoiceId}
                      </GoAButton>
                    </td>
                    <td>{convertToCurrency(record?.invoiceAmount)}</td>
                    <td>{record?.paymentStatus}</td>
                    <td>
                      <GoAIconButton icon='chevron-forward' onClick={() => invoiceIdClick(record?.invoiceKey)} />
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

        <div className={data && data.length > 0 ? 'visible pagination' : 'not-visible pagination'} style={{ paddingTop: '50px' }}>
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
      </div>
    </>
  );
};

export default ProcessedTabDetails;
