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

module.exports.validationExistOrder = async (pipedriveId) => {
  const order = await OrderModel.findOne({ pipedriveId })
  if (order) {
    return true
  }

  return false
}

module.exports.getOrders = async (page, limit) => {
  const skip = (page - 1) * limit

  const totalOrders = await OrderModel.estimatedDocumentCount().exec()
  const orders = await OrderModel.find().skip(skip).limit(limit).sort({ createdAt: 'desc' }).lean()

  return {
    pagination: {
      currentPage: page,
      limit,
      totalItems: totalOrders,
    },
    orders,
  }
}
