import React from 'react'
import './invoice-step-pending.scss'
import InvoiceSvgIcon from '../invoice-svg-icon'
import InvoiceTxUrl from '../invoice-tx-url'

const InvoiceStepPending = ({ invoice: { expected_confirmations, confirmations, txUrl } }) => {
  const confirmsRenderTo = [1, '1'].includes(expected_confirmations)
    ? `${expected_confirmations} confirmation`
    : `${expected_confirmations - confirmations} of ${expected_confirmations} confirmations`

  const elTxUrl = txUrl ? <InvoiceTxUrl txUrl={ txUrl } /> : null

  return (
    <div className="invoice__step step_pending">
      <InvoiceSvgIcon
        className="step_pending__icon_loader"
        href="invoice__icon_loader"
      />

      <h4 className="invoice__title">Payment received, <br />
        waiting for { confirmsRenderTo }
      </h4>

      <div className="invoice__hint">Please wait until network confirms your payment. It usually takes 15-60 minutes</div>

      { elTxUrl }
    </div>
  )
}

export default InvoiceStepPending
