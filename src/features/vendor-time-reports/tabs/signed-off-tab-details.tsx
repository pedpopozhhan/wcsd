import { GoATable, GoAButton, GoABlock, GoASpacer, GoAPagination, GoATableSortHeader, GoAIconButton } from '@abgov/react-components';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../../../common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IFilter } from '@/interfaces/flight-report-dashboard/filter.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import { yearMonthDay } from '@/common/dates';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useEffect } from 'react';
import { publishToast } from '@/common/toast';

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const SignedOffTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({ contractNumber, searchValue, onClickFlightReport, ...props }) => {
  //Navigation
  const navigate = useNavigate();
  //Data set
  const [data, setData] = React.useState<IFlightReportDashboard[]>([]);
  //Loader
  const [loading, setIsLoading] = React.useState(true);

  //Pagination
  const [pageData, setPageData] = React.useState<IFlightReportDashboard[]>([]);
  // page number
  const [page, setPage] = React.useState(1);
  //count per page
  const [perPage, setPerPage] = React.useState(10);
  const [previousSelectedPerPage, setPreviousSelectedPerPage] = React.useState(10);

  //Sorting
  const [sortCol, setSortCol] = React.useState('flightReportDate');
  const [sortDir, setSortDir] = React.useState(-1);
  const [isSorting, setIsSorting] = React.useState(false);

  useEffect(() => {
    let strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    let sortOrder = sortDir === -1 ? 'ASC' : 'DESC';

    let objIPagination: IPagination = {
      perPage: perPage,
      page: page,
    };

    let objIFilter: IFilter = {
      contractNumber: contractNumber,
      status: 'signed off',
    };

    let objISearch: ISearch = {
      search: strSearchValue,
      sortBy: sortCol,
      sortOrder: sortOrder,
      filterBy: objIFilter,
      pagination: objIPagination,
    };
    setIsLoading(true);
    const subscription = flightReportDashboardService.getSearch(objISearch).subscribe({
      next: (response) => {
        if (response.errorMessage) {
          console.error(response.errorMessage);
          publishToast({ type: 'error', message: response.errorMessage });
        } else {
          setData(response.data);
          // sort by what default
          setPageData(response.data.slice(0, perPage));
        }
        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
        publishToast({ type: 'error', message: `Server error` });
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [page, perPage, searchValue, sortCol, sortDir, contractNumber]);

  function sortData(sortBy: string, sortDir: number) {
    data.sort((a: any, b: any) => {
      const varA = a[sortBy];
      const varB = b[sortBy];
      if (typeof varA === 'string' || typeof varB === 'string') {
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
    let num = data ? Math.ceil(data.length / perPage) : 0;

    return num;
  }

  //Pagination change page
  function changePage(newPage: any) {
    if (newPage) {
      setIsLoading(true);
      const offset = (newPage - 1) * perPage;
      const _flightReports = data.slice(offset, offset + perPage);

      setPerPage(perPage);
      setPage(newPage);
      setPageData(_flightReports);
    }
  }

  function changePerPage(name: any, value: any) {
    if (value) {
      setIsLoading(true);
      const newPerPage = parseInt(value, 10);
      const offset = (page - 1) * newPerPage;

      const _flightReports = data.slice(offset, offset + newPerPage);

      setPageData(_flightReports);
      //setSearchValue("");
      setPerPage((p) => {
        return newPerPage;
      });
      setPage(page);
    }
  }

  //#endregion

  function flightReportClick(flightReportId?: number) {
    if (flightReportId) {
      window.open(import.meta.env.VITE_AVIATION_APPLICATION_BASE_URL + '/flightReportDetail/' + flightReportId, '_blank');
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
                <th style={{ maxWidth: '40%' }}>
                  <GoATableSortHeader name='flightReportDate'>Report Date</GoATableSortHeader>
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="flightReportId"> */}
                  Report No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="ao02Number"> */}
                  AO-02 No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%' }}>
                  {/* <GoATableSortHeader name="contractRegistrationName"> */}
                  Registration No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '15%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody style={{ position: 'sticky', top: 0 }} className='table-body'>
              {data && data.length > 0 ? (
                data.map((record: any, index: any) => (
                  // {filteredData && filteredData.length > 0 ? (
                  // filteredData.map((record: any, index: any) => (
                  <tr key={record.flightReportId}>
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
                    <td style={{ textAlign: 'right' }}>
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

            <GoAPagination
              variant='links-only'
              itemCount={data.length || 10}
              // itemCount={filteredData?.length || 10}
              perPageCount={perPage}
              pageNumber={page}
              onChange={changePage}
            />
          </GoABlock>
        </div>
      </div>
    </>
  );
};

export default SignedOffTabDetails;
