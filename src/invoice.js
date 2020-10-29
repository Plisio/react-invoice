import React, { useMemo } from 'react'

import './invoice.scss'

import InvoiceIconSprite from './components/invoice-icon-sprite'
import InvoiceProgressBar from './components/invoice-progress-bar'
import InvoiceInfo from './components/invoice-info'
import InvoiceStepPending from './components/invoice-step-pending'
import InvoiceStepPay from './components/invoice-step-pay'
import InvoiceStepResult from './components/invoice-step-result'
import InvoiceStepLoading from './components/invoice-step-loading'

import {
  STATUS_NEW,
  STATUS_PENDING,
  STATUS_MISMATCH,
  STATUS_COMPLETED,
  STATUS_EXPIRED,
  STATUS_CANCELLED,
  STATUS_ERROR
} from './utils/constants'

import { formatCrypto } from './utils/formatters'

const Invoice = ({ preLoading, invoice, cancelFetch }) => {

  const invoiceIsProcessing = useMemo(() => {
    const res = [STATUS_NEW, STATUS_PENDING].includes(invoice.status)
    if (!preLoading && Object.keys(invoice).length && !res) {
      cancelFetch()
    }
    return res
  }, [preLoading, invoice])

  const isPaymentWaiting = useMemo(() => {
    return [STATUS_NEW, STATUS_PENDING].includes(invoice.status) && invoice.pending_amount > 0
  }, [invoice])

  const isWaitingForConfirmations = useMemo(() => {
    return [STATUS_PENDING].includes(invoice.status) && invoice.pending_amount <= 0
  }, [invoice])

  const isOverpaid = useMemo(() => {
    return [STATUS_MISMATCH].includes(invoice.status)
  }, [invoice])

  const isFinished = useMemo(() => {
    return [STATUS_COMPLETED].includes(invoice.status)
  }, [invoice])

  const isExpired = useMemo(() => {
    return [STATUS_EXPIRED, STATUS_CANCELLED].includes(invoice.status)
  }, [invoice])

  const isUnderpaid = useMemo(() => {
    return invoice && isExpired && invoice.pending_amount < invoice.amount
  }, [isExpired, invoice])

  const isError = useMemo(() => {
    return [STATUS_ERROR].includes(invoice.status)
  }, [invoice])

  return (
    <div className="invoice__wrap">
      <InvoiceIconSprite />

      <div className="invoice">
        <div className="invoice__header">
          {/* invoice-progress-bar */}
          { !preLoading && invoiceIsProcessing &&
            <InvoiceProgressBar
              expireUtc={ invoice && invoice.expire_utc }
              expireMsg="Expired, waiting for invoice refresh..."
            />
          }

          {/* invoice-info */}
          { !preLoading && Object.keys(invoice).length > 0 &&  <InvoiceInfo invoice={ invoice } /> }
        </div>

        <div className="invoice__content">
          {(function() {
            // pay
            if (isPaymentWaiting) {
              return <InvoiceStepPay invoice={ invoice } />

            // pending
            } else if (isWaitingForConfirmations) {
              return <InvoiceStepPending invoice={ invoice } />

            // overpaid
            } else if (isOverpaid) {
              return <InvoiceStepResult
                customClass="step_overpaid"
                icon="icon_overpaid"
                title="The order has been overpaid"
                hint={`You have payed
                  ${ formatCrypto(Math.abs(invoice.pending_amount) + Number(invoice.amount)) } ${invoice.currency},
                  it is more than required sum.
                  In case of inconvenience, please, contact support.
                `}
                txUrl={invoice.txUrl}
              />

            // finished
            } else if (isFinished) {
              return <InvoiceStepResult
                customClass="step_completed"
                icon="icon_check"
                title="Payment complete"
                txUrl={invoice.txUrl}
              />

            // underpaid
            } else if (isUnderpaid) {
              return <InvoiceStepResult
                customClass="step_underpaid"
                icon="icon_expired"
                title="The order has not been fully paid"
              >
                <p class="invoice__hint">We have received
                  { formatCrypto((invoice.amount - invoice.pending_amount)) } { invoice.currency }
                  of { invoice.amount } { invoice.currency } required.
                  To get your payment back, please, contact support.
                </p>
              </InvoiceStepResult>

            // expired
            } else if (isExpired) {
              return <InvoiceStepResult
                customClass="step_expired"
                icon="icon_expired"
                title="This order has expired"
              />

            // error
            } else if (isError) {
              return <InvoiceStepResult
                customClass="step_error"
                icon="icon_exclamation"
                title="Ooops..."
                hint="Something went wrong with this operation. Please, contact support, so we could figure this out."
              />

            // loading
            } else {
              return <InvoiceStepLoading />
            }
          })()}
        </div>

        <div className="invoice__footer"></div>
      </div>
    </div>
  )
}

export default Invoice
