import { useEffect, useState } from 'react';
import styles from './onegx-contract-detail.module.scss';
import contractManagementService from '@/services/contract-management.services';
import { failedToPerform, publishToast } from '@/common/toast';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import { useNavigate, useParams } from 'react-router-dom';
import { IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { GoAButton } from '@abgov/react-components';
import OneGxContractDetailDataPanel from './onegx-contractdetail-data-view-panel';
import OneGxContractDetailDataEditPanel from './onegx-contractdetail-data-edit-panel';
import OneGxContractDetailConfirmationModal from './onegx-contractdetail-confirmation-modal';
const { mainContainer, contractDetailRoot, contractDetailMain, main, tabGroupContainer, tabList, tabContainer, linksToEditAndSave } = styles;

export default function OneGxContractProcessing() {
  const [loading, setIsLoading] = useState<boolean>();
  const auth = useConditionalAuth();
  const { id } = useParams();
  const [contract, setContract] = useState<IOneGxContractDetail>();
  const [retry, setRetry] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (Number(id)) {
      setIsLoading(true);
      const subscription = contractManagementService.getOneGxContract(auth?.user?.access_token, Number(id)).subscribe({
        next: (searchResults) => {
          const data = searchResults;
          setContract(data);
          setIsLoading(false);
        },
        error: (error) => {
          setIsLoading(false);
          console.error(error);
          if (error.response && error.response.status === 403) {
            navigateTo('unauthorized');
          }
          publishToast({
            type: 'error',
            message: failedToPerform('Load OneGxContract', error.response.data),
            callback: () => {
              setRetry(!retry);
            },
          });
        },
      });
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id, retry]);

  if (loading) {
    return null;
  }

  function BackToContractHomeClick() {
    navigate('/contracts');
  }

  function CancelEdit() {
    setOpenModal(true);
  }


  function CloseFromConfirmationModal() {
    setOpenModal(false);
    setTabIndex(1);
  }

  function ContinueEditingFromConfirmationModal() {
    setOpenModal(false);
  }

  function SaveDetails() {
    setTabIndex(1);
  }

  function EditContractDetail() {
    setTabIndex(3);
  }

  return (
    <>
      <div className={mainContainer}>
        <div className={contractDetailRoot}>
          <div className={contractDetailMain}>
            <GoAButton
              {...{ style: '"padding: 0 10px 0 10px;height: 60px;"' }}
              size='compact'
              type='tertiary'
              leadingIcon='chevron-back'
              onClick={() => BackToContractHomeClick()}
            >
              {'Back'}
            </GoAButton>
            <h2>Contract {contract?.contractNumber}</h2>
            <div className={main}>
              <div className={tabGroupContainer}>
                <div className={tabList}>
                  <button id='details' role='tab' aria-selected={tabIndex === 1 || tabIndex === 3} onClick={() => setTabIndex(1)}>
                    <span>Details</span>
                  </button>
                  <button id='tab2' role='tab' aria-selected={tabIndex === 2} onClick={() => setTabIndex(2)}>
                    <span>Tab2</span>
                  </button>
                </div>
                {/* onClick={() => openContractClick(props.contractDetails)} */}
                <div className={tabContainer}>
                  {tabIndex === 1 && (
                    <div className={linksToEditAndSave}>
                      <GoAButton type='tertiary' onClick={() => EditContractDetail()}>
                        Edit
                      </GoAButton>
                    </div>
                  )}
                  {tabIndex === 3 && (
                    <div className={linksToEditAndSave}>
                      <GoAButton type='tertiary' onClick={() => CancelEdit()}>
                        Cancel
                      </GoAButton>
                      <GoAButton type='tertiary' onClick={() => SaveDetails()}>
                        Save
                      </GoAButton>
                    </div>
                  )}
                  {tabIndex === 1 && <OneGxContractDetailDataPanel contractDetails={contract} />}
                  {tabIndex === 2}
                  {tabIndex === 3 && <OneGxContractDetailDataEditPanel contractToUpdate={contract} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OneGxContractDetailConfirmationModal open={openModal} onClose={CloseFromConfirmationModal} onUpdate={ContinueEditingFromConfirmationModal}></OneGxContractDetailConfirmationModal>
    </>
  );
}
