import { GoAButton, GoADropdown, GoADropdownItem } from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { useEffect, useState } from 'react';
import InvoiceDataTable from './invoice-data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setRowData } from './invoice-details-slice';

const { container, buttons } = styles;
interface IDetailsTabProps {}
const DetailsTab: React.FC<IDetailsTabProps> = (props) => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const rateTypes = useAppSelector((state) => state.invoiceDetails.rateTypes);

  const [selectAllEnabled, setSelectAllEnabled] = useState<boolean>(false);
  const [selectedRateType, setSelectedRateType] = useState<string>('');

  useEffect(() => {
    setSelectAllEnabled(rowData.some((x) => x.isSelected));
  }, [rowData]);

  function onAddSelected() {
    dispatch(
      setRowData(
        rowData.map((r) => {
          return !r.isSelected ? r : { ...r, isSelected: false, isAdded: true };
        })
      )
    );
  }

  function onChangeRateType(name: string, type: string | string[]) {
    setSelectedRateType(type as string);
  }

  return (
    <div className={container}>
      <div className={buttons}>
        <GoAButton type='secondary' onClick={onAddSelected} disabled={!selectAllEnabled}>
          Add Selected
        </GoAButton>
        <GoADropdown filterable placeholder='All rate types' onChange={onChangeRateType} value={selectedRateType}>
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
