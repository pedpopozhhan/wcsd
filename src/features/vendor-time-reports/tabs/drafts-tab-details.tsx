import { GoATable, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton, GoAButton } from '@abgov/react-components';
import * as React from 'react';
import PageLoader from '@/common/page-loader';
import { yearMonthDay } from '@/common/dates';
import processInvoiceService from '@/services/process-invoice.service';
import { useEffect } from 'react';
import { useAppDispatch, useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import styles from './signed-off-tab-details.module.scss';
import { convertToCurrency } from '@/common/currency';
import { IInvoice } from '@/interfaces/process-invoice/process-invoice-data';
import { clickOnDraftInvoice } from '@/features/invoice-details/invoice-details-actions';
import { setFlightReportIds } from '@/app/app-slice';
import { replaceSpacesWithNonBreaking } from '@/common/string-functions';
const { headerRow, roboto } = styles;

interface IRowItem extends IInvoice {
  row: number;
}
interface IDraftsTabDetailsProps {
  contractNumber: string | undefined;
}

const DraftsTabDetails: React.FunctionComponent<IDraftsTabDetailsProps> = ({ contractNumber }) => {
  const auth = useConditionalAuth();
  const dispatch = useAppDispatch();
  //Data set
  const [data, setData] = React.useState<IRowItem[]>([]);
  //Loader
  const [loading, setIsLoading] = React.useState(true);

  //Pagination
  const [pageData, setPageData] = React.useState<IRowItem[]>([]);
  // page number
  const [page, setPage] = React.useState(1);
  //count per page
  const [perPage, setPerPage] = React.useState(10);
  const [, setPreviousSelectedPerPage] = React.useState(10);

  //Sorting

  useEffect(() => {
    setIsLoading(true);
    // move this to epic, so can
    const subscription = processInvoiceService.getDrafts(auth?.user?.access_token, contractNumber).subscribe({
      next: (response) => {
        const sortedData = sort(
          'invoiceDate',
          1,
          response.invoices.map((x, i) => {
            return { row: i + 1, ...x };
          }),
        );
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
    setPreviousSelectedPerPage(perPage);
  }
  function sort(sortBy: string, sortDir: number, rows: IRowItem[]): IRowItem[] {
    rows.sort((a: IInvoice, b: IInvoice) => {
      const varA = a[sortBy as keyof IInvoice];
      const varB = b[sortBy as keyof IInvoice];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    return rows.slice().map((x, i) => {
      x.row = i + 1;
      return x;
    });
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
    dispatch(clickOnDraftInvoice({ token: auth?.user?.access_token, invoice: invoice, contractNumber: contractNumber }));
    dispatch(setFlightReportIds(invoice.invoiceTimeReports.map((x) => x.flightReportId)));
  }

  return (
    <>
      <PageLoader visible={loading} />

      <div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th></th>
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
                  pageData.map((record: IRowItem) => (
                    <tr key={record.invoiceId}>
                      <td>{record.row}</td>
                      <td>{yearMonthDay(record.invoiceDate)}</td>
                      <td>
                        <GoAButton
                          {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                          size='compact'
                          type='tertiary'
                          onClick={() => invoiceNumberClick(record)}
                        >
                          {replaceSpacesWithNonBreaking(record.invoiceNumber)}
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
