import React from 'react'

const InvoiceTxUrl = ({ txUrl }) => {
  const txUrlToShow = txUrl === 'string'
    ? txUrl
    : txUrl[txUrl.length - 1]

  return (
    <a
      className="invoice__txUrl"
      href={ txUrlToShow }
      title="Check my transaction"
      target="_blank"
      rel="noopener noreferrer"
    >
      <InvoiceSvgIcon
        className="invoice__icon_link_external"
        href="invoice__icon_link_external"
      />
      Check my transaction
    </a>
  )
}

export default InvoiceTxUrl
