const History = require("../models/entity/History");
const { historyService } = require("../services/history.service");

exports.getAllHistory = async (req, res) => {
  try {
    const filter = { ...req.query };
    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);

    const result = await historyService.selectAll(filter, page, limit);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const updatedHistory = await History.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedHistory) {
      return res.status(404).send("History not found");
    }
    res.send(updatedHistory);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send(error);
  }
};
