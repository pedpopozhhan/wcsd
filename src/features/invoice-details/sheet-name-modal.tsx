// import styles from './sheet-name-modal.module.scss';

import { GoAButton, GoAButtonGroup, GoAFormItem, GoAInput, GoAModal } from '@abgov/react-components';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect, useState } from 'react';
import { setServiceSheetName } from '@/app/app-slice';
interface ISheetNameModalProps {
  open: boolean;
  onClose: () => void;
}
const Summary: React.FC<ISheetNameModalProps> = (props) => {
  const dispatch = useAppDispatch();
  const invoiceData = useAppSelector((state) => state.app.invoiceData);
  const [name, setName] = useState<string>(invoiceData.UniqueServiceSheetName);
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setOpenModal(props.open);
    setName(invoiceData.UniqueServiceSheetName);
  }, [props]);

  function onCancel() {
    props.onClose();
  }
  function onUpdate() {
    dispatch(setServiceSheetName(name));
    props.onClose();
  }

  function getHeading() {
    return invoiceData.UniqueServiceSheetName ? 'Edit name' : 'Enter name';
  }
  function onChange(name: string, value: string) {
    setName(value);
  }

  return (
    <GoAModal open={openModal} heading={getHeading()}>
      <GoAFormItem label='Service sheet' helpText='Refer to Ariba for service sheet name'>
        <GoAInput name='sheetName' value={name} onChange={onChange}></GoAInput>
      </GoAFormItem>
      <GoAButtonGroup alignment='end' mt='l'>
        <GoAButton type='secondary' onClick={onCancel}>
          Cancel
        </GoAButton>
        <GoAButton type='primary' onClick={onUpdate}>
          Update
        </GoAButton>
      </GoAButtonGroup>
    </GoAModal>
  );
};

export default Summary;
