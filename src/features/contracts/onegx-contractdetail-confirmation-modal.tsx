import { GoAButton, GoAButtonGroup, GoAFormItem, GoAModal } from '@abgov/react-components';
import { useEffect, useState } from 'react';
interface IOneGxContractDetailConfirmationModal {
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}
const OneGxContractDetailConfirmationModal: React.FC<IOneGxContractDetailConfirmationModal> = (props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [modalWidth] = useState<string>('500px');

  useEffect(() => {
    setOpenModal(props.open);
  }, [props]);

  function onCancel() { props.onClose(); }
  function onUpdate() { props.onUpdate(); }
  function getHeading() { return 'Are you sure you want to close without saving?'; }

  return (
    <GoAModal open={openModal} heading={getHeading()} maxWidth={modalWidth}>
      <GoAFormItem label='' helpText='Closing will discard your changes.'>
      </GoAFormItem>
      <GoAButtonGroup alignment='end' mt='l'>
        <GoAButton type='secondary' onClick={onCancel}>
          Close
        </GoAButton>
        <GoAButton type='primary' onClick={onUpdate}>
          Continue editing
        </GoAButton>
      </GoAButtonGroup>
    </GoAModal>
  );
};

export default OneGxContractDetailConfirmationModal;
