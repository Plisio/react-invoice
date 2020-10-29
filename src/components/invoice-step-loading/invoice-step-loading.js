import React from 'react'
import InvoiceSvgIcon from '../invoice-svg-icon'

const InvoiceStepLoading = () => {
  return (
    <div className="invoice__step step_loading">
      <InvoiceSvgIcon
        className="step_loading__icon_loader"
        href="invoice__icon_loader"
      />
    </div>
  )
}

export default InvoiceStepLoading
