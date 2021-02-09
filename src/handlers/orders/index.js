const { createOrder } = require('../../services/orders')

module.exports.createOrder = async (event, context) => {
  try {
    const { current } = JSON.parse(event.body)
    if (current.status === 'won') {
      await createOrder(current)
      return { statusCode: 201 }
    }
  } catch (error) {
    console.error(`Error in function ${context.functionName}`, error)
    throw error
  }
}
