import {
  GoAButton,
  GoACheckbox,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './invoice-data-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { useContext } from 'react';
import { convertToCurrency } from '@/common/currency';
import {
  IDetailsTableRow,
  InvoiceDetailsContext,
} from './invoice-details-context';

let {
  container,
  checkboxWrapper,
  buttonWrapper,
  tableContainer,
  stickyColumn,
  start,
  end,
  onTop,
} = styles;
interface IDetailsTabProps {
  filter?: (x: IDetailsTableRow) => boolean;
  rateTypeFilter?: string;
  showCheckBoxes?: boolean;
}
const InvoiceDataTable: React.FC<IDetailsTabProps> = (props) => {
  const context = useContext(InvoiceDetailsContext);
  const { rowData, setRowData } = context;

  const filterByRateType = (x: IDetailsTableRow) => {
    return props.rateTypeFilter ? x.data.rateType === props.rateTypeFilter : x;
  };

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    data.filter(filterByRateType).sort((a: any, b: any) => {
      const varA = a.data[sortBy];
      const varB = b.data[sortBy];
      if (typeof varA === 'string' || typeof varB === 'string') {
        const res = varB.localeCompare(varA);
        return res * sortDir;
      }
      return (varA > varB ? 1 : -1) * sortDir;
    });
    setRowData(data);
  }
  function addRemoveClicked(row: IDetailsTableRow) {
    const isAdd = !row.isAdded;

    setRowData(
      rowData.map((r) => {
        if (r.index === row.index) {
          return { ...r, isAdded: isAdd };
        } else {
          return r;
        }
      })
    );
  }
  function checkClicked(row: IDetailsTableRow, checked: boolean) {
    setRowData(
      rowData.map((r) => {
        if (r.index === row.index) {
          return { ...r, isSelected: checked };
        } else {
          return r;
        }
      })
    );
  }

  function checkAll() {
    // if any selected, uncheck them all
    let anySelected = rowData
      .filter((x) => !x.isAdded)
      .some((x) => x.isSelected);
    setRowData(
      rowData.map((r) => {
        return r.isAdded ? r : { ...r, isSelected: !anySelected };
      })
    );
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
                      checked={rowData.some((x) => x.isSelected)}
                      disabled={false}
                      onChange={() => checkAll()}
                    ></GoACheckbox>
                  </div>
                </th>
              )}
              <th>
                <GoATableSortHeader name={'date'}>Date</GoATableSortHeader>
              </th>
              <th>Reg No.</th>
              <th>Report No.</th>
              <th>AO02 No.</th>
              <th>Rate Type</th>
              <th>
                <GoATableSortHeader name={'numberOfUnits'}>
                  No. of Units
                </GoATableSortHeader>
              </th>
              <th>Rate Unit</th>
              <th>
                <GoATableSortHeader name={'ratePerUnit'}>
                  Rate / unit
                </GoATableSortHeader>
              </th>
              <th>
                <GoATableSortHeader name={'cost'}>Cost</GoATableSortHeader>
              </th>
              <th>GL Account No.</th>
              <th>Profit Centre</th>
              <th>Cost Centre</th>
              <th>Fire No.</th>
              <th>Internal Order</th>
              <th>Fund</th>
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
                          onChange={(name, checked, value) => {
                            checkClicked(x, checked);
                          }}
                        ></GoACheckbox>
                      </div>
                    </td>
                  )}
                  <td>{yearMonthDay(x.data.flightReportDate)}</td>
                  <td>{x.data.contractRegistrationName}</td>
                  <td>{x.data.flightReportId}</td>
                  <td>{x.data.aO02Number}</td>
                  <td>{x.data.rateType}</td>
                  <td>{x.data.numberOfUnits}</td>
                  <td>{x.data.rateUnit}</td>
                  <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                  <td>{convertToCurrency(x.data.cost)}</td>
                  <td>{x.data.account}</td>
                  <td>{x.data.profitCenter}</td>
                  <td>{x.data.costCenter}</td>
                  <td>{x.data.fireNumber}</td>
                  <td>{x.data.internalOrder}</td>
                  <td>{x.data.fund}</td>
                  <td className={`${stickyColumn} ${end}`}>
                    <div className={buttonWrapper}>
                      <GoAButton
                        size='compact'
                        type='secondary'
                        disabled={rowData.some((x) => x.isSelected)}
                        onClick={() => addRemoveClicked(x)}
                      >
                        {x.isAdded ? 'Remove' : 'Add'}
                      </GoAButton>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </GoATable>
      </div>
    </div>
  );
};

export default InvoiceDataTable;
