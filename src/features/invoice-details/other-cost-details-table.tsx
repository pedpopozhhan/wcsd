import { GoAButton, GoATable, GoATableSortHeader } from '@abgov/react-components';
import styles from './other-cost-details-table.module.scss';
import { yearMonthDay } from '@/common/dates';
import { IOtherCostTableRowData } from '@/interfaces/common/other-cost-table-row-data';
import OtherCostModalDialog from './other-cost-modal-dialog';
import { useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';
import IOtherCostTableRow from '@/interfaces/common/other-cost-table-row';

const { container, buttonWrapper, tableContainer, stickyColumn, end, onTop } = styles;

interface IOtherCostTableProps {
  data: IOtherCostTableRowData[];
  onRemoveOtherCost: (item: IOtherCostTableRow) => void;
  onUpdateOtherCost: (item: IOtherCostTableRow) => void;
  onAddOtherCost: (item: IOtherCostTableRowData) => void;
}
const OtherCostDetailsTable: React.FC<IOtherCostTableProps> = (props) => {
  const [rowData, setRowData] = useState<IOtherCostTableRow[]>([]);
  const [parentShowModal, setParentShowModal] = useState<boolean>(false);
  const [rowToUpdate, setRowToUpdate] = useState<IOtherCostTableRow>();

  useEffect(() => {
    setRowData(
      props.data.slice().map((x, i) => {
        return {
          index: i,
          data: x,
        };
      }),
    );
  }, [props.data]);

  function sortData(sortBy: string, sortDir: number) {
    const data = [...rowData];
    // TODO: Possible bug here...data is not on the object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  function editSelectedOtherCost(item: IOtherCostTableRow) {
    setRowToUpdate(item);
    setParentShowModal(true);
  }

  function onOtherCostAdded(item: IOtherCostTableRowData) {
    props.onAddOtherCost(item);
  }

  function removeSelectedOtherCost(item: IOtherCostTableRow) {
    props.onRemoveOtherCost(item);
  }

  function onOtherCostUpdated(item: IOtherCostTableRow) {
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
              <th>Rate type</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>No. of units</th>
              <th>Cost</th>
              <th>Internal order</th>
              <th>Cost centre</th>
              <th>Fund</th>
              <th>G/L acct</th>
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
                <td>{x.data.rateUnit}</td>
                <td>{convertToCurrency(x.data.ratePerUnit)}</td>
                <td>{x.data.noOfUnits}</td>
                <td>{convertToCurrency(x.data.cost)}</td>
                <td>{x.data.internalOrder}</td>
                <td>{x.data.costCentre}</td>
                <td>{x.data.fund}</td>
                <td>{x.data.account}</td>
                <td>{x.data.remarks}</td>
                <td className={`${stickyColumn} ${end}`}>
                  <div className={buttonWrapper}>
                    <GoAButton size='compact' type='secondary' onClick={() => editSelectedOtherCost(x)}>
                      {'Edit'}
                    </GoAButton>
                    <GoAButton size='compact' type='secondary' onClick={() => removeSelectedOtherCost(x)}>
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
        onAdd={onOtherCostAdded}
        onUpdate={onOtherCostUpdated}
        showOtherCostDialog={setParentShowModal}
        rowToUpdate={rowToUpdate}
      />
    </div>
  );
};

export default OtherCostDetailsTable;
