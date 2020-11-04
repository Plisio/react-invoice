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

const Invoice = ({
  preLoading = true,
  invoice = {},
  cancelFetch = function () {},
  children = {}
}) => {

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
      {/* invoice-icon-sprite */}
      {(function () {
        return children.iconSprite
          ? children.iconSprite
          : <InvoiceIconSprite />
      })()}


      <div className="invoice">
        {/* invoice-header */}
        {(function() {
          return children.invoiceHeader
            ? children.invoiceHeader
            : <div className="invoice__header">
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
        }())}

        <div className="invoice__content">
          {(function() {
            // pay
            if (isPaymentWaiting) {
              return children.stepPay
                ? children.stepPay
                : <InvoiceStepPay invoice={ invoice } />

            // pending
            } else if (isWaitingForConfirmations) {
              return children.stepPending
                ? children.stepPending
                : <InvoiceStepPending invoice={ invoice } />

            // overpaid
            } else if (isOverpaid) {
              return children.stepOverpaid
                ? children.stepOverpaid
                : <InvoiceStepResult
                    customClassName="step_overpaid"
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
              return children.stepCompleted
                ? children.stepCompleted
                : <InvoiceStepResult
                    customClassName="step_completed"
                    icon="icon_check"
                    title="Payment complete"
                    txUrl={invoice.txUrl}
                  />

            // underpaid
            } else if (isUnderpaid) {
              return children.stepUnderpaid
                ? children.stepUnderpaid
                : <InvoiceStepResult
                    customClassName="step_underpaid"
                    icon="icon_expired"
                    title="The order has not been fully paid"
                  >
                    <p className="invoice__hint">{ `We have received
                      ${ formatCrypto(invoice.amount - invoice.pending_amount) } ${ invoice.currency }
                      of ${ invoice.amount } ${ invoice.currency } required.
                      To get your payment back, please, contact support.` }
                    </p>
                  </InvoiceStepResult>

            // expired
            } else if (isExpired) {
              return children.stepExpired
                ? children.stepExpired
                : <InvoiceStepResult
                    customClassName="step_expired"
                    icon="icon_expired"
                    title="This order has expired"
                  />

            // error
            } else if (isError) {
              return children.stepError
                ? children.stepError
                : <InvoiceStepResult
                    customClassName="step_error"
                    icon="icon_exclamation"
                    title="Ooops..."
                    hint="Something went wrong with this operation. Please, contact support, so we could figure this out."
                  />

            // loading
            } else {
              return children.stepLoading
                ? children.stepLoading
                : <InvoiceStepLoading />
            }
          })()}
        </div>

        {/* invoice-footer */}
        { children.invoiceFooter }
      </div>
    </div>
  )
}

export default Invoice
