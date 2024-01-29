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
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { IFilter } from '@/interfaces/flight-report-dashboard/filter.interface';
import { IPagination } from '@/interfaces/pagination.interface';
import { ISearch } from '@/interfaces/flight-report-dashboard/search.interface';
import { yearMonthDay } from '@/common/dates';
import InvoiceModalDialog from '@/common/invoice-modal-dialog';
import { MainContext } from '@/common/main-context';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';

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
  const [pageData, setPageData] = useState<IFlightReportDashboard[]>([]);

  //Navigation
  const navigate = useNavigate();
  //Data set
  const [data, setData] = useState<IFlightReportDashboard[]>([]);

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
    setIsLoading(true);
    const subscription = flightReportDashboardService
      .getSearch(objISearch)
      .subscribe((response) => {
        if (response.errorMessage) {
          // TODO: display an error message the right way
          console.error(response.errorMessage);
        } else {
          setData(response.data);
          // sort by what default
          setPageData(response.data.slice(0, perPage));
        }
        setIsLoading(false);
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

  //#endregion

  function flightReportClick(flightReportId?: number) {
    if (flightReportId) {
      alert('Fligh Report ID:' + flightReportId);
    }
  }

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
      setPageData(allTimeReports);
    } else {
      let selectedTimeReports = pageData?.map((record: any) =>
        record.flightReportId?.toString() === name
          ? { ...record, isChecked: checked }
          : record
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
                <th style={{ maxWidth: '2%', padding: '12px 0 12px 32px' }}>
                  <input
                    type='checkbox'
                    name='selectAll'
                    checked={pageData.length > 0 &&
                      pageData?.filter((item: any) => item?.isChecked !== true)
                        .length < 1
                    }
                    disabled={pageData.length === 0}
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
            data && data.length > 0
              ? 'visible pagination'
              : 'not-visible pagination'
          }
        >
          <GoABlock alignment='center'>
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              <span style={{ whiteSpace: 'nowrap' }}>
                Page {page} of {getTotalPages()}
              </span>
            </div>
            <GoASpacer hSpacing='fill' />

            <GoAPagination
              variant='links-only'
              itemCount={data.length}
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
