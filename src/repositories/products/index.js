const querystring = require('querystring')
const { default: Axios } = require('axios')
const { convertJsToXml } = require('../../utils/convert-js-to-xml')

module.exports.createProductBling = (description) => {
  const axios = Axios.create({
    baseURL: process.env.BLING_URL,
  })

  const code = Date.now().toString()
  const product = {
    produto: {
      codigo: code,
      descricao: description,
      tipo: 'S',
    },
  }

  const xmlProduct = convertJsToXml(product)
  const query = querystring.stringify({
    apikey: process.env.BLING_API_KEY,
    xml: xmlProduct,
  })

  return axios.post(`/produto/json?${query}`)
}
