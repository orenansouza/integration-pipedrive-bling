const querystring = require('querystring')
const { default: Axios } = require('axios')
const { convertJsToXml } = require('../../utils/convert-js-to-xml')

const OrderModel = require('../../models/orders')

module.exports.createOrder = async (body) => {
  return OrderModel.create({ ...body })
}

module.exports.createOrderBling = async (body) => {
  const axios = Axios.create({
    baseURL: process.env.BLING_URL,
  })

  const xmlOrder = convertJsToXml(body)
  const query = querystring.stringify({
    apikey: process.env.BLING_API_KEY,
    xml: xmlOrder,
  })

  return axios.post(`/pedido/json?${query}`)
}

module.exports.validationExistOrder = async (pipedrive_id) => {
  const order = await OrderModel.findOne({ pipedrive_id })
  if (order) {
    return true
  }

  return false
}
