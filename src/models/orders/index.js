const { Schema, model } = require('../../database')

const orderSchema = new Schema(
  {
    pipedrive_id: {
      type: String,
      required: true,
      unique: true,
    },
    bling_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    client_name: {
      type: String,
      required: true,
    },
    owner_name: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model('Order', orderSchema)
