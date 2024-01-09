import {
  GoATable,
  GoAButton,
  GoABlock,
  GoASpacer,
  GoAPagination,
  GoATableSortHeader,
  GoAIconButton,
} from '@abgov/react-components';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLoader from '../page-loader';
import { IPaginationResult } from '@/interfaces/pagination-result.interface';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IFilter } from '@/interfaces/flight-report-dashboard/filter.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import { FlightReportDashboardService } from '@/services/flight-report-dashboard.service';
import { yearMonthDay } from '@/common/dates';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { MainContext } from '@/common/main-context';

interface IFlightReportAllProps {
  contractNumber: string | undefined;
  searchValue?: string;
  onClickFlightReport?: (flightReportId: number) => void;
}

const ApprovedTabDetails: React.FunctionComponent<IFlightReportAllProps> = ({
  contractNumber,
  searchValue,
  onClickFlightReport,
  ...props
}) => {
  //Object for the page data
  const [pageData, setPageFlightReports] = useState<any>([]);

  //Navigation
  const navigate = useNavigate();
  //Data set
  const [paginationResults, setPaginationResult] =
    useState<IPaginationResult<IFlightReportDashboard>>();

  //Loader
  const [loading, setIsLoading] = useState(true);

  //Pagination

  // page number
  const [page, setPage] = useState(1);
  //count per page
  const [perPage, setPerPage] = useState(10);
  const [previousSelectedPerPage, setPreviousSelectedPerPage] = useState(10);

  //Sorting
  const [sortCol, setSortCol] = useState('flightReportDate');
  const [sortDir, setSortDir] = useState(-1);
  const [isSorting, setIsSorting] = useState(false);

  // Modal Dialog configuration
  const [parentShowModal, setParentShowModal] = useState(false);
  const [contractID, setContractID] = useState(contractNumber);

  const mainContext = useContext(MainContext);
  const { setTimeReportsToReconcile } = mainContext;

  useEffect(() => {
    onRefreshFlightReport();
    setPageFlightReports(paginationResults?.data);
  }, [page, perPage, searchValue, sortCol, sortDir, contractNumber]);

  function onRefreshFlightReport() {
    getFlightReports();
    setPageFlightReports(paginationResults?.data.slice(0, perPage));
  }

  //Get flight reports data
  const getFlightReports = async () => {
    setIsLoading(true);

    let strSearchValue = searchValue ? searchValue.toLowerCase() : '';
    let sortOrder = sortDir === -1 ? 'ASC' : 'DESC';

    let objIPagination: IPagination = {
      perPage: perPage,
      page: page,
    };

    let objIFilter: IFilter = {
      contractNumber: contractNumber,
      status: 'approved',
    };

    let objISearch: ISearch = {
      search: strSearchValue,
      sortBy: sortCol,
      sortOrder: sortOrder,
      filterBy: objIFilter,
      pagination: objIPagination,
    };

    setTimeout(() => {
      FlightReportDashboardService.getSearch(objISearch)
        .then((response: any) => {
          setPaginationResult((p) => {
            return sortingData(response.data);
          });

          setIsLoading(false);
        })
        .catch((e: Error) => {
          setIsLoading(false);
          sessionStorage.setItem('api_token', '');
          navigate('/');
        });
    }, 200);
  };

  function sortingData(
    paginationResult: IPaginationResult<IFlightReportDashboard>
  ) {
    const _flightReports = [...(paginationResult.data || [])];
    _flightReports.sort((a, b) => {
      return (
        (a[sortCol as keyof typeof paginationResults] >
        b[sortCol as keyof typeof paginationResults]
          ? -1
          : 1) * sortDir
      );
    });

    paginationResult.data = _flightReports;
    //Only for sorting applied reset pagination
    if (isSorting) {
      setPerPage(previousSelectedPerPage | 10);
      setPage(1);

      //Reset value
      setIsSorting(false);
      setPreviousSelectedPerPage(perPage);
    }
    setPageFlightReports(paginationResult?.data.slice(0, perPage));
    return paginationResult;
  }

  function sortData(sortBy: string, sortDir: number) {
    setSortCol(sortBy);
    setSortDir(sortDir);
    setPreviousSelectedPerPage(perPage);
    setPerPage(paginationResults?.paginationInfo.total || 30);
    setPage(1);
    setIsSorting(true);
  }

  //Pagination change page
  function changePage(newPage: any) {
    if (newPage) {
      setIsLoading(true);
      const offset = (newPage - 1) * perPage;
      const _flightReports = paginationResults?.data.slice(
        offset,
        offset + perPage
      );
      setPerPage(perPage);
      setPage(newPage);
      setPageFlightReports(_flightReports);
    }
  }

  function changePerPage(name: any, value: any) {
    if (value) {
      setIsLoading(true);
      const newPerPage = parseInt(value, 10);
      const offset = (page - 1) * newPerPage;

      const _flightReports = paginationResults?.data.slice(
        offset,
        offset + newPerPage
      );
      setPageFlightReports(_flightReports);
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
      alert('Fligh Report ID:' + flightReportId);
      // navigate(`/flightReportDetail/${flightReportId}`, {
      //   state: corporateRegionPaginationResult,
      // });
    } else {
      // navigate(`/flightReportDetail/new`, {
      //   state: corporateRegionPaginationResult,
      // });
    }
  }

  //const [openModal, setOpenModal] = useState(false);

  const reconcileTimeReports = () => {
    let items = pageData?.filter((fr: any) => fr.isChecked === true);
    const trItems: number[] = [];
    items?.map((record: any) => {
      trItems.push(record.flightReportId);
    });
    setTimeReportsToReconcile(trItems);
    setParentShowModal(true);
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'selectAll') {
      let allTimeReports = pageData?.map((record: any) => {
        return { ...record, isChecked: checked };
      });
      setPageFlightReports(allTimeReports);
    } else {
      let selectedTimeReports = pageData?.map((record: any) =>
        record.flightReportId?.toString() === name
          ? { ...record, isChecked: checked }
          : record
      );
      setPageFlightReports(selectedTimeReports);
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
        <GoAButton
          size='compact'
          type='primary'
          disabled={
            pageData?.filter((item: any) => item?.isChecked === true).length <
              1 || pageData === undefined
          }
          onClick={reconcileTimeReports}
        >
          Reconcile
        </GoAButton>
        <div className='divTable'>
          <GoATable onSort={sortData}>
            <thead>
              <tr>
                <th style={{ maxWidth: '2%', padding: '12px 0 12px 32px' }}>
                  <input
                    type='checkbox'
                    name='selectAll'
                    checked={
                      pageData?.filter((item: any) => item?.isChecked !== true)
                        .length < 1
                    }
                    onChange={handleCheckBoxChange}
                    style={{
                      width: '20px',
                      height: '20px',
                      verticalAlign: 'bottom',
                    }}
                  ></input>
                </th>
                <th style={{ maxWidth: '38%' }}>
                  <GoATableSortHeader name='flightReportDate'>
                    Report Date
                  </GoATableSortHeader>
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="flightReportId"> */}
                  Report No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="ao02Number"> */}
                  AO-02 No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="contractRegistrationName"> */}
                  Registration No.
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%' }}>
                  {/* <GoATableSortHeader name="totalCost"> */}
                  Total Cost
                  {/* </GoATableSortHeader> */}
                </th>
                <th style={{ maxWidth: '12%', textAlign: 'right' }}></th>
              </tr>
            </thead>

            <tbody
              style={{ position: 'sticky', top: 0 }}
              className='table-body'
            >
              {pageData && pageData.length > 0 ? (
                pageData.map((record: any, index: any) => (
                  <tr key={record.flightReportId}>
                    <td style={{ padding: '12px 0 12px 32px' }}>
                      <input
                        type='checkbox'
                        id={record.flightReportId}
                        name={record.flightReportId}
                        onChange={handleCheckBoxChange}
                        checked={record?.isChecked || false}
                        style={{
                          width: '20px',
                          height: '20px',
                          verticalAlign: 'bottom',
                        }}
                      ></input>
                    </td>
                    <td>{yearMonthDay(record.flightReportDate as string)}</td>
                    <td>
                      <GoAButton
                        {...{ style: '"padding: 0 10px 0 10px;height: 90px;"' }}
                        size='compact'
                        type='tertiary'
                        onClick={() =>
                          flightReportClick(record?.flightReportId)
                        }
                      >
                        {record.flightReportId}
                      </GoAButton>
                    </td>
                    <td>{record.ao02Number}</td>
                    <td>{record?.contractRegistrationName}</td>
                    {/* <td>{record?.totalCost}</td> */}
                    <td>{formatter.format(record?.totalCost)}</td>
                    <td>
                      <GoAIconButton
                        icon='chevron-forward'
                        onClick={() =>
                          flightReportClick(record?.flightReportId)
                        }
                      />
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

        <div
          className={
            paginationResults?.data && paginationResults?.data.length > 0
              ? 'visible pagination'
              : 'not-visible pagination'
          }
        >
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {paginationResults?.paginationInfo.totalPages}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination
              variant='links-only'
              itemCount={paginationResults?.paginationInfo.total || 10}
              // itemCount={filteredData?.length || 10}
              perPageCount={perPage}
              pageNumber={page}
              onChange={changePage}
            />
          </GoABlock>
        </div>
      </div>
      <InvoiceModalDialog
        isAddition='true'
        visible={parentShowModal}
        showInvoiceDialog={setParentShowModal}
        contract={contractID}
      />
    </>
  );
};

export default ApprovedTabDetails;
