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
  if (response_product_bling.data.retorno.erros) {
    console.error(response_product_bling.data.retorno.erros[0][0].erro.msg)
    throw new Error(response_product_bling.data.retorno.erros[0][0].erro.msg)
  }

  const product_bling_cod = response_product_bling.data.retorno.produtos[0][0].produto.codigo

  const response_order_bling = await createOrderBling(body, product_bling_cod)
  if (response_order_bling.data.retorno.erros) {
    console.error(response_order_bling.data.retorno.erros[0].erro.msg)
    throw new Error(response_order_bling.data.retorno.erros[0].erro.msg)
  }

  const order_bling = response_order_bling.data.retorno.pedidos[0].pedido
  body.bling_id = order_bling.idPedido

  return OrderRepository.createOrder(body)
}

async function createOrderBling(body, item_cod) {
  const order = {
    pedido: {
      cliente: {
        name: body.client_name,
      },
      item: {
        codigo: item_cod,
        descricao: body.title,
        vlr_unit: body.value,
        qtde: 1,
      },
    },
  }

  return OrderRepository.createOrderBling(order)
}

module.exports.getOrders = async () => {}
