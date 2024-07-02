import { useEffect, useState } from 'react';
import styles from './onegx-contract-detail.module.scss';
import contractManagementService from '@/services/contract-management.services';
import { failedToPerform, publishToast } from '@/common/toast';
import { useConditionalAuth } from '@/app/hooks';
import { navigateTo } from '@/common/navigate';
import { useParams } from 'react-router-dom';
import { IOneGxContractDetail } from '@/interfaces/contract-management/onegx-contract-management-data';
import { yearMonthDay } from '@/common/dates';
const { container, header, topHeader, twoColContainer } = styles;

export default function OneGxContractProcessing() {
  const [loading, setIsLoading] = useState<boolean>();
  const auth = useConditionalAuth();
  const { id } = useParams();
  const [contract, setContract] = useState<IOneGxContractDetail>();
  const [retry, setRetry] = useState<boolean>(false);

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

  return (
    <div>
      <div className={topHeader}></div>
      <h2 className={header}>{contract?.contractNumber}</h2>
      <h3 className={header}>{contract?.contractWorkspaceRef}</h3>
      <div className={container}>
        <div>
          <div>Vendor</div>
          <div>{contract?.supplierid}</div>
        </div>
        <div>
          <div>
            <label>Vendor ID</label>
          </div>
          <div>{contract?.supplierName}</div>
        </div>
      </div>
      <div className={twoColContainer}>
        <div>
          <div>Effective Date</div>
          <div>{yearMonthDay(contract?.workspace?.effectivedate)}</div>
        </div>
        <div>
          <div>Expiry Date</div>
          <div>{yearMonthDay(contract?.workspace?.currExpirationdate)}</div>
        </div>
      </div>
    </div>
  );
}
