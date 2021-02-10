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

  if (!payload.ownerName) {
    return {
      valid: false,
      message: 'owner not found',
    }
  }

  return {
    valid: true,
    body: {
      pipedriveId: payload.id,
      title: payload.title,
      clientName: payload.person_name,
      ownerName: payload.ownerName,
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

  const orderExists = await OrderRepository.validationExistOrder(body.pipedriveId)
  if (orderExists) {
    throw new Error('order already registered')
  }

  const responseProductBling = await ProductRepository.createProductBling(body.title)
  if (responseProductBling.data.retorno.erros) {
    console.error(responseProductBling.data.retorno.erros[0][0].erro.msg)
    throw new Error(responseProductBling.data.retorno.erros[0][0].erro.msg)
  }

  const productBlingCod = responseProductBling.data.retorno.produtos[0][0].produto.codigo

  const responseOrderBling = await createOrderBling(body, productBlingCod)
  if (responseOrderBling.data.retorno.erros) {
    console.error(responseOrderBling.data.retorno.erros[0].erro.msg)
    throw new Error(responseOrderBling.data.retorno.erros[0].erro.msg)
  }

  const orderBling = responseOrderBling.data.retorno.pedidos[0].pedido
  body.blingId = orderBling.idPedido

  return OrderRepository.createOrder(body)
}

async function createOrderBling(body, item_cod) {
  const order = {
    pedido: {
      cliente: {
        name: body.clientName,
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

module.exports.getOrders = async ({ page = 1, limit = 10 }) => {
  if (typeof page !== Number) page = 1
  if (typeof limit !== Number) limit = 10

  return OrderRepository.getOrders(page, limit)
}
