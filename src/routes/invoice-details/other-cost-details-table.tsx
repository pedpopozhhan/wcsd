import {
  GoAButton,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './other-cost-details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IOtherCostTableRowData } from '@/interfaces/invoice-details/other-cost-table-row-data';
import OtherCostModalDialog from './other-cost-modal-dialog';
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
  data: IOtherCostTableRowData;
}
interface IOtherCostTableProps {
  data: IOtherCostTableRowData[];
  onRemoveOtherCost: (item: IOtherCostTableRowData) => any;
  onUpdateOtherCost: (item: IOtherCostTableRowData) => any;
}
const OtherCostDetailsTable: React.FC<IOtherCostTableProps> = (props) => {
  const [rowData, setRowData] = useState<Row[]>([]);
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [rowToUpdate, setRowToUpdate] = useState<IOtherCostTableRowData>();

  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
        };
      })
    );
  }, [props.data]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];

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

  function editSelectedOtherCost(row: Row) {
    setRowToUpdate(row.data);
    setParentShowModal(true);
  }

  function removeSelectedOtherCost(row: Row) {
    props.onRemoveOtherCost(row.data);
  }

  function onOtherCostUpdated(item: IOtherCostTableRowData) {
    props.onUpdateOtherCost(item);
  }

  return (
    <div className={container}>
      <div className={tableContainer}>
        <GoATable onSort={sortData} width='100%'>
          <thead>
            <tr>
              <th>
                {' '}
                <GoATableSortHeader name={'from'}>From</GoATableSortHeader>{' '}
              </th>
              <th>
                {' '}
                <GoATableSortHeader name={'to'}>To</GoATableSortHeader>{' '}
              </th>
              <th>Rate Type</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>No. of Units</th>
              <th>Cost</th>
              <th>GL Account No.</th>
              <th>Profit Centre</th>
              <th>Cost Centre</th>
              <th>Internal Order</th>
              <th>Fund</th>
              <th>Remarks</th>
              <th className={`${stickyColumn} ${end} ${onTop}`}></th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((x, index) => (
              <tr key={index}>
                <td>{yearMonthDay(x.data.from)}</td>
                <td>{yearMonthDay(x.data.to)}</td>
                <td>{x.data.rateType}</td>
                <td>{x.data.unit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{x.data.numberOfUnits}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.glAccountNumber}</td>
                <td>{x.data.profitCentre}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.fund}</td>
                <td>{x.data.remarks}</td>
                <td className={`${stickyColumn} ${end}`}>
                  <div className={buttonWrapper}>
                    <GoAButton
                      size='compact'
                      type='secondary'
                      onClick={() => editSelectedOtherCost(x)}
                    >
                      {'Edit'}
                    </GoAButton>
                    <GoAButton
                      size='compact'
                      type='secondary'
                      onClick={() => removeSelectedOtherCost(x)}
                    >
                      {'Remove'}
                    </GoAButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </GoATable>
      </div>
      <OtherCostModalDialog
        isAddition={false}
        visible={parentShowModal}
        onAddUpdate={onOtherCostUpdated}
        showOtherCostDialog={setParentShowModal}
        data={rowToUpdate}
      />
    </div>
  );
};

export default OtherCostDetailsTable;
