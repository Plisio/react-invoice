import React from 'react'

const InvoiceSvgIcon = ({ href, className }) => {
  const useTag = `<use xlink:href="#${href}" />`

  return (
    <svg
      className={className}
      dangerouslySetInnerHTML={{ __html: useTag }}
      xmlns="http://www.w3.org/2000/svg"
    />
  )
}

export default InvoiceSvgIcon
