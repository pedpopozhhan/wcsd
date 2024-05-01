import { GoATable, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import PageLoader from '@/common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { yearMonthDay } from '@/common/dates';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useAppDispatch, useConditionalAuth } from '@/app/hooks';
import styles from '@/features/vendor-time-reports/tabs/approved-tab-details.module.scss';
import { navigateTo } from '@/common/navigate';
import { failedToPerform, publishToast } from '@/common/toast';
import { resetInvoiceDetails } from '@/features/invoice-details/invoice-details-slice';
import { getInvoiceDetails } from '@/features/invoice-details/invoice-details-epic';
const { checboxHeader, checboxControl, headerRow } = styles;

interface IRowItem extends IFlightReportDashboard {
  isChecked: boolean;
}
interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const ApprovedTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue }) => {
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

  // Modal Dialog configuration
  const [contractID] = useState(contractNumber);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    const request = {
      contractNumber: contractNumber,
      status: 'approved',
    };
    const subscription = flightReportDashboardService.getSearch(auth?.user?.access_token, request).subscribe({
      next: (response) => {
        const rows = response.rows.map((x) => {
          return { isChecked: false, ...x };
        });
        setData(rows);
        // sort by what default
        setPageData(rows.slice(0, perPage));

        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        publishToast({
          type: 'error',
          message: failedToPerform('load flight reports', error.response.data),
          callback: () => {
            setRetry(!retry);
          },
        });
        setIsLoading(false);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchValue, contractNumber, retry]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    const _flightReports = data.slice(offset, offset + perPage);
    setPageData(_flightReports);
  }, [data]);

  function sortData(sortBy: string, sortDir: number) {
    data.sort((a: IFlightReportDashboard, b: IFlightReportDashboard) => {
      const varA = a[sortBy as keyof IFlightReportDashboard];
      const varB = b[sortBy as keyof IFlightReportDashboard];
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

  function changePage(newPage: number) {
    if (newPage) {
      const offset = (newPage - 1) * perPage;
      const _flightReports = data.slice(offset, offset + perPage);
      setPerPage(perPage);
      setPage(newPage);
      setPageData(_flightReports);
    }
  }

  const reconcileTimeReports = () => {
    const items = data?.filter((fr: IRowItem) => fr.isChecked === true);
    const trItems: number[] = [];
    items?.map((record: IFlightReportDashboard) => {
      trItems.push(record.flightReportId);
    });

    if (trItems.length > 0) {
      dispatch(getInvoiceDetails({ token: auth?.user?.access_token, ids: trItems }));
    }
    if (trItems.length == 0) {
      dispatch(resetInvoiceDetails());
    }
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'selectAll') {
      const allTimeReports = data?.map((record: IRowItem) => {
        return { ...record, isChecked: checked };
      });
      setData(allTimeReports);
    } else {
      const selectedTimeReports = data?.map((record: IRowItem) =>
        record.flightReportId?.toString() === name ? { ...record, isChecked: checked } : record,
      );
      setData(selectedTimeReports);
    }
  };

  const formatter = new Intl.NumberFormat('default', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <>
      <PageLoader visible={loading} />
      <div>
        <InvoiceModalDialog isNew onOpen={reconcileTimeReports} contract={contractID} />
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th className={checboxHeader}>
                  <input
                    className={checboxControl}
                    type='checkbox'
                    name='selectAll'
                    checked={data.length > 0 && data?.filter((item: IRowItem) => item?.isChecked !== true).length < 1}
                    disabled={data.length === 0}
                    onChange={handleCheckBoxChange}
                  ></input>
                </th>
                <th className={headerRow}>
                  <GoATableSortHeader name='flightReportDate'>Report Date</GoATableSortHeader>
                </th>
                <th className={headerRow}>Report No.</th>
                <th className={headerRow}>AO-02 No.</th>
                <th className={headerRow}>Registration No.</th>
                <th className={headerRow}>Total Cost</th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {pageData && pageData.length > 0 ? (
                pageData.map((record: IRowItem) => (
                  <tr key={record.flightReportId}>
                    <td style={{ padding: '12px 0 12px 32px' }}>
                      <input
                        className={checboxControl}
                        type='checkbox'
                        id={record.flightReportId.toString()}
                        name={record.flightReportId.toString()}
                        onChange={handleCheckBoxChange}
                        checked={record?.isChecked || false}
                      ></input>
                    </td>
                    <td>{yearMonthDay(record.flightReportDate as string)}</td>
                    <td>
                      <a
                        href={import.meta.env.VITE_AVIATION_APPLICATION_BASE_URL + '/flightReportDetail/' + record?.flightReportId}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {record.flightReportId}
                      </a>
                    </td>
                    <td>{record.ao02Number}</td>
                    <td>{record?.contractRegistrationName}</td>
                    <td>{formatter.format(record?.totalCost)}</td>
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
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {getTotalPages()}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination variant='links-only' itemCount={data.length} perPageCount={perPage} pageNumber={page} onChange={changePage} />
          </GoABlock>
        )}
      </div>
    </>
  );
};

export default ApprovedTabDetails;
