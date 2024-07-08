import { GoAButton } from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { useEffect, useState } from 'react';
import InvoiceDataTable from './invoice-data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { setRowData } from './invoice-details-slice';
import Select, { MultiValue } from 'react-select';
const { container, buttons, multiSelect } = styles;
interface IDetailsTabProps {}
interface IOptionType {
  value: string;
  label: string;
}
const DetailsTab: React.FC<IDetailsTabProps> = () => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.invoiceDetails.rowData);
  const rateTypes = useAppSelector((state) => state.invoiceDetails.lists?.payableRateTypes);

  const [selectAllEnabled, setSelectAllEnabled] = useState<boolean>(false);
  const [selectedRateTypes, setSelectedRateTypes] = useState<MultiValue<IOptionType>>([]);

  useEffect(() => {
    setSelectAllEnabled(rowData.some((x) => x.isSelected));
  }, [rowData]);

  function onAddSelected() {
    dispatch(
      setRowData(
        rowData.map((r) => {
          return !r.isSelected ? r : { ...r, isSelected: false, isAdded: true };
        }),
      ),
    );
  }

  if (!rateTypes) {
    return null;
  }
  return (
    <div className={container}>
      <div className={buttons}>
        <GoAButton type='secondary' onClick={onAddSelected} disabled={!selectAllEnabled}>
          Add Selected
        </GoAButton>

        <Select
          isMulti
          name='colors'
          options={rateTypes.map((x) => {
            return { value: x, label: x };
          })}
          placeholder='All rate types'
          value={selectedRateTypes}
          menuPosition='fixed'
          onChange={setSelectedRateTypes}
          isSearchable={true}
          className={multiSelect}
          classNamePrefix='multiSelect'
        />
      </div>
      <InvoiceDataTable showCheckBoxes rateTypeFilter={selectedRateTypes?.map((x) => x.value)} />
    </div>
  );
};

export default DetailsTab;
