import {
  GoAButton,
  GoAButtonGroup,
  GoAButtonType,
  GoABadge,
  GoABadgeType,
  GoATable,
  GoATableSortHeader,
  GoAInput,
  GoAPagination,
  GoABlock,
  GoASpacer,
  GoADropdown,
  GoADropdownItem,
} from '@abgov/react-components';
import { useState, useEffect } from 'react';
import FlyOut from '@/common/fly-out';
import PageLoader from '@/common/page-loader';
import { IFlightReportDashboard } from '@/interfaces/flight-report-dashboard/flight-report-dashboard.interface';
import { yearMonthDay } from '@/common/dates';
import flightReportDashboardService from '@/services/flight-report-dashboard.service';
import { useConditionalAuth, useAppSelector, useAppDispatch } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import Styles from '@/features/invoice-details/edit-payables-modal-dialog.module.scss';
import { getInvoiceDetails } from './invoice-details-actions';
import { resetState, setFlightReportIds } from '@/app/app-slice';
const { topContainer, checboxHeader, checboxControl, headerRow, roboto, toolbar, searchBar, dropdownContainer } = Styles;

interface IRowItem extends IFlightReportDashboard {
  isChecked: boolean;
}

interface IEditPayableModalDialog {
  contractNumber: string;
  showEditPayableDialog: (value: boolean) => void;
  show: boolean;
  searchValue: string;
}

