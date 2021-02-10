const { Schema, model } = require('../../database')

const orderSchema = new Schema(
  {
    pipedriveId: {
      type: String,
      required: true,
      unique: true,
    },
    blingId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    ownerName: {
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
