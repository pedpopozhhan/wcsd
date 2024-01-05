import {
  GoAButton,
  GoACheckbox,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IDetailsTableRowData } from '@/interfaces/invoice-details/details-table-row-data';
import { useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';

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
class Row {
  index: number;
  data: IDetailsTableRowData;
  isAdded: boolean = false;
  isSelected: boolean = false;
}
interface IDetailsTabProps {
  data: IDetailsTableRowData[];
  onAddRemove: (newTotal: number) => any;
}
const DetailsTab: React.FC<IDetailsTabProps> = (props) => {
  const [rowData, setRowData] = useState<Row[]>([]);
  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
          isAdded: false,
          isSelected: false,
        };
      })
    );
  }, [props.data]);

  // This reacts to the rowData changing
  useEffect(() => {
    const total = rowData
      .filter((x) => x.isAdded)
      .reduce((acc, cur) => {
        return acc + cur.data.cost;
      }, 0);
    props.onAddRemove(total);
  }, [rowData]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    console.log(sortDir);
    data.sort((a: any, b: any) => {
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
  function addRemoveClicked(row: Row) {
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
  function checkClicked(row: Row, checked: boolean) {
    const isAdd = !row.isAdded;

    setRowData(
      rowData.map((r) => {
        if (r.index === row.index) {
          return { ...r, isSelected: isAdd };
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

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData}>
          <thead>
            <tr>
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
            {rowData.map((x, index) => (
              <tr key={index}>
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
                <td>{yearMonthDay(x.data.date)}</td>
                <td>{x.data.registrationNumber}</td>
                <td>{x.data.reportNumber}</td>
                <td>{x.data.aO02Number}</td>
                <td>{x.data.rateType}</td>
                <td>{x.data.numberOfUnits}</td>
                <td>{x.data.rateUnit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.glAccountNumber}</td>
                <td>{x.data.profitCentre}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.fireNumber}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.fund}</td>
                <td className={`${stickyColumn} ${end}`}>
                  <div className={buttonWrapper}>
                    <GoAButton
                      size='compact'
                      type='secondary'
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

export default DetailsTab;
/*

ADD ITEM
Cost of the Row Added / Removed will be reflected in Reconciled and Remaining Amounts

“Add” will add the “Cost” of details Data to Reconciled Amount and also populate the Reconciled Grouping in it’s respective Tab

Adding a row will disable it for multiselection

Reconciled Amount is the total cost of detail items added either singularly || multi-selection 

uses number transition per addition / removal for feedback

REMOVE ITEM
Cost of the Row Added / Removed will be reflected in Reconciled and Remaining Amounts

“Remove” will remove the “Cost” of details Data from Reconciled Amount and also from the Reconciled Grouping in it’s resp

Remove a row selected will enable it for multiselection

Reconciled Amount is the total cost of detail items added either singularly || multi-selection 

uses number transition per addition / removal for feedback

*/
