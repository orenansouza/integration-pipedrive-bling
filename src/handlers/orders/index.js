const OrderService = require('../../services/orders')

module.exports.createOrder = async (event, context) => {
  try {
    const { current } = JSON.parse(event.body)
    if (current.status === 'won') {
      await OrderService.createOrder(current)
      return { statusCode: 201 }
    }
  } catch (error) {
    console.error(`Error in function ${context.functionName}`, error)
    throw error
  }
}

module.exports.getOrders = async (event, context) => {
  try {
    const querystring = event.queryStringParameters
    const orders = await OrderService.getOrders(querystring)

    return {
      statusCode: 200,
      body: JSON.stringify({ data: orders }),
    }
  } catch (error) {
    console.error(`Error in ${context.functionName}`, error)
    throw error
  }
}
