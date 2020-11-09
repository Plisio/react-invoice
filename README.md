# React invoice white label
This is a react component for Plisio payment processing.
[Checkout docs](https://plisio.net/documentation/endpoints/create-an-invoice).

## Install
```
yarn add @plisio/react-invoice
npm install @plisio/react-invoice
```

## Props
| Prop name | Type | Default value | Description |
| ----- | ---- | ------------- | ----------- |
| `preLoading` | Boolean | true | Invoice is loading (while data prefetch) |
| `invoice` | Object | {} | Invoice data |
| `cancelFetch` | Function | function () {} | Callback function that discards fetching data interval |


## Slots (react-children)
If you are not satisfied with the display of any component, you can redefine it via slots (react-children):

| Slot name | Description |
| ----- | ----------- |
| `iconSprite` | Invoice icon sprite. Uses own by default. |
| `invoiceHeader` | Invoice header. Uses own by default. |
| `invoiceFooter` | Invoice footer. Is ```null``` by default. |
| `stepPay` | Invoice step-pay. Uses own by default. |
| `stepPending` | Invoice step-pending. Uses own by default. |
| `stepPending` | Invoice step-pending. Uses own by default. |
| `stepOverpaid` | Invoice step-overpaid. Uses own by default. |
| `stepCompleted` | Invoice step-completed. Uses own by default. |
| `stepUnderpaid` | Invoice step-underpaid. Uses own by default. |
| `stepExpired` | Invoice step-expired. Uses own by default. |
| `stepError` | Invoice step-error. Uses own by default. |
| `stepLoading` | Invoice step-loading. Uses own by default. |


Create react white-label Plisio invoice. Css file has been extracted to separate file, so you could include it manually or customize the styles yourself.

```
import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Invoice from '@plisio/react-invoice'
import '@plisio/react-invoice/dist/style.css' // optional
import { getQueryVariable, getResource } from './utils/services'

const App = () => {
  let id = null

  const intervalFetch = useRef(null)
  const [preLoading, setPreLoading] = useState(() => true)
  const [invoice, setInvoice] = useState(() => ({}))

  const fetchData = async () => {
    try {
      const invoice = await getResource('http://localhost:3001/invoice',
        {
          params: {
            page: 'invoice',
            invoice_id: id
          }
        }
      )

      setInvoice((prevInvoice) => invoice || {})
    } catch (error) {
      console.log('Failed to fetch data.', error)
    }
  }

  const cancelFetch = () => {
    clearInterval(intervalFetch.current)
  }

  const init = async () => {
    id = getQueryVariable('invoice_id')

    setPreLoading((prevPreLoading) => true)

    if (!id) {
      setPreLoading((prevPreLoading) => false)
      console.error('No invoice_id param found.')
    } else {
      await fetchData()
      setPreLoading((prevPreLoading) => false)
      intervalFetch.current = setInterval(async () => {
        await fetchData()
      }, 15 * 1000)
    }
  }

  useEffect(() => {
    init()
    return function cleanup () {
      cancelFetch()
    }
  }, [])

  return (
    <Invoice
      preLoading={ preLoading }
      invoice={ invoice }
      cancelFetch={ cancelFetch }
    />
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

You could try out an example app with mock data via dev mode (you`ll need to install [json-server](https://www.npmjs.com/package/json-server) additionally):

```
npm i -g json-server
git clone https://github.com/Plisio/react-invoice.git
cd react-invoice
npm run dev
```
