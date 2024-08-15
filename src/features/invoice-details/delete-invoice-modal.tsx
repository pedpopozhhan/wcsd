import { GoAButton, GoAButtonGroup, GoAModal } from '@abgov/react-components';
import { useState } from 'react';
interface IDeleteInvoiceModalProps {
  onClose?: () => void;
  onDelete: () => void;
}
const DeleteInvoiceModal: React.FC<IDeleteInvoiceModalProps> = (props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  function onCancel() {
    setOpenModal(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  function onDelete() {
    setOpenModal(false);
    if (props.onDelete) {
      props.onDelete();
    }
  }
  return (
    <>
      <GoAButton type='secondary' onClick={() => setOpenModal(true)}>
        Delete
      </GoAButton>
      <GoAModal
        open={openModal}
        heading='Delete invoice'
        role='dialog'
        actions={
          <GoAButtonGroup alignment='end' mt='l'>
            <GoAButton type='secondary' onClick={onCancel}>
              Cancel
            </GoAButton>
            <GoAButton type='primary' variant='destructive' onClick={onDelete}>
              Delete
            </GoAButton>
          </GoAButtonGroup>
        }
      >
        <p>Are you sure you want to delete this invoice? Deleted invoices will be removed from Drafts.</p>
      </GoAModal>
    </>
  );
};

export default DeleteInvoiceModal;
