// history.js
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: new ObjectId()
  },
  robotId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  totalPieces: {
    type: Number,
    required: false
  },
  palatizedPieces: {
    type: Number,
    required: false,
    default: 0
  },
  completedPallets: {
    type: Number,
    required: false,
    default: 0
  },
  totalExecutionDuration: {
    type: Number,
    required: false
  },
  palatizeExecutionDuration: {
    type: Number,
    required: false,
    default: 0
  },
  startExecutionAt: {
    type: Date,
    required: true,
  },
  endExecutionAt: {
    type: Date,
    required: true,
  }
});

module.exports = mongoose.model('History', HistorySchema);
