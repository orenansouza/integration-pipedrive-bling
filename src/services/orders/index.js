const OrderRepository = require('../../repositories/orders')
const ProductRepository = require('../../repositories/products')

function validationPayload(payload) {
  if (!payload.title) {
    return {
      valid: false,
      message: 'title not found',
    }
  }

  if (!payload.person_name) {
    return {
      valid: false,
      message: 'client not found',
    }
  }

  if (!payload.owner_name) {
    return {
      valid: false,
      message: 'owner not found',
    }
  }

  return {
    valid: true,
    body: {
      pipedrive_id: payload.id,
      title: payload.title,
      client_name: payload.person_name,
      owner_name: payload.owner_name,
      value: payload.value,
    },
  }
}

module.exports.createOrder = async (data) => {
  const validation = validationPayload(data)
  if (!validation.valid) {
    throw new Error(validation.message)
  }

  const body = { ...validation.body }

  const order_exists = await OrderRepository.validationExistOrder(body.pipedrive_id)
  if (order_exists) {
    throw new Error('order already registered')
  }

  const response_product_bling = await ProductRepository.createProductBling(body.title)
  if (response_product_bling.data.retorno.erros && response_product_bling.data.retorno.erros.length > 0) {
    console.error(response_product_bling.data.retorno.erros[0][0].erro.message)
    throw new Error(response_product_bling.data.retorno.erros[0][0].erro)
  }

  const product_bling = response_product_bling.data.retorno.produtos[0][0]
  body.bling_id = product_bling.produto.id

  const response_order_bling = await createOrderBling(body)

  if (response_order_bling.data.retorno.erros[0] && response_order_bling.data.retorno.erros[0].length > 0) {
    console.error(response_order_bling.data.retorno.erros[0][0].erro.message)
    throw new Error(response_order_bling.data.retorno.erros[0][0].erro)
  }

  return OrderRepository.createOrder(body)
}

async function createOrderBling(body) {
  const order = {
    pedido: {
      client: {
        name: body.client_name,
      },
      item: {
        code: body.bling_id,
        description: `[${body.pipedrive_id}] - ${body.description}`,
        unit_value: body.value,
        quantity: 1,
      },
    },
  }

  return OrderRepository.createOrderBling(order)
}

module.exports.getOrders = async () => {}
