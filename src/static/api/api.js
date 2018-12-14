import Cookie from 'js-cookie'

const config = {
  baseUrl: 'http://gc.moscales.com'
}

function fetchPost(url, params = {}, method = 'POST', header = {}) {
  url = config.baseUrl + '/backend' + url
  let newParams = {}
  if (method === 'GET' || method === 'get') {
    newParams = null
  } else {
    newParams = { ...params, session_id: Cookie.get('session') }
  }

  let defaultHeaders = {
    'Content-Type': 'application/json'
  }
  let newHeader = { ...defaultHeaders, ...header }
  return fetch(url, {
    method,
    body: JSON.stringify(newParams),
    headers: newHeader
  })
    .then(res => {
      if (res.status === 200) {
        return res.json()
      } else {
        throw res
      }
    })
    .then(res => {
      if (res.code === 200) {
        return res
      } else {
        throw res
      }
    })
    .catch(res => {
      console.log('we catch a mistake')
      return res
    })
}

export default fetchPost
