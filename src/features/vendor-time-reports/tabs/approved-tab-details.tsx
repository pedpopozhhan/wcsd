import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import { useEffect, useState } from 'react';
import PageLoader from '@/common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IFilter } from '@/interfaces/flight-report-dashboard/filter.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import { yearMonthDay } from '@/common/dates';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useAppDispatch } from '@/app/hooks';
import { setTimeReportsToReconcile } from '@/app/app-slice';
import { failedToPerform, publishToast } from '@/common/toast';
import styles from '@/features/vendor-time-reports/tabs/approved-tab-details.module.scss';
const { checboxHeader, checboxControl, headerRow } = styles;

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const ApprovedTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue }) => {
  //Object for the page data
  const [pageData, setPageData] = useState<IFlightReportDashboard[]>([]);

  //Data set
  const [data, setData] = useState<IFlightReportDashboard[]>([]);

  //Loader
  const [loading, setIsLoading] = useState(true);

  //Pagination

  // page number
  const [page, setPage] = useState(1);
  //count per page
  const [perPage, setPerPage] = useState(10);
  const [, setPreviousSelectedPerPage] = useState(10);

  //Sorting
  const [sortCol, setSortCol] = useState('flightReportDate');
  const [sortDir, setSortDir] = useState(-1);

  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const [contractID] = useState(contractNumber);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    const sortOrder = sortDir === -1 ? 'ASC' : 'DESC';

    const objIPagination: IPagination = {
      perPage: perPage,
      page: page,
    };

    const objIFilter: IFilter = {
      contractNumber: contractNumber,
      status: 'approved',
    };

    const objISearch: ISearch = {
      search: strSearchValue,
      sortBy: sortCol,
      sortOrder: sortOrder,
      filterBy: objIFilter,
      pagination: objIPagination,
    };
    setIsLoading(true);
    const subscription = flightReportDashboardService.getSearch(objISearch).subscribe({
      next: (response) => {
        setData(response.rows);
        // sort by what default
        setPageData(response.rows.slice(0, perPage));

        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
        publishToast({ type: 'error', message: failedToPerform('search flight reports', 'Server Error') });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [page, perPage, searchValue, sortCol, sortDir, contractNumber]);

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
      const _flightReports = data.slice(offset, offset + perPage);
      setPerPage(perPage);
      setPage(newPage);
      setPageData(_flightReports);
    }
  }

  //#endregion

  function flightReportClick(flightReportId?: number) {
    if (flightReportId) {
      window.open(import.meta.env.VITE_AVIATION_APPLICATION_BASE_URL + '/flightReportDetail/' + flightReportId, '_blank');
    }
  }

  const reconcileTimeReports = () => {
    // TODO: Possible bug here...isChecked is not on the object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = pageData?.filter((fr: any) => fr.isChecked === true);
    const trItems: number[] = [];
    items?.map((record: IFlightReportDashboard) => {
      trItems.push(record.flightReportId);
    });
    dispatch(setTimeReportsToReconcile(trItems));
    // setTimeReportsToReconcile(trItems);
    setParentShowModal(true);
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'selectAll') {
      const allTimeReports = pageData?.map((record: IFlightReportDashboard) => {
        return { ...record, isChecked: checked };
      });
      setPageData(allTimeReports);
    } else {
      const selectedTimeReports = pageData?.map((record: IFlightReportDashboard) =>
        record.flightReportId?.toString() === name ? { ...record, isChecked: checked } : record,
      );
      setPageData(selectedTimeReports);
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
        <GoAButton size='compact' type='primary' onClick={reconcileTimeReports}>
          Reconcile
        </GoAButton>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th className={checboxHeader}>
                  <input
                    className={checboxControl}
                    type='checkbox'
                    name='selectAll'
                    // TODO: Possible bug here...isChecked is not on the object
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    checked={pageData.length > 0 && pageData?.filter((item: any) => item?.isChecked !== true).length < 1}
                    disabled={pageData.length === 0}
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
                <th className={headerRow}></th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {pageData && pageData.length > 0 ? (
                // TODO: Possible bug here...isChecked is not on the object
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                pageData.map((record: any) => (
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
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() => flightReportClick(record?.flightReportId)}
                      >
                        {record.flightReportId}
                      </GoAButton>
                    </td>
                    <td>{record.ao02Number}</td>
                    <td>{record?.contractRegistrationName}</td>
                    <td>{formatter.format(record?.totalCost)}</td>
                    <td>
                      <GoAIconButton icon='chevron-forward' onClick={() => flightReportClick(record?.flightReportId)} />
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

        <div className={data && data.length > 0 ? 'visible pagination' : 'not-visible pagination'}>
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
      <InvoiceModalDialog isAddition='true' visible={parentShowModal} showInvoiceDialog={setParentShowModal} contract={contractID} />
    </>
  );
};

export default ApprovedTabDetails;
