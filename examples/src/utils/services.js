const getQueryVariable = (variable) => {
  const foundOne = window.location.search.substring(1)
    .split('&')
    .filter(i => {
      return decodeURIComponent(i.split('=')[0]) === variable
    })
  if (foundOne.length) {
    return decodeURIComponent(foundOne[0].split('=')[1])
  }
}

const getResource = async (url) => {
  const res = await fetch(`${url}`)

  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, received ${res.status}`)
  }

  return await res.json()
}

export { getQueryVariable, getResource }
