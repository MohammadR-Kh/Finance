const express = require('express');
const router = express.Router();
const Transaction = require('../models/transactionModel');

router.post('/', async (req, res) => {
  const { date, description, category, amount, type } = req.body;

  try {
    const newTransaction = new Transaction({
      date,
      description,
      category,
      amount,
      type
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.status(200).json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const transaction = await Transaction.findByIdAndUpdate(id, updatedData, { new: true });
    if (!transaction) {
      return res.status(404).send('Transaction not found');
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).send('Server error');
  }
});
router.get('/summary', async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  try {
    const matchStage = { type: { $in: ['Income', 'Expense'] } };
    if (startDate || endDate) {
      matchStage.date = dateFilter;
    }

    const totalIncome = await Transaction.aggregate([
      { $match: { ...matchStage, type: 'Income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalExpenses = await Transaction.aggregate([
      { $match: { ...matchStage, type: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const income = totalIncome[0]?.total || 0;
    const expenses = totalExpenses[0]?.total || 0;
    const remainingBalance = income - expenses;

    res.status(200).json({ totalIncome: income, totalExpenses: expenses, remainingBalance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch summary data' });
  }
});
router.get('/chart-data', async (req, res) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  try {
    const matchStage = { type: { $in: ['Income', 'Expense'] } };
    if (startDate || endDate) {
      matchStage.date = dateFilter;
    }

    const chartData = await Transaction.aggregate([
      { $match: matchStage },
      { 
        $group: {
          _id: { date: "$date", type: "$type" },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.date": 1 } }
    ]);

    const formattedData = chartData.reduce((acc, curr) => {
      const date = curr._id.date.toISOString().split('T')[0];
      const type = curr._id.type;
      if (!acc[date]) {
        acc[date] = { Income: 0, Expense: 0 };
      }
      acc[date][type] = curr.totalAmount;
      return acc;
    }, {});

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
});



module.exports = router;
