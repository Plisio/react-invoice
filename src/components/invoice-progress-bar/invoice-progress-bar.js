import React, { useEffect, useState } from 'react'
import './invoice-progress-bar.scss'

const InvoiceProgressBar = ({ expireUtc, expireMsg, callback }) => {
  const countDownTimestamp = new Date(parseInt(expireUtc)).getTime()
  let timerId =  null
  let timeLeft = 0
  let timeTotal = 0
  let dateToRender = {
    hours: '00',
    minutes: '00',
    seconds: '00'
  }

  const [stringToRender, setStringToRender] = useState(() => '')
  const [progress, setProgress] = useState(() => 0)

  const calc = () => {
    const now = new Date().getTime()
    timeLeft = countDownTimestamp - now

    // dateToRender.days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
    dateToRender.hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    dateToRender.minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    dateToRender.seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    let tmpProgress = Math.floor(100 - (timeLeft / timeTotal) * 100)
    setProgress((progress) => tmpProgress )
  }


  const render = () => {
    if (timeLeft <= 0) {
      setTimeout(() => {
        setStringToRender((stringToRender) => expireMsg)
      }, 1000)
    } else {
      setStringToRender((stringToRender) => {
        return Object.values(dateToRender)
          .map(i => i >= 10 ? i : `0${i}`)
          .join(' : ')
      })
    }
  }

  const fin = (firstRender = false) => {
    if (firstRender) render()
    clearTimeout(timerId)
    if (callback) callback()
  }

  const tick = () => {
    calc()
    render()
    if (timeLeft < 0) {
      fin()
    } else {
      timerId = setTimeout(tick, 1000)
    }
  }

  const init = () => {
    calc()
    timeTotal = timeLeft
    timeLeft <= 0 ? fin(true) : tick()
  }

  useEffect(() => {
    init()
    return function cleanup () {
      clearTimeout(timerId)
    }
  }, [])

  return (
    <div className="invoice__progress progress">
      <div
        className="invoice__progressBar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin="0"
        aria-valuemax="100"
        style={{ width: `${progress}%` }}
      >
      </div>
      <span className="invoice__progressHint">{ stringToRender }</span>
    </div>
  )
}

export default InvoiceProgressBar
