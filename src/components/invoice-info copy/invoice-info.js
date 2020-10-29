import React, { useEffect } from 'react'
// import './invoice-info.scss'
import { formatFiat, formatCrypto } from '@/utils/formatters'
import ClipboardJS from 'clipboard'

const InvoiceInfo = ({ invoice : {
  order_id, amount, currency, source_rate, source_currency
} }) => {

  const sourceAmount = formatFiat(amount / source_rate)

  useEffect(() => {
    const clipBoard = new ClipboardJS('.invoice__copy_info')

    return function cleanup () {
      clipBoard.destroy()
    }
  }, [])

  return (
    <div className="invoice__info info">
      <div className="info__shop">
        <small>Order #</small>
        <span
          className="info__orderId invoice__copy_info"
          data-clipboard-target=".info__orderId"
        >{ order_id }</span>
      </div>
      <div className="info__amount">
        <strong
          className="info__amount_crypto invoice__copy_info"
          data-clipboard-target=".info__amount_crypto"
        >{ formatCrypto(amount) }</strong>
        &nbsp;
        <strong
          className="info__amount_curr invoice__copy_info"
          data-clipboard-target=".info__amount_curr"
        >{ currency }</strong>
        <br />
        <span
          className="info__sourceAmount invoice__copy_info"
          data-clipboard-target=".info__sourceAmount"
        >{ sourceAmount }</span>
        &nbsp;
        <span
          className="info__sourceCurrency invoice__copy_info"
          data-clipboard-target=".info__sourceCurrency"
        >{ source_currency}</span>
      </div>
    </div>
  )
}

export default InvoiceInfo
