// robot.js
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const robotSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId
  },
  reference: {
    type: String,
    required: false
  },
  ip_robot: {
    type: String,
    required: false
  },
  totalPieces: {
    type: Number,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  }
});

module.exports = mongoose.model('robot', robotSchema);
