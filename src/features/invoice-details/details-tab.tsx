import { GoAButton } from '@abgov/react-components';
import styles from './details-tab.module.scss';
import { useEffect, useState } from 'react';
import InvoiceDataTable from './invoice-data-table';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

import { setRowData } from '@/app/app-slice';
import { MultiSelect } from 'react-multi-select-component';

const { container, buttons, multiSelect } = styles;
interface IDetailsTabProps {}
interface IOptionType {
  value: string;
  label: string;
}
const DetailsTab: React.FC<IDetailsTabProps> = () => {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector((state) => state.app.rowData);
  const rateTypes = useAppSelector((state) => state.invoiceDetails.lists?.payableRateTypes);

  const [selectAllEnabled, setSelectAllEnabled] = useState<boolean>(false);

  const [selectedRateTypes, setSelectedRateTypes] = useState<IOptionType[]>([]);


  // re: https://react-multi-select-component.pages.dev/?path=/story/recipes-localization--page
  const options = {
    allItemsAreSelected: 'All rate types are selected.',
    clearSearch: 'Clear Search',
    clearSelected: 'Clear Selected',
    noOptions: 'No options',
    search: 'Search',
    selectAll: 'Select All',
    selectAllFiltered: 'Select All (Filtered)',
    selectSomeItems: 'All rate types',
    create: 'Create',
  };
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

        <MultiSelect
          options={rateTypes.map((x) => {
            return { value: x, label: x };
          })}
          value={selectedRateTypes}
          onChange={setSelectedRateTypes}
          labelledBy='All rate types'
          overrideStrings={options}
          className={multiSelect}

        />
      </div>
      <InvoiceDataTable showCheckBoxes showRowIndicator rateTypeFilter={selectedRateTypes?.map((x) => x.value)} />
    </div>
  );
};

export default DetailsTab;
