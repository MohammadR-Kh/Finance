
const express = require('express');
const router = express.Router();
const Report = require('../models/reportsModel');

router.post('/', async (req, res) => {
  const {title, description } = req.body;

  try {
    const newReport = new Report({
      title,
      description
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Unable to save report' });
  }
});
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ message: 'Report deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const report = await Report.findByIdAndUpdate(id, updatedData, { new: true });
    if (!report) {
      return res.status(404).send('Report not found');
    }
    res.json(report);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
