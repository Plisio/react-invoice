import React from 'react'
import InvoiceSvgIcon from '../invoice-svg-icon'
import InvoiceTxUrl from '../invoice-tx-url'

const InvoiceStepResult = ({ customClassName, icon, title, hint, txUrl, children }) => {
  const elHint = hint ? (<div className="invoice__hint">{ hint }</div>) : null
  const elTxUrl = txUrl ? <InvoiceTxUrl txUrl={ txUrl } /> : null

  return (
    <div className={`invoice__step ${customClassName}`}>
      <InvoiceSvgIcon
        className={`invoice__${icon}`}
        href={`invoice__${icon}`}
      />
      <h4 className="invoice__title">{ title }</h4>
      { elHint }
      { elTxUrl }
      { children }
    </div>
  )
}

export default InvoiceStepResult
