import {
  GoAButton,
  GoADropdown,
  GoADropdownItem,
} from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { useContext, useEffect, useState } from 'react';
import { InvoiceDetailsContext } from './invoice-details-context';
import InvoiceDataTable from './invoice-data-table';

let { container, buttons } = styles;
interface IDetailsTabProps {}
const DetailsTab: React.FC<IDetailsTabProps> = (props) => {
  const context = useContext(InvoiceDetailsContext);
  const { rowData, setRowData, rateTypes } = context;
  const [selectAllEnabled, setSelectAllEnabled] = useState<boolean>(false);
  const [selectedRateType, setSelectedRateType] = useState<string>('');

  useEffect(() => {
    setSelectAllEnabled(rowData.some((x) => x.isSelected));
  }, [rowData]);

  function onAddSelected() {
    setRowData(
      rowData.map((r) => {
        return !r.isSelected ? r : { ...r, isSelected: false, isAdded: true };
      })
    );
  }

  function onChangeRateType(name: string, type: string | string[]) {
    setSelectedRateType(type as string);
  }

  return (
    <div className={container}>
      <div className={buttons}>
        <GoAButton
          type='secondary'
          onClick={onAddSelected}
          disabled={!selectAllEnabled}
        >
          Add Selected
        </GoAButton>
        <GoADropdown
          filterable
          placeholder='All rate types'
          onChange={onChangeRateType}
          value={selectedRateType}
        >
          {rateTypes.map((x, i) => {
            return <GoADropdownItem key={i} value={x} label={x} />;
          })}
        </GoADropdown>
      </div>
      <InvoiceDataTable showCheckBoxes rateTypeFilter={selectedRateType} />
    </div>
  );
};

export default DetailsTab;
