import { GoAButton, GoACheckbox, GoATable, GoATableSortHeader } from '@abgov/react-components';
import styles from './invoice-data-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { convertToCurrency } from '@/common/currency';
import { IDetailsTableRow } from './details-table-row.interface';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { ITimeReportDetailsTableRowData, getFireNumberRow } from '@/interfaces/invoice-details/time-report-details-table-row-data';
import { setRowData } from '@/app/app-slice';

const { container, checkboxWrapper, buttonWrapper, tableContainer, stickyColumn, start, end, onTop, totalRowLabel, totalRowValue } = styles;
interface IDetailsTabProps {
  filter?: (x: IDetailsTableRow) => boolean;
  rateTypeFilter?: string[];
  showCheckBoxes?: boolean;
  showRowIndicator?: boolean;
}
const InvoiceDataTable: React.FC<IDetailsTabProps> = (props) => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.app.rowData);
  const filterByRateType = (x: IDetailsTableRow) => {
    return props.rateTypeFilter && props.rateTypeFilter.length !== 0 ? props.rateTypeFilter.includes(x.data.rateType) : x; // === props.rateTypeFilter : x;
  };

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    const sorted = data.filter(filterByRateType).sort((a: IDetailsTableRow, b: IDetailsTableRow) => {
      const varA = a.data[sortBy as keyof ITimeReportDetailsTableRowData];
      const varB = b.data[sortBy as keyof ITimeReportDetailsTableRowData];
      if (typeof varA === 'string' && typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      if (varA === varB) {
        return 0;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    dispatch(setRowData(sorted));
  }
  function addRemoveClicked(row: IDetailsTableRow) {
    const isAdd = !row.isAdded;

    dispatch(
      setRowData(
        rowData.map((r) => {
          if (r.index === row.index) {
            return { ...r, isAdded: isAdd };
          } else {
            return r;
          }
        }),
      ),
    );
  }
  function checkClicked(row: IDetailsTableRow, checked: boolean) {
    dispatch(
      setRowData(
        rowData.map((r) => {
          if (r.index === row.index) {
            return { ...r, isSelected: checked };
          } else {
            return r;
          }
        }),
      ),
    );
  }

  function checkAll() {
    const filteredRecords = rowData?.filter(filterByRateType).filter(getFilter());
    if (filteredRecords.length === rowData.length) {
      const allSelected = rowData.filter((x) => !x.isAdded).every((x) => x.isSelected);
      dispatch(
        setRowData(
          rowData.map((r) => {
            return r.isAdded ? r : { ...r, isSelected: allSelected ? false : true };
          }),
        ),
      );
    } else if (filteredRecords.length < rowData?.length) {
      dispatch(
        setRowData(
          rowData.map((r) => {
            const exists = filteredRecords.some((obj) => obj === r);
            return r.isAdded ? r : { ...r, isSelected: exists && !r.isSelected ? true : false };
          }),
        ),
      );
    }
  }

  function getFilter() {
    return props.filter ? props.filter : (x: IDetailsTableRow) => x;
  }

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData} width='100%'>
          <thead>
            <tr>
              {props.showCheckBoxes && (
                <th className={`${stickyColumn} ${start} ${onTop}`}>
                  <div className={checkboxWrapper}>
                    <GoACheckbox
                      name={''}
                      checked={rowData.filter((x) => !x.isAdded).every((x) => x.isSelected)}
                      disabled={rowData.every((x) => x.isAdded)}
                      onChange={() => checkAll()}
                    ></GoACheckbox>
                  </div>
                </th>
              )}
              {props.showRowIndicator && <th></th>}
              <th>
                <GoATableSortHeader name={'flightReportDate'}>Date</GoATableSortHeader>
              </th>
              <th>Reg no.</th>
              <th>Report no.</th>
              <th>AO02 no.</th>
              <th>Rate type</th>
              <th>
                <GoATableSortHeader name={'noOfUnits'}>No. of units</GoATableSortHeader>
              </th>
              <th>Rate unit</th>
              <th>
                <GoATableSortHeader name={'ratePerUnit'}>Rate / unit</GoATableSortHeader>
              </th>
              <th>
                <GoATableSortHeader name={'cost'}>Cost</GoATableSortHeader>
              </th>
              <th>Internal order</th>
              <th>Cost centre</th>
              <th>Fund</th>
              <th>G/L acct</th>
              <th>Fire no.</th>
              <th className={`${stickyColumn} ${end} ${onTop}`}></th>
            </tr>
          </thead>
          <tbody>
            {rowData
              .filter(filterByRateType)
              .filter(getFilter())
              .map((x, index) => (
                <tr key={index}>
                  {props.showCheckBoxes && (
                    <td className={`${stickyColumn} ${start}`}>
                      <div className={checkboxWrapper}>
                        <GoACheckbox
                          name={`cb${index}`}
                          checked={x.isSelected}
                          disabled={x.isAdded ? true : false}
                          onChange={(name, checked) => {
                            checkClicked(x, checked);
                          }}
                        ></GoACheckbox>
                      </div>
                    </td>
                  )}
                  {props.showRowIndicator && <td>{index + 1}</td>}
                  <td>{yearMonthDay(x.data.flightReportDate)}</td>
                  <td>{x.data.contractRegistrationName}</td>
                  <td>{x.data.flightReportId}</td>
                  <td>{x.data.ao02Number}</td>
                  <td>{x.data.rateType}</td>
                  <td>{x.data.noOfUnits}</td>
                  <td>{x.data.rateUnit}</td>
                  <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                  <td>{convertToCurrency(x.data.cost)}</td>
                  <td>{x.data.internalOrder}</td>
                  <td>{x.data.costCenter}</td>
                  <td>{x.data.fund}</td>
                  <td>{x.data.account}</td>
                  <td>{getFireNumberRow(x.data)}</td>
                  <td className={`${stickyColumn} ${end}`}>
                    <div className={buttonWrapper}>
                      <GoAButton size='compact' type='secondary' disabled={rowData.some((x) => x.isSelected)} onClick={() => addRemoveClicked(x)}>
                        {x.isAdded ? 'Remove' : 'Add'}
                      </GoAButton>
                    </div>
                  </td>
                </tr>
              ))}
            <tr key={rowData?.length + 1}>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              {props.showRowIndicator && <td></td>}
              <td>
                <div className={totalRowLabel}>Total units: </div>
              </td>
              <td>
                <div className={totalRowValue}>
                  {rowData
                    ?.filter(filterByRateType)
                    .filter(getFilter())
                    .reduce((unit, obj) => unit + obj.data.noOfUnits, 0)}
                </div>
              </td>
              <td></td>
              <td>
                <div className={totalRowLabel}>Total cost:</div>
              </td>
              <td>
                <div className={totalRowValue}>
                  {convertToCurrency(
                    rowData
                      ?.filter(filterByRateType)
                      .filter(getFilter())
                      .reduce((cost, obj) => cost + obj.data.cost, 0),
                  )}
                </div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </GoATable>
      </div>
    </div>
  );
};

export default InvoiceDataTable;
