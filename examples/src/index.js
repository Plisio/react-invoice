import React, { useState, useEffect, useRef } from 'react'
import ReactDOM from 'react-dom';
import Invoice from '../../src';
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