const EditPayableModalDialog: React.FunctionComponent<IEditPayableModalDialog> = ({ contractNumber, searchValue, show, showEditPayableDialog }) => {
  const [cancelButtonlabel] = useState<string>('Cancel');
  const [cancelButtonType] = useState<GoAButtonType>('tertiary');
  const [updateButtonlabel] = useState<string>('Update');
  const [updateButtonType] = useState<GoAButtonType>('primary');
  const [respMessageType] = useState<GoABadgeType>('light');
  const [respMessageContent] = useState('');
  const [respMessageIcon] = useState<boolean>(false);
  const [iscancelled, setIsCancelled] = useState<boolean>(false);
  const [dialogTitle] = useState<string>('Edit Payables');
  const [visible, setVisible] = useState<boolean>(false);
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const contract = useAppSelector((state) => state.app.contractForReconciliation);

  const auth = useConditionalAuth();
  const [pageData, setPageData] = useState<IRowItem[]>([]);
  const [rawData, setRawData] = useState<IRowItem[]>([]);
  const [data, setData] = useState<IRowItem[]>([]);

  const [loading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState<string>();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(7);
  const [, setPreviousSelectedPerPage] = useState(7);

  const dispatch = useAppDispatch();
  const flighReportIds = useAppSelector((state) => state.app.flightReportIds);

  type SelectionType = 'Available' | 'Selected';
  const [selectionType, setSelectionType] = useState('Available' as SelectionType);

  const selectionTypeItems: { value: SelectionType; label: string }[] = [
    { value: 'Available', label: 'Available' },
    { value: 'Selected', label: 'Selected' },
  ];

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (iscancelled) {
      setIsCancelled(false);
    }
  }, [iscancelled]);

  const hideModalDialog = () => {
    setIsCancelled(true);
    showEditPayableDialog(false);
  };

  const UpdatePayables = () => {
    const items = data?.filter((fr: IRowItem) => fr.isChecked === true);
    const trItems: number[] = [];
    items?.map((record: IFlightReportDashboard) => {
      trItems.push(record.flightReportId);
    });

    if (trItems.length > 0) {
      dispatch(getInvoiceDetails({ token: auth?.user?.access_token, ids: trItems }));
      dispatch(setFlightReportIds(trItems));
      showEditPayableDialog(false);
    }
    if (trItems.length == 0) {
      dispatch(resetState());
      showEditPayableDialog(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const request = {
      contractNumber: contractNumber,
      status: 'approved',
    };
    const subscription = flightReportDashboardService.getSearch(auth?.user?.access_token, request).subscribe({
      next: (response) => {
        const rows = response.rows.map((x) => {
          if (flighReportIds.find((element) => element === x.flightReportId) !== undefined) {
            return { isChecked: true, ...x };
          } else {
            return { isChecked: false, ...x };
          }
        });
        const sortedData = sort('flightReportDate', 1, rows);
        setRawData(sortedData);
        setData(sortedData);
        setPageData(sortedData.slice(0, perPage));
        setIsLoading(false);
      },
      error: (error) => {
        console.error(error);
        if (error.response && error.response.status === 403) {
          navigateTo('unauthorized');
        }
        setIsLoading(false);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchValue, contractNumber, visible]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    const _flightReports = data.slice(offset, offset + perPage);
    setPageData(_flightReports);
  }, [data]);

  function sort(sortBy: string, sortDir: number, rows: IRowItem[]): IRowItem[] {
    rows.sort((a: IFlightReportDashboard, b: IFlightReportDashboard) => {
      const varA = a[sortBy as keyof IFlightReportDashboard];
      const varB = b[sortBy as keyof IFlightReportDashboard];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    return rows.slice();
  }

  function sortData(sortBy: string, sortDir: number) {
    const sortedData = sort(sortBy, sortDir, data);
    setData(sortedData.slice());
    setPageData(sortedData.slice(0, perPage));
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

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === 'selectAll') {
      //get all the visible items
      const allTimeReports = data?.map((record: IRowItem) => {
        if (pageData.find((x) => x.flightReportId && x.flightReportId === record.flightReportId)) {
          return { ...record, isChecked: checked };
        }
        return record;
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

  const onChange = (name: string, value: string) => {
    setSearchVal(value);
    if (value.length < 3) {
      setData(rawData);
      changePage(1);
      return;
    }
    const upper = value.toUpperCase();
    const results = rawData.filter((x) => x.contractRegistrationName.toUpperCase().includes(upper));
    setData(results);
  };
  function onChangeSelectionType(name: string, type: string | string[]) {
    const _contractType = type as SelectionType;
    setSelectionType(_contractType as SelectionType);
    // rerun the search, sometimes it is the term, sometimes it is an item with a separator

    // if (_contractType === 'Available') {
    //   setSearchResults(data);
    // }
    // else if (_contractType === 'Selected') {
    //   const selectedData = searchResults.filter((x) => x.isChecked === true);
    //   setSearchResults(selectedData);
    // }
  }
  return (
    <>
      <PageLoader visible={loading} />
      <FlyOut
        heading={dialogTitle}
        open={visible}
        onClose={hideModalDialog}
        actions={
          <GoAButtonGroup alignment='end'>
            <GoABadge type={respMessageType} content={respMessageContent} icon={respMessageIcon} />
            <GoAButton type={cancelButtonType} onClick={hideModalDialog}>
              {cancelButtonlabel}
            </GoAButton>
            <GoAButton type={updateButtonType} onClick={UpdatePayables}>
              {updateButtonlabel}
            </GoAButton>
          </GoAButtonGroup>
        }
      >
        <div className={topContainer}>
          <div>
            <div>Vendor</div>
            <div>{contract.vendorName}</div>
          </div>
          <div>
            <div>Invoie no.</div>
            <div>{invoiceData.InvoiceNumber}</div>
          </div>
        </div>
        <div className={toolbar}>
          <div className={searchBar}>
            <div>Approved time reports</div>
            <div>
              <div className={dropdownContainer}>
                <GoADropdown name='contractType' value={selectionType} onChange={onChangeSelectionType}>
                  {selectionTypeItems.map((type, idx) => (
                    <GoADropdownItem key={idx} value={type.value} label={type.label} />
                  ))}
                </GoADropdown>
              </div>
              <GoAInput
                type='search'
                name='search'
                value={searchVal}
                onChange={onChange}
                leadingIcon='search'
                placeholder='Search Registration no.'
              ></GoAInput>
            </div>
          </div>

        </div>
        <div className='divTable'>
          <GoATable onSort={sortData} width='100%'>
            <thead>
              <tr>
                <th className={checboxHeader}>
                  <input
                    className={checboxControl}
                    type='checkbox'
                    name='selectAll'
                    checked={pageData.length > 0 && pageData?.filter((item: IRowItem) => item?.isChecked !== true).length < 1}
                    disabled={data.length === 0}
                    onChange={handleCheckBoxChange}
                  ></input>
                </th>
                <th className={headerRow}>
                  <GoATableSortHeader name='flightReportDate' direction='asc'>
                    Report Date
                  </GoATableSortHeader>
                </th>
                <th className={headerRow}>Report No.</th>
                <th className={headerRow}>AO-02 No.</th>
                <th className={headerRow}>Registration No.</th>
                <th className={headerRow}>Total Cost</th>
              </tr>
            </thead>

            {!loading && (
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
                      <td className={roboto}>
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
                      <td className={roboto}>{formatter.format(record?.totalCost)}</td>
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

            <GoAPagination variant='links-only' itemCount={data.length} perPageCount={perPage} pageNumber={page} onChange={changePage} />
          </GoABlock>
        )}
      </FlyOut>
    </>
  );
};

export default EditPayableModalDialog;
