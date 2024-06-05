import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import * as React from 'react';
import PageLoader from '@/common/page-loader';
import { yearMonthDay } from '@/common/dates';
import processInvoiceService from '@/services/process-invoice.service';
import { useEffect } from 'react';
import { useAppDispatch, useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import styles from './signed-off-tab-details.module.scss';
import { useNavigate } from 'react-router-dom';
import { convertToCurrency } from '@/common/currency';
import { setOtherCostData, setRowData } from '@/features/invoice-details/invoice-details-slice';
import { setInvoiceData } from '@/app/app-slice';
import { IInvoiceData } from '@/common/invoice-modal-dialog';
import { IInvoice } from '@/interfaces/invoices/invoice.interface';
const { headerRow, roboto } = styles;

interface IDraftsTabDetailsProps {
  contractNumber: string | undefined;
}

const DraftsTabDetails: React.FunctionComponent<IDraftsTabDetailsProps> = ({ contractNumber }) => {
  const auth = useConditionalAuth();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  //Data set
  const [data, setData] = React.useState<IInvoice[]>([]);
  //Loader
  const [loading, setIsLoading] = React.useState(true);

  //Pagination
  const [pageData, setPageData] = React.useState<IInvoice[]>([]);
  // page number
  const [page, setPage] = React.useState(1);
  //count per page
  const [perPage, setPerPage] = React.useState(10);
  const [, setPreviousSelectedPerPage] = React.useState(10);

  //Sorting

  useEffect(() => {
    setIsLoading(true);
    const subscription = processInvoiceService.getDrafts(auth?.user?.access_token, contractNumber).subscribe({
      next: (response) => {
        const sortedData = sort('invoiceDate', 1, response.invoices);
        setData(sortedData);
        // sort by what default
        setPageData(sortedData.slice(0, perPage));

        setIsLoading(false);
      },
      error: (error) => {
        setIsLoading(false);
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [auth]);

  function sortData(sortBy: string, sortDir: number) {
    const sortedData = sort(sortBy, sortDir, data);
    setData(sortedData.slice());
    setPageData(sortedData.slice(0, perPage));
    setPage(1);
    setPreviousSelectedPerPage(perPage);
  }
  function sort(sortBy: string, sortDir: number, rows: IInvoice[]): IInvoice[] {
    rows.sort((a: IInvoice, b: IInvoice) => {
      const varA = a[sortBy as keyof IInvoice];
      const varB = b[sortBy as keyof IInvoice];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    return rows.slice();
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
      const _flightReports = data.slice(offset, offset + perPage);

      setPerPage(perPage);
      setPage(newPage);
      setPageData(_flightReports);
      setIsLoading(false);
    }
  }

  //#endregion

  function invoiceNumberClick(invoice: IInvoice) {
    const invoiceForContext: IInvoiceData = {
      InvoiceID: invoice.invoiceId,
      InvoiceNumber: invoice.invoiceNumber,
      DateOnInvoice: new Date(invoice.invoiceDate).toISOString(),
      InvoiceAmount: invoice.invoiceAmount,
      PeriodEnding: new Date(invoice.periodEndDate).toISOString(),
      InvoiceReceived: new Date(invoice.invoiceReceivedDate).toISOString(),
      ContractNumber: contractNumber,
      UniqueServiceSheetName: invoice.uniqueServiceSheetName,
      ServiceDescription: invoice.serviceDescription,
      CreatedBy: invoice.createdBy,
    };
    dispatch(
      setRowData(
        invoice.invoiceTimeReportCostDetails.map((x, index) => {
          return { data: x, index: index, isAdded: true, isSelected: false };
        }),
      ),
    );
    dispatch(setOtherCostData(invoice.invoiceOtherCostDetails));
    dispatch(setInvoiceData(invoiceForContext));
    navigate(`/invoice/${invoice.invoiceNumber}`);
  }

  return (
    <>
      <PageLoader visible={loading} />

      <div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th>
                  <GoATableSortHeader name='invoiceDate' direction='asc'>
                    Invoice Date
                  </GoATableSortHeader>
                </th>
                <th className={headerRow}>Invoice No.</th>
                <th className={headerRow}>Invoice Amount</th>
                <th className={headerRow}></th>
              </tr>
            </thead>

            {!loading && (
              <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
                {pageData && pageData.length > 0 ? (
                  pageData.map((record: IInvoice) => (
                    <tr key={record.invoiceId}>
                      <td>{yearMonthDay(record.invoiceDate)}</td>
                      <td>
                        <GoAButton
                          {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                          size='compact'
                          type='tertiary'
                          onClick={() => invoiceNumberClick(record)}
                        >
                          {record.invoiceNumber}
                        </GoAButton>
                      </td>
                      <td className={roboto}>{convertToCurrency(record.invoiceAmount)}</td>
                      <td>
                        <GoAIconButton icon='chevron-forward' onClick={() => invoiceNumberClick(record)} />
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
            )}
          </GoATable>
        </div>

        {data && data.length > 0 && (
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {getTotalPages()}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination variant='links-only' itemCount={data.length || 10} perPageCount={perPage} pageNumber={page} onChange={changePage} />
          </GoABlock>
        )}
      </div>
    </>
  );
};

export default DraftsTabDetails;