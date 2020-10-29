import React, { useEffect } from 'react'
import './invoice-step-pay.scss'
import InvoiceSvgIcon from '../invoice-svg-icon'
import ClipboardJS from 'clipboard'

import { formatCrypto } from '../../utils/formatters'

const InvoiceStepPay = ({ invoice: { qr_code, currency, wallet_hash, pending_amount } }) => {

  useEffect(() => {
    const clipBoard = new ClipboardJS('.invoice__copy_stepPay')

    return function cleanup () {
      clipBoard.destroy()
    }
  }, [])

  return (
    <div className="invoice__step step_pay">
      <img
        className="step_pay__qr"
        src={ qr_code }
        alt="Invoice QR code"
        width="192"
        height="192"
      />
      <p
        className="invoice__hint"
        id="invoice__hint_payment"
      >Send the indicated amount to the address below:</p>

      {/* address */}
      <div className="step_pay__formGroup">
        <span className="step_pay__inputGroup_prepend">
          <img
            className="step_pay__psysImg"
            src={ `https://plisio.net/img/psys-icon/${currency}.svg` }
            alt={ currency }
            width="18"
            height="18"
          />
        </span>
        <input
          type="text"
          id="step_pay__address"
          className="step_pay__input invoice__copy_stepPay"
          value={ wallet_hash }
          readOnly
          aria-label="Payment address"
          aria-describedby="step_pay__hint_payment"
          data-clipboard-target="#step_pay__address"
        />
        <label htmlFor="step_pay__address" className="step_pay__inputGroup_append">
          <InvoiceSvgIcon
            className="step_pay__icon_btn step_pay__icon_btn_copy"
            href="invoice__icon_copy"
          />
        </label>
      </div>

      {/* amount */}
      <div className="step_pay__formGroup">
        <span
          className="step_pay__inputGroup_prepend step_pay__currency invoice__copy_stepPay"
          data-clipboard-target=".step_pay__currency"
        >{ currency }</span>
        <input
          type="text"
          id="step_pay__amount"
          className="step_pay__input invoice__copy_stepPay"
          value={ formatCrypto(pending_amount) }
          readOnly
          aria-label="Pending amount"
          aria-describedby="step_pay__hint_payment"
          data-clipboard-target="#step_pay__amount"
        />
        <label htmlFor="step_pay__amount" className="step_pay__inputGroup_append" >
          <InvoiceSvgIcon
            className="step_pay__icon_btn step_pay__icon_btn_copy"
            href="invoice__icon_copy"
          />
        </label>
      </div>

    </div>
  )
}

export default InvoiceStepPay
