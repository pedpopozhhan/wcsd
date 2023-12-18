import styles from './summary.module.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
let { container } = styles;



export default function Summary() {

  const [invoiceId, setInvoiceId] = useState("");
  const [dateOfInvoice, setDateOfInvoice] = useState(new Date(Date()));
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [periodEndingDate, setPeriodEndingDate] = useState(new Date(Date()));
  const [invoiceReceivedDate, setInvoiceReceivedDate] = useState(new Date(Date()));
  const [contractNumber, setContractNumber] = useState("");


  useEffect(() => {
    if (sessionStorage.getItem('invoiceData') !== null) {
      let invoiceData = JSON.parse(sessionStorage.getItem('invoiceData') || '{}');
      setInvoiceId(invoiceData.InvoiceID);
      setInvoiceAmount(invoiceData.InvoiceAmount);
      setDateOfInvoice(invoiceData.DateOnInvoie);
      setInvoiceReceivedDate(invoiceData.InvoiceReceived);
      setPeriodEndingDate(invoiceData.PeriodEnding);
      setContractNumber(invoiceData.ContractNumber);
    }

  });

  return (
    <div className={container}>
      <div>
        <div>Vendor</div>
        <div>Air Spray Ltd.</div>
      </div>
      <div>
        <div>Assigned to</div>
        <div>Sarah Tale</div>
      </div>
      <div>
        <div>Contract no.</div>
        <div>{contractNumber}</div>
      </div>
      <div>
        <div>Type</div>
        <div>Casual</div>
      </div>
      <div>
        <div>Invoice no.</div>
        <div>{invoiceId}</div>
      </div>
      <div>
        <div>Invoice date</div>
        <div>{moment(dateOfInvoice).format("yyyy-MM-DD")}</div>
      </div>
      <div>
        <div>Invoice received</div>
        <div>{moment(invoiceReceivedDate).format("yyyy-MM-DD")}</div>
      </div>
      <div>
        <div>Period ending</div>
        <div>{moment(periodEndingDate).format("yyyy-MM-DD")}</div>
      </div>
    </div>
  );
}
