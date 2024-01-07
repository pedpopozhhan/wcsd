import {
  GoAButton,
  GoACheckbox,
  GoATable,
  GoATableSortHeader,
} from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { yearMonthDay } from '@/common/dates';
import { useContext, useEffect, useState } from 'react';
import { convertToCurrency } from '@/common/currency';
import {
  IDetailsTableRow,
  InvoiceDetailsContext,
} from './invoice-details-context';
import InvoiceDataTable from './invoice-data-table';

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
  //   onAddRemove: (newTotal: number) => any;
}
const DetailsTab: React.FC<IDetailsTabProps> = (props) => {
  const context = useContext(InvoiceDetailsContext);
  const { rowData, setRowData } = context;

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

  return <InvoiceDataTable />;
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
